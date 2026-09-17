"""Stage 18 + 19 — the admin review queue and its side effects.

Approving a change is the only place in the system where regulatory data
mutates the live knowledge base. That write is bundled with a new immutable
SchemeVersion and the list of affected citizens, so an approval is always
traceable: what changed, who approved it, when, and who it touched.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import EligibilityRule, RegulatoryChange, Scheme, SchemeVersion
from app.schemas_regulatory import (
    ChangeListResponse,
    RegulatoryChangeOut,
    ReviewRequest,
    ReviewResponse,
    SchemeVersionOut,
    VersionListResponse,
)

router = APIRouter(prefix="/regulatory", tags=["regulatory"])


def _to_out(change: RegulatoryChange) -> RegulatoryChangeOut:
    return RegulatoryChangeOut(
        id=change.id,
        scheme_slug=change.scheme.slug,
        scheme_name=change.scheme.name,
        change_type=change.change_type,
        field=change.field,
        old_value=change.old_value,
        new_value=change.new_value,
        summary=change.summary,
        confidence=change.confidence,
        source_url=change.source_url,
        authority_level=change.authority_level,
        impact=change.impact,
        status=change.status,
        detected_at=change.detected_at.isoformat() if change.detected_at else "",
    )


@router.get("/changes", response_model=ChangeListResponse)
def list_changes(
    status: str = Query(default="pending", pattern="^(pending|approved|rejected|all)$"),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
) -> ChangeListResponse:
    stmt = select(RegulatoryChange).options(selectinload(RegulatoryChange.scheme))
    if status != "all":
        stmt = stmt.where(RegulatoryChange.status == status)

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(
        stmt.order_by(RegulatoryChange.detected_at.desc()).limit(limit).offset(offset)
    ).all()

    return ChangeListResponse(total=total, items=[_to_out(c) for c in items])


@router.post("/changes/{change_id}/approve", response_model=ReviewResponse)
def approve_change(
    change_id: int, payload: ReviewRequest, db: Session = Depends(get_db)
) -> ReviewResponse:
    change = db.scalar(
        select(RegulatoryChange)
        .options(selectinload(RegulatoryChange.scheme).selectinload(Scheme.eligibility_rules))
        .where(RegulatoryChange.id == change_id)
    )
    if not change:
        raise HTTPException(status_code=404, detail=f"Change {change_id} not found")
    if change.status != "pending":
        raise HTTPException(
            status_code=409, detail=f"Change {change_id} is already {change.status}"
        )

    scheme = change.scheme
    applied = _apply_change(db, scheme, change)

    latest = db.scalar(
        select(func.max(SchemeVersion.version_number)).where(
            SchemeVersion.scheme_id == scheme.id
        )
    )
    next_version = (latest or 0) + 1

    db.add(
        SchemeVersion(
            scheme_id=scheme.id,
            version_number=next_version,
            snapshot={
                "name": scheme.name,
                "benefit": scheme.benefit,
                "deadline": scheme.deadline,
                "eligibility_rules": [
                    {"field": r.field, "operator": r.operator, "value": r.value}
                    for r in scheme.eligibility_rules
                ],
                "documents_required": [
                    {"name": d.name, "is_mandatory": d.is_mandatory}
                    for d in scheme.documents_required
                ],
            },
            source_url=change.source_url,
            content_hash="",
            authority_level=change.authority_level,
            published_at=datetime.now(timezone.utc),
        )
    )

    change.status = "approved"
    change.reviewed_by = payload.reviewed_by
    change.reviewed_at = datetime.now(timezone.utc)
    change.review_note = payload.note
    db.commit()

    affected = []
    if change.impact:
        affected = change.impact.get("lost_eligibility_user_ids", []) + change.impact.get(
            "gained_eligibility_user_ids", []
        )

    return ReviewResponse(
        id=change.id,
        status=change.status,
        applied=applied,
        new_version_number=next_version,
        affected_user_ids=affected,
    )


@router.post("/changes/{change_id}/reject", response_model=ReviewResponse)
def reject_change(
    change_id: int, payload: ReviewRequest, db: Session = Depends(get_db)
) -> ReviewResponse:
    change = db.scalar(select(RegulatoryChange).where(RegulatoryChange.id == change_id))
    if not change:
        raise HTTPException(status_code=404, detail=f"Change {change_id} not found")
    if change.status != "pending":
        raise HTTPException(
            status_code=409, detail=f"Change {change_id} is already {change.status}"
        )

    change.status = "rejected"
    change.reviewed_by = payload.reviewed_by
    change.reviewed_at = datetime.now(timezone.utc)
    change.review_note = payload.note
    db.commit()

    return ReviewResponse(
        id=change.id,
        status="rejected",
        applied=False,
        new_version_number=None,
        affected_user_ids=[],
    )


def _apply_change(db: Session, scheme: Scheme, change: RegulatoryChange) -> bool:
    """Writes an approved change into the live scheme.
    Returns whether the live record was actually mutated (document-only changes
    are recorded as versions but don't alter eligibility rules)."""
    
    if change.change_type == "eligibility_rule_changed" and change.field:
        for rule in scheme.eligibility_rules:
            if rule.field == change.field:
                rule.value = change.new_value or rule.value
        return True

    if change.change_type == "eligibility_rule_added" and change.field:
        scheme.eligibility_rules.append(
            EligibilityRule(field=change.field, operator="<=", value=change.new_value or "")
        )
        return True

    if change.change_type == "eligibility_rule_removed" and change.field:
        scheme.eligibility_rules = [
            r for r in scheme.eligibility_rules if r.field != change.field
        ]
        return True

    if change.change_type == "deadline_changed":
        scheme.deadline = change.new_value
        return True

    if change.change_type == "benefit_changed":
        scheme.benefit = change.new_value or scheme.benefit
        return True

    return False


@router.get("/schemes/{slug}/versions", response_model=VersionListResponse)
def list_versions(slug: str, db: Session = Depends(get_db)) -> VersionListResponse:
    scheme = db.scalar(select(Scheme).where(Scheme.slug == slug))
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{slug}' not found")

    versions = db.scalars(
        select(SchemeVersion)
        .where(SchemeVersion.scheme_id == scheme.id)
        .order_by(SchemeVersion.version_number.desc())
    ).all()

    return VersionListResponse(
        scheme_slug=slug,
        versions=[
            SchemeVersionOut(
                version_number=v.version_number,
                source_url=v.source_url,
                authority_level=v.authority_level,
                created_at=v.created_at.isoformat() if v.created_at else "",
                snapshot=v.snapshot,
            )
            for v in versions
        ],
    )
