from pathlib import Path
from datetime import datetime, timedelta
from uuid import uuid4
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)
from starlette.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.config import ENQUIRY_REPORTS_DIR, QUESTION_FILES_DIR

from app.db import get_db
from app.dependencies import require_roles

from app.models import (
    User,
    EnquiryMatch,
    Enquiry,
    Quotation,
    Handshake,
    EnquiryStatus,
    QuotationStatus,
    HandshakeStatus,
    CRMEvent,
    EnquiryReport,
)

from app.schemas.enquiry import HandshakeAction

from app.services.email import (
    send_quotation_submitted_email,
    send_quotation_rejected_email,
    send_vendor_acceptance_email,
    send_vendor_declined_email,
    send_mutual_handshake_buyer_email,
    send_mutual_handshake_vendor_email,
)


router = APIRouter(prefix="/vendor", tags=["Vendor"])


# ============================================================
# CONSTANTS
# ============================================================

REPORTS_DIR = QUESTION_FILES_DIR

ALLOWED_QUESTION_FILE_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
}

MAX_QUESTION_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

QUOTATION_WINDOW_HOURS = 240


# ============================================================
# HELPERS
# ============================================================

def _deadline(enquiry):
    if not enquiry.submitted_at:
        return None

    return enquiry.submitted_at + timedelta(
        hours=QUOTATION_WINDOW_HOURS
    )


def _norm_status(value):
    """Normalize enum values like 'EnquiryStatus.CLOSED' to 'CLOSED'."""
    if value is None:
        return None
    return str(value).upper().split(".")[-1]


def _vendor_quotation(enquiry, vendor_id):
    """Return the vendor's quotation on this enquiry (or None)."""
    for q in enquiry.quotations:
        if q.vendor_id == vendor_id:
            return q
    return None


# ============================================================
# VENDOR DASHBOARD
# ============================================================

@router.get("/dashboard")
def dashboard(
    user=Depends(require_roles("vendor")),
    db: Session = Depends(get_db),
):
    matches = (
        db.query(EnquiryMatch)
        .join(Enquiry)
        .filter(
            EnquiryMatch.vendor_id == user.id,
            Enquiry.status.in_(
                [
                    EnquiryStatus.APPROVED.value,
                    EnquiryStatus.MATCHED.value,
                    EnquiryStatus.QUOTATION.value,
                    EnquiryStatus.ACCEPTED.value,
                    EnquiryStatus.CLOSED.value,
                ]
            ),
        )
        .order_by(
            EnquiryMatch.match_score.desc(),
            Enquiry.id.desc(),
        )
        .all()
    )

    quotations = (
        db.query(Quotation)
        .filter(Quotation.vendor_id == user.id)
        .all()
    )

    # --------------------------------------------------------
    # Build matches with full detail
    # --------------------------------------------------------

    match_rows = []

    for m in matches:
        e = m.enquiry
        q = _vendor_quotation(e, user.id)

        quote_status = _norm_status(q.status) if q else None
        enquiry_status = _norm_status(e.status)

        hs = e.handshake
        handshake_status = _norm_status(hs.status) if hs else None

        buyer_accepted = bool(
            hs
            and hs.buyer_accepted
            and hs.quotation_id
            and q
            and hs.quotation_id == q.id
        )
        vendor_accepted = bool(
            hs
            and hs.vendor_accepted
            and hs.quotation_id
            and q
            and hs.quotation_id == q.id
        )
        mutual = handshake_status == "MUTUAL"

        match_rows.append({
            "id": e.id,
            "title": e.title,
            "domain": e.domain.name,
            "problem": e.problem.name,
            "score": m.match_score,
            "status": enquiry_status,
            "submitted_at": e.submitted_at,
            "quotation_deadline": _deadline(e),
            "quotation_exists": bool(q),
            "quotation_status": quote_status,
            "buyer_accepted": buyer_accepted,
            "vendor_accepted": vendor_accepted,
            "mutual": mutual,
            "outcome": getattr(e, "outcome", None),
        })

    # --------------------------------------------------------
    # Live counts
    # --------------------------------------------------------

    def count(fn):
        return sum(1 for r in match_rows if fn(r))

    stats = {
        "new": count(lambda r: not r["quotation_exists"] and r["status"] != "CLOSED"),
        "current": count(lambda r: not r["quotation_exists"] and r["status"] != "CLOSED"),
        "quoted": count(
            lambda r: r["quotation_exists"]
            and r["status"] != "CLOSED"
            and r["quotation_status"] not in ("ACCEPTED", "REJECTED")
        ),
        "accepted": count(
            lambda r: r["quotation_status"] == "ACCEPTED" or r["buyer_accepted"]
        ),
        "rejected": count(lambda r: r["quotation_status"] == "REJECTED"),
        "win": count(
            lambda r: r["status"] == "CLOSED"
            and str(r["outcome"] or "").lower() == "win"
        ),
        "loss": count(
            lambda r: r["status"] == "CLOSED"
            and str(r["outcome"] or "").lower() == "loss"
        ),
        "history": count(lambda r: r["status"] == "CLOSED"),

        # legacy keys kept for compatibility
        "matching_suggestions": len(matches),
        "quotations": len(quotations),
        "closed": sum(
            1 for q in quotations
            if _norm_status(q.enquiry.status) == "CLOSED"
        ),
    }

    return {
        "stats": stats,
        "matches": match_rows,
    }


