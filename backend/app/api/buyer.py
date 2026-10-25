from datetime import datetime
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from app.db import get_db
from app.dependencies import require_roles
from pathlib import Path

from app.models import (
    User,
    Domain,
    Problem,
    Question,
    Enquiry,
    QuestionAnswer,
    EnquiryMatch,
    Quotation,
    Handshake,
    CRMEvent,
    EnquiryStatus,
    QuotationStatus,
    HandshakeStatus,
    EnquiryReport,
)

from app.schemas.enquiry import (
    EnquiryCreate,
    HandshakeAction,
)

from app.services.email import (
    send_enquiry_submitted_email,
    send_quotation_rejected_email,
    send_buyer_acceptance_email,
    send_vendor_matched_email,
    send_mutual_handshake_buyer_email,
    send_mutual_handshake_vendor_email,
    send_buyer_enquiry_confirmation_email,
    send_vendor_new_enquiry_email,
)

from app.core.config import settings


router = APIRouter(
    prefix="/buyer",
    tags=["Buyer"],
)


# ============================================================
# BUYER DASHBOARD
# ============================================================

@router.get("/dashboard")
def dashboard(
    user=Depends(require_roles("buyer")),
    db: Session = Depends(get_db),
):

    enquiries = (
        db.query(Enquiry)
        .filter(
            Enquiry.buyer_id == user.id
        )
        .order_by(
            Enquiry.id.desc()
        )
        .all()
    )

    approved = {
        EnquiryStatus.APPROVED.value,
        EnquiryStatus.MATCHED.value,
        EnquiryStatus.QUOTATION.value,
        EnquiryStatus.ACCEPTED.value,
        EnquiryStatus.CLOSED.value,
    }

    return {
        "stats": {
            "enquiries": len(enquiries),

            "pending_approval": sum(
                e.status
                == EnquiryStatus.SUBMITTED.value
                for e in enquiries
            ),

            "approved": sum(
                e.status in approved
                for e in enquiries
            ),

            "quotations": sum(
                len(e.quotations)
                for e in enquiries
            ),


            "accepted_quotations": sum(
                1
                for e in enquiries
                for q in e.quotations
                if str(q.status).upper().split(".")[-1] == "ACCEPTED"
            ),


            "rejected_quotations": sum(
                1
                for e in enquiries
                for q in e.quotations
                if str(q.status).upper().split(".")[-1] == "REJECTED"
            ),

            "closed": sum(
                e.status
                == EnquiryStatus.CLOSED.value
                for e in enquiries
            ),
        },

        "enquiries": [
            {
                "id": e.id,
                "title": e.title,
                "domain": e.domain.name,
                "problem": e.problem.name,
                "status": e.status,
                "submitted_at": e.submitted_at,
                "matches": len(e.matches),
                "quotations": len(e.quotations),
            }
            for e in enquiries
        ],
    }



# ============================================================
# CREATE ENQUIRY
# ============================================================

