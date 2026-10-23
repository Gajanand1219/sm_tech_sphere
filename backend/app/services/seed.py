"""SM TECHSPHERE seed loader.

Questions are loaded ONLY from the supplied CSV files. No diagnostic questions are
hardcoded in this file. Keep the CSV files in the same directory as seed.py.
Existing enquiry answers are never deleted.
"""

import csv
from pathlib import Path

from app.models import Domain, Problem, Question, User, Role, AccountStatus
from app.core.security import hash_password
from app.core.config import settings


CSV_FILES = (
    "combined_questionnaire_all_97_subcategories.csv",
)

REQUIRED_COLUMNS = {
    "domain", "category", "sub_category", "question_text",
    "field_key", "required", "source_document",
}


def _read_reference_rows(base_dir: Path):
    """Read every supplied CSV, validate its schema, and deduplicate exact questions."""
    rows = []
    seen = set()

    for filename in CSV_FILES:
        path = base_dir / filename
        if not path.exists():
            # All supplied files are expected to be present; fail loudly rather than
            # silently skipping a CSV and importing only a partial question set.
            raise FileNotFoundError(
                f"Required reference CSV not found: {path}. "
                "Keep combined_questionnaire_all_97_subcategories.csv next to seed.py."
            )

        with path.open("r", encoding="utf-8-sig", newline="") as csv_file:
            reader = csv.DictReader(csv_file)
            if not reader.fieldnames or not REQUIRED_COLUMNS.issubset(reader.fieldnames):
                raise ValueError(
                    f"{filename} is missing required columns: "
                    f"{sorted(REQUIRED_COLUMNS - set(reader.fieldnames or []))}"
                )

            for raw in reader:
                row = {key: (raw.get(key) or "").strip() for key in REQUIRED_COLUMNS}
                if not all(row.get(k) for k in ("domain", "category", "sub_category", "question_text")):
                    continue

                # Same question text in the same sub-category is one question even if
                # duplicate CSV versions assign a different field_key.
                key = (
                    row["domain"].casefold(),
                    row["category"].casefold(),
                    row["sub_category"].casefold(),
                    row["question_text"].casefold(),
                )
                if key in seen:
                    continue
                seen.add(key)
                rows.append(row)

    if not rows:
        raise ValueError("No usable reference questions were found in the supplied CSV files.")
    return rows


def seed_database(db):
    """Upsert categories and load questions exclusively from the supplied CSV files."""
    from app.models import QuestionAnswer

    base_dir = Path(__file__).resolve().parent
    csv_rows = _read_reference_rows(base_dir)

    # Create domain/category/sub-category records represented in the CSVs.
    problems_by_key = {}
    for row in csv_rows:
        domain_name = row["domain"]
        category = row["category"]
        sub_category = row["sub_category"]
        domain = db.query(Domain).filter(Domain.name == domain_name).first()
        if domain is None:
            domain = Domain(
                name=domain_name,
                description="Domain for environmental and industrial solutions.",
            )
            db.add(domain)
            db.flush()

        problem_key = (domain.id, category, sub_category)
        problem = problems_by_key.get(problem_key)
        if problem is None:
            problem = (
                db.query(Problem)
                .filter(
                    Problem.domain_id == domain.id,
                    Problem.name == category,
                    Problem.sub_domain == sub_category,
                )
                .first()
            )
            if problem is None:
                problem = Problem(
                    domain_id=domain.id,
                    name=category,
                    sub_domain=sub_category,
                    description=f"{sub_category} under {category}.",
                )
                db.add(problem)
                db.flush()
            problems_by_key[problem_key] = problem

    # Remove legacy questions only when no saved answer depends on them.
    # Questions with answers are retained to protect existing enquiry data.
    existing_questions = db.query(Question).all()
    csv_question_keys = set()
    for row in csv_rows:
        domain = db.query(Domain).filter(Domain.name == row["domain"]).first()
        problem = (
            db.query(Problem)
            .filter(
                Problem.domain_id == domain.id,
                Problem.name == row["category"],
                Problem.sub_domain == row["sub_category"],
            )
            .first()
        )
        csv_question_keys.add((problem.id, row["question_text"].casefold()))

    for question in existing_questions:
        if (question.problem_id, (question.question_text or "").casefold()) in csv_question_keys:
            continue
        has_answers = (
            db.query(QuestionAnswer.id)
            .filter(QuestionAnswer.question_id == question.id)
            .first()
        )
        if not has_answers:
            db.delete(question)
    db.flush()

    # Insert every unique CSV question. Existing matching questions are updated
    # only for CSV-owned metadata; question wording always comes from the CSV.
    inserted = 0
    updated = 0
    for row in csv_rows:
        domain = db.query(Domain).filter(Domain.name == row["domain"]).first()
        problem = (
            db.query(Problem)
            .filter(
                Problem.domain_id == domain.id,
                Problem.name == row["category"],
                Problem.sub_domain == row["sub_category"],
            )
            .first()
        )
        question = (
            db.query(Question)
            .filter(
                Question.problem_id == problem.id,
                Question.question_text == row["question_text"],
            )
            .first()
        )
        required_value = row["required"].strip().lower() in ("1", "true", "yes")
        field_key = (row["field_key"] or "document_question")[:80]

        if question is None:
            db.add(Question(
                problem_id=problem.id,
                question_text=row["question_text"],
                field_key=field_key,
                required=required_value,
            ))
            inserted += 1
        else:
            question.field_key = field_key
            question.required = required_value
            updated += 1

    db.commit()

    # Preserve the existing admin-user bootstrap behavior.
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            full_name="Platform Admin",
            email=settings.ADMIN_EMAIL,
            phone="0000000000",
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            role=Role.ADMIN.value,
            status=AccountStatus.ACTIVE.value,
            email_verified=True,
            is_active=True,
        )
        db.add(admin)
        db.commit()

    return {
        "csv_question_rows": len(csv_rows),
        "inserted_questions": inserted,
        "updated_questions": updated,
    }