# ============================================================
# VIEW MATCHED ENQUIRY
# ============================================================

@router.get("/enquiries/{enquiry_id}")
def view_enquiry(
    enquiry_id: int,
    user=Depends(require_roles("vendor")),
    db: Session = Depends(get_db),
):
    match = (
        db.query(EnquiryMatch)
        .filter(
            EnquiryMatch.enquiry_id == enquiry_id,
            EnquiryMatch.vendor_id == user.id,
        )
        .first()
    )

    if not match:
        raise HTTPException(
            403,
            "This enquiry is not assigned to you",
        )

    e = match.enquiry

    if e.status not in [
        EnquiryStatus.APPROVED.value,
        EnquiryStatus.MATCHED.value,
        EnquiryStatus.QUOTATION.value,
        EnquiryStatus.ACCEPTED.value,
        EnquiryStatus.CLOSED.value,
    ]:
        raise HTTPException(
            403,
            "This enquiry is not approved for vendors",
        )

    q = (
        db.query(Quotation)
        .filter(
            Quotation.enquiry_id == e.id,
            Quotation.vendor_id == user.id,
        )
        .first()
    )

    hs = e.handshake

    unlocked = bool(
        hs
        and hs.status == HandshakeStatus.MUTUAL.value
        and q
        and hs.quotation_id == q.id
    )

    deadline = _deadline(e)

    now = datetime.utcnow()

    quotation_window_open = (
        deadline is not None
        and now <= deadline
    )

    return {
        "id": e.id,
        "title": e.title,
        "domain": e.domain.name,
        "problem": e.problem.name,
        "status": e.status,
        "dossier": e.dossier,
        "special_note": e.special_note,

        "match_score": match.match_score,

        "quotation_deadline": deadline,

        "quotation_window_open": quotation_window_open,

        "buyer_masked": not unlocked,

        "quotation_exists": bool(q),

        "quotation_id": q.id if q else None,

        "quotation_status": q.status if q else None,

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
        },

        "buyer_contact": (
            {
                "name": e.buyer.full_name,
                "email": e.buyer.email,
                "phone": e.buyer.phone,
                "company": (
                    e.buyer.buyer_profile.company_name
                ),
            }
            if unlocked and e.buyer
            else None
        ),
    }


# ============================================================
# SUBMIT QUOTATION
# ============================================================