@router.post("/enquiries")
async def create_enquiry(
    payload: EnquiryCreate,
    user=Depends(require_roles("buyer")),
    db: Session = Depends(get_db),
):
    # --------------------------------------------------------
    # VALIDATE DOMAIN AND PROBLEM
    # --------------------------------------------------------
    problem = db.get(Problem, payload.problem_id)
    domain = db.get(Domain, payload.domain_id)

    if (
        not problem
        or not domain
        or problem.domain_id != domain.id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid domain/problem",
        )

    # --------------------------------------------------------
    # VALIDATE REQUIRED QUESTIONS
    # --------------------------------------------------------
    qs = (
        db.query(Question)
        .filter(Question.problem_id == problem.id)
        .all()
    )

    answers = payload.answers or {}

    missing = [
        q.field_key
        for q in qs
        if q.required
        and not str(answers.get(q.field_key, "")).strip()
    ]

    if missing:
        raise HTTPException(
            status_code=422,
            detail={"missing_fields": missing},
        )

    dossier = "\n".join(
        f"{q.question_text}: {answers.get(q.field_key, '')}"
        for q in qs
    )

    # --------------------------------------------------------
    # CREATE ENQUIRY
    # --------------------------------------------------------
    e = Enquiry(
        buyer_id=user.id,
        domain_id=domain.id,
        problem_id=problem.id,
        title=payload.title,
        status=EnquiryStatus.APPROVED.value,
        dossier=dossier,
        special_note=(payload.special_note or "").strip() or None,
    )

    db.add(e)
    db.flush()

    # --------------------------------------------------------
    # MATCHING RULES
    #
    # 1. Domain match is COMPULSORY.
    # 2. Domain + Industry/Vertical = 100 points.
    # 3. Domain only = 60 points.
    # 4. Industry/Vertical only = NOT eligible.
    # 5. Maximum 10 vendors, highest score first.
    # --------------------------------------------------------

    
    def normalize_values(value):
        if value is None:
            return set()

        # JSON string किंवा comma-separated string हाताळा
        if isinstance(value, str):
            value = value.strip()

            if not value:
                return set()

            # domains हे JSON list स्वरूपात असू शकतात
            import json
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    value = parsed
                else:
                    value = [value]
            except (json.JSONDecodeError, TypeError):
                # industrial_verticals: comma-separated string
                value = value.split(",")

        if isinstance(value, (list, tuple, set)):
            return {
                str(item).strip().casefold()
                for item in value
                if item is not None and str(item).strip()
            }

        return set()


    enquiry_domain = (domain.name or "").strip().casefold()

    # Buyer industry is taken from the buyer profile.
    buyer_profile = getattr(user, "buyer_profile", None)

    buyer_industries = normalize_values(
        getattr(buyer_profile, "industry", None)
    )

    vendors = (
        db.query(User)
        .filter(
            User.role == "vendor",
            User.is_active.is_(True),
            User.email_verified.is_(True),
        )
        .all()
    )

    vendor_scores = []

    for vendor in vendors:
        profile = getattr(vendor, "vendor_profile", None)

        if not profile:
            continue

        # DOMAIN MATCH IS REQUIRED
        vendor_domains = normalize_values(
            getattr(profile, "domains", None)
        )

        if enquiry_domain not in vendor_domains:
            continue

        # Check vendor industrial verticals against buyer industry.
        vendor_verticals = normalize_values(
            getattr(profile, "industrial_verticals", None)
        )

        industry_match = bool(
            buyer_industries & vendor_verticals
        )

        # Domain match is 60; industry/vertical match adds 40.
        score = 100.0 if industry_match else 60.0

        vendor_scores.append((vendor, score))

    # Best matches first; use vendor ID as a stable tie-breaker.
    vendor_scores.sort(
        key=lambda item: (-item[1], item[0].id)
    )

    # Maximum 10 vendors per enquiry.
    vendor_scores = vendor_scores[:10]

    matched_vendors = []

    # --------------------------------------------------------
    # CREATE MATCH RECORDS
    # --------------------------------------------------------
    for vendor, score in vendor_scores:
        matched_vendors.append(vendor)

        db.add(
            EnquiryMatch(
                enquiry_id=e.id,
                vendor_id=vendor.id,
                match_score=score,
                notified=False,
            )
        )

    # --------------------------------------------------------
    # SAVE QUESTION ANSWERS
    # --------------------------------------------------------
    for q in qs:
        db.add(
            QuestionAnswer(
                enquiry_id=e.id,
                question_id=q.id,
                answer=str(answers.get(q.field_key, "")),
            )
        )

    # --------------------------------------------------------
    # UPDATE STATUS
    # --------------------------------------------------------
    if matched_vendors:
        e.status = EnquiryStatus.MATCHED.value
    else:
        e.status = EnquiryStatus.APPROVED.value

    # --------------------------------------------------------
    # CRM EVENT
    # --------------------------------------------------------
    db.add(
        CRMEvent(
            enquiry_id=e.id,
            actor_id=user.id,
            event_type="enquiry_submitted",
            note=(
                "Technical enquiry submitted. "
                f"{len(matched_vendors)} domain-matched vendor(s) "
                "selected; industry/vertical matches ranked first."
            ),
        )
    )

    db.commit()
    db.refresh(e)

    # --------------------------------------------------------
    # EMAIL: ADMIN
    # --------------------------------------------------------
    await send_enquiry_submitted_email(
        admin_email=settings.ADMIN_EMAIL,
        enquiry=e,
        buyer=user,
    )

    # --------------------------------------------------------
    # EMAIL: BUYER
    # --------------------------------------------------------
    if user.email:
        await send_buyer_enquiry_confirmation_email(
            buyer=user,
            enquiry=e,
        )

    # --------------------------------------------------------
    # EMAIL: MATCHED VENDORS
    # --------------------------------------------------------
    for vendor in matched_vendors:
        if not vendor.email:
            continue

        await send_vendor_new_enquiry_email(
            vendor=vendor,
            enquiry=e,
        )

        match = (
            db.query(EnquiryMatch)
            .filter(
                EnquiryMatch.enquiry_id == e.id,
                EnquiryMatch.vendor_id == vendor.id,
            )
            .first()
        )

        if match:
            match.notified = True

    db.commit()

    return {
        "message": (
            "Enquiry submitted and matched with suitable vendors."
            if matched_vendors
            else "Enquiry submitted. No domain-matched vendor found."
        ),
        "enquiry_id": e.id,
        "status": e.status,
        "matched_vendors": len(matched_vendors),
    }


