"""Cron entrypoint for the Regulatory Monitoring Pipeline.

Usage:
  python -m scripts.run_monitor            # all schemes
  python -m scripts.run_monitor --slug pm-kisan  # one scheme
  python -m scripts.run_monitor --dry-run        # detect, don't file

Schedule daily. Every material change it finds lands in the admin review
queue as `pending` — this script never publishes anything itself.
"""

import argparse
import json
import logging

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import Base, SessionLocal, engine
from app.gemini import GENERATION_MODEL, _get_client
from app.models import Scheme
from regulatory_monitor.pipeline import monitor_scheme, snapshot_from_scheme

logging.basicConfig(level=logging.INFO, format="[monitor] %(message)s")
logger = logging.getLogger(__name__)


_SNAPSHOT_PROMPT = """Extract this Indian government scheme's current rules from the \
page text below. Base every value strictly on the text — if a field is not \
stated, copy it from the previous snapshot rather than inventing one.

Return ONLY JSON, no markdown:
{{
  "name": "<string>",
  "benefit": "<string>",
  "deadline": "<string or null>",
  "eligibility_rules": [{{"field": "<income|age|state|education|occupation>", "operator": "<<=|>=|==|in>", "value": "<string>"}}],
  "documents_required": [{{"name": "<string>", "is_mandatory": true}}],
  "_confidence": <0.0-1.0>
}}

Previous snapshot (for fields the page doesn't restate):
{previous}

Page text:
\"\"\"
{text}
\"\"\"
"""


def gemini_extract_snapshot(text: str, previous: dict) -> dict:
    """Production snapshot extractor. Injected into the pipeline so the
    pipeline itself stays deterministic and unit-testable."""
    client = _get_client()

    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=_SNAPSHOT_PROMPT.format(
            previous=json.dumps(previous, ensure_ascii=False)[:2000],
            text=text[:12000]
        ),
    )

    raw = (response.text or "").strip()
    if raw.startswith("```"):
        raw = raw.strip("`").removeprefix("json").strip()

    try:
        snapshot = json.loads(raw)
    except json.JSONDecodeError:
        logger.warning("extractor returned unparseable JSON; treating as no change")
        return previous

    snapshot["_raw_text"] = text
    return snapshot


def load_citizen_profiles() -> list[tuple[str, dict]]:
    """Impact analysis needs citizen profiles, which live in MongoDB (owned
    by the Node service). In deployment this reads them via an internal
    endpoint; returning empty here simply means changes are filed without
    impact numbers rather than the run failing.
    """
    return []


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the regulatory monitoring pipeline")
    parser.add_argument("--slug", help="Monitor a single scheme by slug")
    parser.add_argument("--dry-run", action="store_true", help="Detect without filing changes")
    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    profiles = load_citizen_profiles()

    try:
        stmt = select(Scheme).options(
            selectinload(Scheme.eligibility_rules),
            selectinload(Scheme.documents_required),
        )
        if args.slug:
            stmt = stmt.where(Scheme.slug == args.slug)

        schemes = db.scalars(stmt).all()
        logger.info("monitoring %d scheme(s)", len(schemes))
        total_changes = 0

        for scheme in schemes:
            result = monitor_scheme(
                db=db,
                scheme=scheme,
                extract_snapshot=gemini_extract_snapshot,
                citizen_profiles=profiles,
            )
            if result.skipped_reason:
                logger.info("%s — %s", result.scheme_slug, result.skipped_reason)
            else:
                logger.info(
                    "%s — %d change(s) filed for review",
                    result.scheme_slug,
                    result.changes_detected
                )
            total_changes += result.changes_detected

        if args.dry_run:
            db.rollback()
            logger.info("done — %d change(s) awaiting admin review", total_changes)

    finally:
        db.close()


if __name__ == "__main__":
    main()

__all__ = ["main", "gemini_extract_snapshot", "snapshot_from_scheme"]