@router.post("/quotations")
async def quotation(
    enquiry_id: int = Form(...),
    capex: float = Form(...),
    opex: float | None = Form(None),
    technology: str = Form(...),
    implementation_time: str = Form(...),
    warranty: str | None = Form(None),
    amc: str | None = Form(None),
    proposal_notes: str | None = Form(None),
    question_file: UploadFile | None = File(None),
    user=Depends(require_roles("vendor")),
    db: Session = Depends(get_db),
):
    match = (
        db.query(EnquiryMatch)
        .filter(
            EnquiryMatch.enquiry_id == enquiry_id,
            EnquiryMatch.vendor_id == user.id,
        )
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=403,
            detail="You are not matched to this enquiry",
        )

    e = match.enquiry

    if e.status not in [
        EnquiryStatus.APPROVED.value,
        EnquiryStatus.MATCHED.value,
        EnquiryStatus.QUOTATION.value,
    ]:
        raise HTTPException(
            status_code=400,
            detail="Quotation is available only for a matched enquiry.",
        )

    deadline = _deadline(e)

    if deadline and datetime.utcnow() > deadline:
        raise HTTPException(
            status_code=400,
            detail="The 240-hour quotation window has expired.",
        )

    existing = (
        db.query(Quotation)
        .filter(
            Quotation.enquiry_id == enquiry_id,
            Quotation.vendor_id == user.id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Quotation already submitted",
        )


    # Optional vendor question/technical document
    saved_file_path = None

    if question_file and question_file.filename:
        extension = Path(question_file.filename).suffix.lower()

        if extension not in ALLOWED_QUESTION_FILE_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported file type. Upload PDF, DOC, DOCX, "
                    "XLS, XLSX, PNG or JPG."
                ),
            )

        content = await question_file.read()

        if len(content) > MAX_QUESTION_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size must be 10 MB or less.",
            )

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        # Unique filename avoids collisions and unsafe original filenames
        stored_filename = f"{uuid4().hex}{extension}"
        destination = REPORTS_DIR / stored_filename

        destination.write_bytes(content)
        saved_file_path = str(destination.resolve())

    q = Quotation(
        enquiry_id=enquiry_id,
        vendor_id=user.id,
        capex=capex,
        opex=opex,
        technology=technology.strip(),
        implementation_time=implementation_time.strip(),
        warranty=warranty.strip() if warranty else None,
        amc=amc.strip() if amc else None,
        proposal_notes=(
            proposal_notes.strip() if proposal_notes else None
        ),
        question_file_path=saved_file_path,
        question_file_name=(
            Path(question_file.filename).name
            if question_file and question_file.filename
            else None
        ),
    )

    try:
        db.add(q)
        db.flush()

        e.status = EnquiryStatus.QUOTATION.value

        db.add(
            CRMEvent(
                enquiry_id=e.id,
                actor_id=user.id,
                event_type="quotation_submitted",
                note=f"Quotation #{q.id} submitted.",
            )
        )

        db.commit()
        db.refresh(q)

    except Exception:
        db.rollback()

        if saved_file_path:
            Path(saved_file_path).unlink(missing_ok=True)

        raise HTTPException(
            status_code=500,
            detail="Unable to save quotation.",
        )

    await send_quotation_submitted_email(
        buyer=e.buyer,
        enquiry=e,
        quotation=q,
    )

    return {
        "message": "Quotation submitted",
        "quotation_id": q.id,
        "quotation_deadline": deadline,
        "question_file_uploaded": bool(q.question_file_path),
    }

# ============================================================
# VENDOR HANDSHAKE
# ============================================================

@router.post("/handshake")
async def vendor_handshake(
    payload: HandshakeAction,
    user=Depends(require_roles("vendor")),
    db: Session = Depends(get_db),
):
    q = db.get(
        Quotation,
        payload.quotation_id,
    )

    if not q or q.vendor_id != user.id:
        raise HTTPException(
            404,
            "Quotation not found",
        )

    hs = q.enquiry.handshake

    if not hs or hs.quotation_id != q.id:
        raise HTTPException(
            400,
            "Buyer has not selected this quotation yet.",
        )

    # VENDOR DECLINES
    if not payload.accept:
        hs.status = HandshakeStatus.DECLINED.value

        db.add(
            CRMEvent(
                enquiry_id=q.enquiry_id,
                actor_id=user.id,
                event_type="handshake_declined",
                note=f"Vendor declined connection for quotation #{q.id}.",
            )
        )

        db.commit()

        await send_vendor_declined_email(
            buyer=q.enquiry.buyer,
            enquiry=q.enquiry,
        )

        return {
            "message": "Connection declined",
            "mutual": False,
        }

    # VENDOR ACCEPTS
    hs.vendor_accepted = True
    hs.vendor_accepted_at = datetime.utcnow()

    mutual = False

    if hs.buyer_accepted:
        hs.status = HandshakeStatus.MUTUAL.value
        hs.contact_unlocked_at = datetime.utcnow()
        q.enquiry.status = EnquiryStatus.ACCEPTED.value
        mutual = True

        db.add(
            CRMEvent(
                enquiry_id=q.enquiry_id,
                actor_id=user.id,
                event_type="mutual_handshake",
                note="Buyer and vendor mutually accepted; contacts unlocked.",
            )
        )
    else:
        hs.status = HandshakeStatus.PENDING.value

        db.add(
            CRMEvent(
                enquiry_id=q.enquiry_id,
                actor_id=user.id,
                event_type="vendor_acceptance",
                note="Vendor accepted; waiting for buyer acceptance.",
            )
        )

    db.commit()

    if mutual:
        await send_mutual_handshake_buyer_email(
            buyer=q.enquiry.buyer,
            enquiry=q.enquiry,
        )
        await send_mutual_handshake_vendor_email(
            vendor=user,
            enquiry=q.enquiry,
        )
    else:
        await send_vendor_acceptance_email(
            buyer=q.enquiry.buyer,
            enquiry=q.enquiry,
        )

    return {
        "message": "Vendor acceptance recorded",
        "mutual": mutual,
    }


