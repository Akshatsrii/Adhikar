"""Orchestrates Stages 13→16 for a single scheme and files the result for human review.

The whole pipeline is built around one rule: nothing reaches the live knowledge
base without an admin approving it. Every path through this module ends either
in "no change" or in a `pending` RegulatoryChange row.
"""

import logging
from dataclasses import dataclass
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import RegulatoryChange, Scheme, SchemeVersion
from regulatory_monitor.change_detection.rule_diff import diff_snapshots
from regulatory_monitor.change_detection.text_diff import diff_text
from regulatory_monitor.collectors import pdf_collector, web_collector
from regulatory_monitor.collectors.base import CollectorError
from regulatory_monitor.impact_analysis.impact import analyse_impact
from regulatory_monitor.parsers import html_parser, pdf_parser

logger = logging.getLogger(__name__)


@dataclass
class MonitorResult:
    scheme_slug: str
    source_changed: bool
    changes_detected: int
    skipped_reason: str | None = None


def snapshot_from_scheme(scheme: Scheme) -> dict:
    """The canonical structured shape used for version storage and diffing."""
    return {
        "name": scheme.name,
        "benefit": scheme.benefit,
        "deadline": scheme.deadline,
        "eligibility_rules": [
            {"field": r.field, "operator": r.operator, "value": r.value} for r in scheme.eligibility_rules
        ],
        "documents_required": [
            {"name": d.name, "is_mandatory": d.is_mandatory} for d in scheme.documents_required
        ],
    }


def _collect_and_parse(url: str) -> tuple[str, str]:
    """Returns (clean_text, content_hash)."""
    if url.lower().endswith(".pdf"):
        doc = pdf_collector.collect(url)
        return pdf_parser.parse(doc.content), doc.content_hash

    doc = web_collector.collect(url)
    return html_parser.parse(doc.content), doc.content_hash


def _latest_version(db: Session, scheme_id: int) -> SchemeVersion | None:
    return db.scalar(
        select(SchemeVersion)
        .where(SchemeVersion.scheme_id == scheme_id)
        .order_by(SchemeVersion.version_number.desc())
        .limit(1)
    )


def monitor_scheme(
    db: Session,
    scheme: Scheme,
    extract_snapshot,
    citizen_profiles: list[tuple[str, dict]],
    authority_level: str = "portal",
) -> MonitorResult:
    """Runs one monitoring pass over one scheme.

    `extract_snapshot` is injected rather than imported so the caller decides
    how source text becomes structured rules — in production that's the Gemini
    extractor, in tests it's a stub. The pipeline itself stays deterministic
    and testable regardless of which is used.
    """
    try:
        new_text, content_hash = _collect_and_parse(scheme.source_url)
    except CollectorError as exc:
        logger.warning("collector failed for %s: %s", scheme.slug, exc)
        return MonitorResult(scheme.slug, False, 0, skipped_reason=str(exc))

    previous = _latest_version(db, scheme.id)

    # Fast path: byte-identical source means nothing to do. This is what keeps
    # a daily run over hundreds of schemes cheap.
    if previous and previous.content_hash == content_hash:
        return MonitorResult(scheme.slug, False, 0, skipped_reason="source unchanged")

    old_snapshot = previous.snapshot if previous else snapshot_from_scheme(scheme)

    # Seed the very first version so subsequent runs have a baseline.
    if previous is None:
        db.add(
            SchemeVersion(
                scheme_id=scheme.id,
                version_number=1,
                snapshot=old_snapshot,
                source_url=scheme.source_url,
                content_hash=content_hash,
                authority_level=authority_level,
                published_at=datetime.now(timezone.utc),
            )
        )
        db.commit()
        return MonitorResult(scheme.slug, True, 0, skipped_reason="baseline version created")

    old_text = previous.snapshot.get("_raw_text", "")
    if old_text:
        text_change = diff_text(old_text, new_text)
        if text_change.is_cosmetic:
            return MonitorResult(scheme.slug, True, 0, skipped_reason="cosmetic change only")

    new_snapshot = extract_snapshot(new_text, old_snapshot)
    rule_changes = diff_snapshots(old_snapshot, new_snapshot)

    if not rule_changes:
        return MonitorResult(scheme.slug, True, 0, skipped_reason="no material change")

    old_rules = old_snapshot.get("eligibility_rules", [])
    new_rules = new_snapshot.get("eligibility_rules", [])
    impact_dict = None

    if any(c.eligibility_critical for c in rule_changes) and citizen_profiles:
        impact_dict = analyse_impact(scheme, old_rules, new_rules, citizen_profiles).to_dict()

    for change in rule_changes:
        db.add(
            RegulatoryChange(
                scheme_id=scheme.id,
                change_type=change.change_type,
                field=change.field,
                old_value=change.old_value,
                new_value=change.new_value,
                summary=change.summary,
                confidence=new_snapshot.get("_confidence", 0.0),
                source_url=scheme.source_url,
                authority_level=authority_level,
                impact=impact_dict if change.eligibility_critical else None,
                status="pending",
            )
        )

    db.commit()
    return MonitorResult(scheme.slug, True, len(rule_changes))
