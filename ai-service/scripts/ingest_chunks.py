"""Builds retrievable chunks for every scheme in the DB and embeds them via
Gemini, storing the vectors in the scheme_chunks table (pgvector).

Run this AFTER scripts/ingest_schemes.py has loaded scheme records.

Usage:
    python -m scripts.ingest_chunks
"""

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.gemini import embed_texts
from app.models import EligibilityRule, DocumentRequirement, Scheme, SchemeChunk


def _overview_text(scheme: Scheme) -> str:
    return (
        f"{scheme.name} ({scheme.department})\n"
        f"Category: {scheme.category} | Level: {scheme.level}"
        f"{' | State: ' + scheme.state if scheme.state else ''}\n"
        f"Benefit: {scheme.benefit}\n"
        f"{scheme.description}\n"
        f"Deadline: {scheme.deadline or 'Not specified'}"
    )


def _eligibility_text(scheme: Scheme, rules: list[EligibilityRule]) -> str:
    if not rules:
        return f"{scheme.name}: no structured eligibility rules recorded yet."
    lines = [f"- {r.field} {r.operator} {r.value}" for r in rules]
    return f"{scheme.name} eligibility criteria:\n" + "\n".join(lines)


def _documents_text(scheme: Scheme, docs: list[DocumentRequirement]) -> str:
    if not docs:
        return f"{scheme.name}: no document list recorded yet."
    lines = [f"- {d.name}{'' if d.is_mandatory else ' (optional)'}" for d in docs]
    return f"{scheme.name} required documents:\n" + "\n".join(lines)


def ingest() -> None:
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    created = 0

    try:
        schemes = db.query(Scheme).all()

        for scheme in schemes:
            db.query(SchemeChunk).filter_by(scheme_id=scheme.id).delete()

            texts = [
                _overview_text(scheme),
                _eligibility_text(scheme, scheme.eligibility_rules),
                _documents_text(scheme, scheme.documents_required),
            ]
            chunk_types = ["overview", "eligibility", "documents"]

            vectors = embed_texts(texts, task_type="RETRIEVAL_DOCUMENT")

            for content, chunk_type, vector in zip(texts, chunk_types, vectors):
                db.add(
                    SchemeChunk(
                        scheme_id=scheme.id,
                        chunk_type=chunk_type,
                        content=content,
                        embedding=vector,
                    )
                )
                created += 1

        db.commit()
    finally:
        db.close()

    print(f"[ingest_chunks] done — {created} chunks embedded across {len(schemes)} schemes")


if __name__ == "__main__":
    ingest()
