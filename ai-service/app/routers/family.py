from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.family_optimizer import evaluate_family
from app.models import Scheme
from app.schemas import (
    ConflictOut,
    FamilyOptimizeRequest,
    FamilyOptimizeResponse,
    MemberMatches,
    SchemeListItem,
)

router = APIRouter(prefix="/family", tags=["family"])


@router.post("/optimize", response_model=FamilyOptimizeResponse)
def optimize_family(payload: FamilyOptimizeRequest, db: Session = Depends(get_db)) -> FamilyOptimizeResponse:
    schemes = db.scalars(select(Scheme).options(selectinload(Scheme.eligibility_rules))).all()

    members = [
        (m.member_id, m.name, m.profile.model_dump(exclude_none=True))
        for m in payload.members
    ]

    member_results, conflicts = evaluate_family(members, list(schemes))

    return FamilyOptimizeResponse(
        members=[
            MemberMatches(
                member_id=r.member_id,
                member_name=r.member_name,
                eligible_schemes=[SchemeListItem.model_validate(s) for s in r.eligible_schemes],
            )
            for r in member_results
        ],
        conflicts=[
            ConflictOut(
                conflict_type=c.conflict_type,
                scheme_slugs=c.scheme_slugs,
                scheme_names=c.scheme_names,
                member_ids=c.member_ids,
                message=c.message,
            )
            for c in conflicts
        ],
    )