# ============================================================
# GET BUYER ENQUIRY DETAIL
# ============================================================

@router.get("/enquiries/{enquiry_id}")
def enquiry(
    enquiry_id: int,
    user=Depends(require_roles("buyer")),
    db: Session = Depends(get_db),
):

    e = (
        db.query(Enquiry)
        .filter(
            Enquiry.id == enquiry_id,
            Enquiry.buyer_id == user.id,
        )
        .first()
    )

    if not e:
        raise HTTPException(
            404,
            "Enquiry not found",
        )

    hs = e.handshake

    unlocked = bool(
        hs
        and hs.status
        == HandshakeStatus.MUTUAL.value
    )

    approved_for_matching = (
        e.status
        in {
            EnquiryStatus.APPROVED.value,
            EnquiryStatus.MATCHED.value,
            EnquiryStatus.QUOTATION.value,
            EnquiryStatus.ACCEPTED.value,
            EnquiryStatus.CLOSED.value,
        }
    )

    return {
        "id": e.id,
        "title": e.title,
        "domain": e.domain.name,
        "problem": e.problem.name,
        "status": e.status,

        "approval": {
            "approved": (
                e.status
                in {
                    EnquiryStatus.APPROVED.value,
                    EnquiryStatus.MATCHED.value,
                    EnquiryStatus.QUOTATION.value,
                    EnquiryStatus.ACCEPTED.value,
                    EnquiryStatus.CLOSED.value,
                }
            ),

            "matching_active":
                approved_for_matching,
        },

        "dossier": e.dossier,
        "special_note": e.special_note,

        "matches": [
            {
                "id": m.id,
                "score": m.match_score,

                "vendor_name": (
                    m.vendor.vendor_profile.company_name
                    if unlocked
                    and m.vendor
                    and m.vendor.vendor_profile
                    else "Matched vendor"
                ),
            }

            for m in e.matches
        ],

        "quotations": [
            {
                "id": q.id,
                "vendor_id": q.vendor_id,

                "vendor_company": (
                    q.vendor.vendor_profile.company_name
                    if unlocked
                    and q.vendor
                    and q.vendor.vendor_profile
                    else "Matched vendor"
                ),

                "capex": q.capex,
                "opex": q.opex,
                "technology": q.technology,
                "implementation_time":
                    q.implementation_time,
                "warranty": q.warranty,
                "amc": q.amc,
                "has_question_file": bool(q.question_file_path),
                "question_file_name": (
                        getattr(q, "question_file_name", None)
                        or Path(q.question_file_path).name
                        if q.question_file_path
                        else None
                    ),
                "notes": q.proposal_notes,
                "status": q.status,
            }

            for q in e.quotations
        ],

        "handshake": {
            "status": (
                hs.status
                if hs
                else "pending"
            ),

            "buyer_accepted": (
                hs.buyer_accepted
                if hs
                else False
            ),

            "vendor_accepted": (
                hs.vendor_accepted
                if hs
                else False
            ),

            "contact_unlocked":
                unlocked,
        },

        "unlocked_contact": (
            {
                "vendor_name":
                    hs.quotation.vendor.vendor_profile.company_name,

                "vendor_email":
                    hs.quotation.vendor.email,

                "vendor_phone":
                    hs.quotation.vendor.phone,
            }

            if unlocked
            and hs
            and hs.quotation
            and hs.quotation.vendor

            else None
        ),
    }