# ============================================================
# VENDOR CRM
# ============================================================

@router.get("/crm")
def crm(
    user=Depends(require_roles("vendor")),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(CRMEvent, Enquiry)
        .join(
            Enquiry,
            Enquiry.id == CRMEvent.enquiry_id,
        )
        .join(
            EnquiryMatch,
            EnquiryMatch.enquiry_id == Enquiry.id,
        )
        .filter(
            EnquiryMatch.vendor_id == user.id
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




# ============================================================
# VIEW / DOWNLOAD MATCHED ENQUIRY REPORTS
# ============================================================

@router.get("/enquiries/{enquiry_id}/reports")
def get_enquiry_reports(
    enquiry_id: int,
    user=Depends(require_roles("vendor")),
    db: Session = Depends(get_db),
):
    match = (
        db.query(EnquiryMatch)
        .filter(
            EnquiryMatch.enquiry_id == enquiry_id,
            EnquiryMatch.vendor_id == user.id,
        )
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=403,
            detail="This enquiry is not assigned to you",
        )

    enquiry = db.query(Enquiry).filter(
        Enquiry.id == enquiry_id
    ).first()

    if not enquiry or enquiry.status not in [
        EnquiryStatus.APPROVED.value,
        EnquiryStatus.MATCHED.value,
        EnquiryStatus.QUOTATION.value,
        EnquiryStatus.ACCEPTED.value,
        EnquiryStatus.CLOSED.value,
    ]:
        raise HTTPException(
            status_code=403,
            detail="This enquiry is not approved for vendors",
        )

    reports = (
        db.query(EnquiryReport)
        .filter(EnquiryReport.enquiry_id == enquiry_id)
        .order_by(EnquiryReport.id.desc())
        .all()
    )

    return {
        "enquiry_id": enquiry_id,
        "reports": [
            {
                "id": report.id,
                "filename": report.original_filename,
                "download_url": (
                    f"/vendor/enquiries/{enquiry_id}/reports/"
                    f"{report.id}/download"
                ),
                "uploaded_at": report.uploaded_at,
            }
            for report in reports
        ],
    }


@router.get(
    "/enquiries/{enquiry_id}/reports/{report_id}/download"
)
def download_enquiry_report(
    enquiry_id: int,
    report_id: int,
    user=Depends(require_roles("vendor")),
    db: Session = Depends(get_db),
):
    match = (
        db.query(EnquiryMatch)
        .filter(
            EnquiryMatch.enquiry_id == enquiry_id,
            EnquiryMatch.vendor_id == user.id,
        )
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=403,
            detail="This enquiry is not assigned to you",
        )

    report = (
        db.query(EnquiryReport)
        .filter(
            EnquiryReport.id == report_id,
            EnquiryReport.enquiry_id == enquiry_id,
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    
    file_path = Path(report.file_path).resolve()
    reports_root = ENQUIRY_REPORTS_DIR.resolve()

    if not file_path.is_relative_to(reports_root):
        raise HTTPException(
            status_code=403,
            detail="Invalid file path",
        )

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Report file is missing from storage",
        )

    return FileResponse(
        path=str(file_path),
        filename=report.original_filename,
        media_type="application/octet-stream",
    )
