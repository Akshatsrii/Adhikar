"""Loads structured scheme JSON (data/schemes_seed.json) into PostgreSQL.

Usage:
    python -m scripts.ingest_schemes
    python -m scripts.ingest_schemes --file data/schemes_seed.json

This is the Stage 2 ingestion path: manual/structured JSON → Postgres.
Stage 3+ adds an LLM extraction step upstream (unstructured scheme PDF ->
this same JSON shape) so this script stays the single source of truth for
"what a valid scheme record looks like."
"""

import argparse
import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import DocumentRequirement, EligibilityRule, Scheme

DEFAULT_SEED_PATH = Path(__file__).resolve().parent.parent / "data" / "schemes_seed.json"


def ingest(file_path: Path) -> None:
    Base.metadata.create_all(bind=engine)

    with file_path.open(encoding="utf-8") as f:
        records = json.load(f)

    db: Session = SessionLocal()
    created, updated = 0, 0

    try:
        for record in records:
            existing = db.query(Scheme).filter_by(slug=record["slug"]).one_or_none()

            if existing:
                scheme = existing
                scheme.eligibility_rules.clear()
                scheme.documents_required.clear()
                updated += 1
            else:
                scheme = Scheme(slug=record["slug"])
                db.add(scheme)
                created += 1

            scheme.name = record["name"]
            scheme.department = record["department"]
            scheme.category = record["category"]
            scheme.level = record["level"]
            scheme.state = record.get("state")
            scheme.benefit = record["benefit"]
            scheme.description = record["description"]
            scheme.source_url = record["source_url"]
            scheme.application_url = record.get("application_url")
            scheme.deadline = record.get("deadline")

            scheme.eligibility_rules = [
                EligibilityRule(field=r["field"], operator=r["operator"], value=r["value"])
                for r in record.get("eligibility_rules", [])
            ]
            scheme.documents_required = [
                DocumentRequirement(name=d["name"], is_mandatory=d.get("is_mandatory", True))
                for d in record.get("documents_required", [])
            ]

        db.commit()
    finally:
        db.close()

    print(f"[ingest] done — {created} created, {updated} updated, {len(records)} total")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest scheme JSON into Postgres")
    parser.add_argument("--file", type=Path, default=DEFAULT_SEED_PATH)
    args = parser.parse_args()

    ingest(args.file)