# ============================================================
# BUYER ACCEPT / REJECT QUOTATION
# ============================================================

@router.post("/handshake")
async def buyer_handshake(
    payload: HandshakeAction,
    user=Depends(require_roles("buyer")),
    db: Session = Depends(get_db),
):

    q = db.get(
        Quotation,
        payload.quotation_id,
    )

    if not q:
        raise HTTPException(
            404,
            "Quotation not found",
        )

    e = q.enquiry

    # ========================================================
    # SECURITY CHECK
    # ========================================================

    if e.buyer_id != user.id:
        raise HTTPException(
            403,
            "Not your enquiry",
        )

    # ========================================================
    # BUYER REJECTS QUOTATION
    # ========================================================

    if not payload.accept:

        q.status = (
            QuotationStatus.REJECTED.value
        )

        db.add(
            CRMEvent(
                enquiry_id=e.id,
                actor_id=user.id,
                event_type="quotation_rejected",
                note=(
                    f"Buyer rejected "
                    f"quotation #{q.id}."
                ),
            )
        )

        db.commit()

        # ----------------------------------------------------
        # EMAIL → VENDOR
        # ----------------------------------------------------

        if q.vendor and q.vendor.email:

            await send_quotation_rejected_email(
                vendor=q.vendor,
                enquiry=e,
                quotation=q,
            )

        return {
            "message":
                "Quotation rejected",

            "mutual": False,
        }

    # ========================================================
    # BUYER ACCEPTS QUOTATION
    # ========================================================

    q.status = (
        QuotationStatus.ACCEPTED.value
    )

    hs = e.handshake

    # ========================================================
    # PREVENT DIFFERENT QUOTATION SELECTION
    # ========================================================

    if (
        hs
        and hs.quotation_id != q.id
    ):
        raise HTTPException(
            409,
            "Another quotation is already selected "
            "for this enquiry.",
        )

    # ========================================================
    # CREATE HANDSHAKE
    # ========================================================

    if not hs:

        hs = Handshake(
            enquiry_id=e.id,
            quotation_id=q.id,
        )

        db.add(hs)

    hs.quotation_id = q.id

    hs.buyer_accepted = True

    hs.buyer_accepted_at = (
        datetime.utcnow()
    )

    mutual = False

    # ========================================================
    # VENDOR ALREADY ACCEPTED
    # ========================================================

    if hs.vendor_accepted:

        hs.status = (
            HandshakeStatus.MUTUAL.value
        )

        hs.contact_unlocked_at = (
            datetime.utcnow()
        )

        e.status = (
            EnquiryStatus.ACCEPTED.value
        )

        mutual = True

        db.add(
            CRMEvent(
                enquiry_id=e.id,
                actor_id=user.id,
                event_type="mutual_handshake",
                note=(
                    "Buyer and vendor mutually "
                    "accepted; contacts unlocked."
                ),
            )
        )

    # ========================================================
    # WAITING FOR VENDOR
    # ========================================================

    else:

        hs.status = (
            HandshakeStatus.PENDING.value
        )

        db.add(
            CRMEvent(
                enquiry_id=e.id,
                actor_id=user.id,
                event_type="buyer_acceptance",
                note=(
                    f"Buyer accepted quotation "
                    f"#{q.id}; vendor confirmation pending."
                ),
            )
        )

    db.commit()

    # ========================================================
    # EMAILS
    # ========================================================

    if mutual:

        # ----------------------------------------------------
        # BUYER → CONFIRMATION
        # ----------------------------------------------------

        if user.email:

            await send_mutual_handshake_buyer_email(
                buyer=user,
                enquiry=e,
            )

        # ----------------------------------------------------
        # VENDOR → CONFIRMATION
        # ----------------------------------------------------

        if q.vendor and q.vendor.email:

            await send_mutual_handshake_vendor_email(
                vendor=q.vendor,
                enquiry=e,
            )

    else:

        # ----------------------------------------------------
        # VENDOR → BUYER ACCEPTED
        # ----------------------------------------------------

        if q.vendor and q.vendor.email:

            await send_buyer_acceptance_email(
                vendor=q.vendor,
                enquiry=e,
                quotation=q,
            )

    return {
        "message":
            "Buyer acceptance recorded",

        "mutual":
            mutual,
    }


# ============================================================
# BUYER CRM
# ============================================================

@router.get("/crm")
def crm(
    user=Depends(require_roles("buyer")),
    db: Session = Depends(get_db),
):

    rows = (
        db.query(
            CRMEvent,
            Enquiry,
        )
        .join(
            Enquiry,
            Enquiry.id
            == CRMEvent.enquiry_id,
        )
        .filter(
            Enquiry.buyer_id
            == user.id
        )
        .order_by(
            CRMEvent.created_at.desc()
        )
        .all()
    )

    return [
        {
            "enquiry_id": e.id,
            "title": e.title,
            "event": ev.event_type,
            "note": ev.note,
            "created_at": ev.created_at,
        }

        for ev, e in rows
    ]




REPORTS_DIR = Path(__file__).resolve().parents[2] / "uploads" / "enquiry_reports"
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/enquiries/{enquiry_id}/reports")
async def upload_enquiry_report(
    enquiry_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("buyer")),
):
    enquiry = (
        db.query(Enquiry)
        .filter(
            Enquiry.id == enquiry_id,
            Enquiry.buyer_id == user.id,
        )
        .first()
    )

    if not enquiry:
        raise HTTPException(
            status_code=404,
            detail="Enquiry not found or access denied",
        )

    original_filename = Path(file.filename or "report").name
    extension = Path(original_filename).suffix.lower()

    allowed_extensions = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".csv"}

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type",
        )

    stored_filename = f"{uuid.uuid4().hex}{extension}"
    file_path = REPORTS_DIR / stored_filename

    max_size = 10 * 1024 * 1024
    size = 0

    try:
        with file_path.open("wb") as destination:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                size += len(chunk)

                if size > max_size:
                    raise HTTPException(
                        status_code=413,
                        detail="File size must not exceed 10 MB",
                    )

                destination.write(chunk)

        report = EnquiryReport(
            enquiry_id=enquiry.id,
            original_filename=original_filename,
            stored_filename=stored_filename,
            file_path=str(file_path),
            content_type=file.content_type,
        )

        db.add(report)
        db.commit()
        db.refresh(report)

        return {
            "message": "Report uploaded successfully",
            "report_id": report.id,
            "enquiry_id": report.enquiry_id,
            "filename": report.original_filename,
        }

    except Exception:
        if file_path.exists():
            file_path.unlink(missing_ok=True)

        db.rollback()
        raise

    finally:
        await file.close()





@router.get("/quotations/{quotation_id}/file")
def get_quotation_file(
    quotation_id: int,
    download: bool = False,
    user=Depends(require_roles("buyer")),
    db: Session = Depends(get_db),
):
    quotation = (
        db.query(Quotation)
        .join(Enquiry, Quotation.enquiry_id == Enquiry.id)
        .filter(
            Quotation.id == quotation_id,
            Enquiry.buyer_id == user.id,
        )
        .first()
    )

    if not quotation:
        raise HTTPException(
            status_code=404,
            detail="Quotation not found or access denied",
        )

    if not quotation.question_file_path:
        raise HTTPException(
            status_code=404,
            detail="No technical file attached to this quotation",
        )

    file_path = Path(quotation.question_file_path).resolve()

    # Ensure the stored path is inside the designated upload folder.
    upload_dir = (
        Path(__file__).resolve().parents[2]
        / "uploads"
        / "question_files"
    ).resolve()

    if not file_path.is_relative_to(upload_dir):
        raise HTTPException(status_code=403, detail="Invalid file path")

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Uploaded file not found on server",
        )

    filename = (
        getattr(quotation, "question_file_name", None)
        or file_path.name
    )

    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="application/octet-stream",
        content_disposition_type="attachment" if download else "inline",
    )

