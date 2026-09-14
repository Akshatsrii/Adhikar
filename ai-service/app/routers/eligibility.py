from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.eligibility import SchemeStatus, evaluate_scheme
from app.models import Scheme
from app.schemas import (
    EligibilityCheckRequest,
    EligibilityCheckResponse,
    RuleEvaluationOut,
    SchemeEligibilityOut,
)

router = APIRouter(prefix="/eligibility", tags=["eligibility"])

_STATUS_ORDER = {
    SchemeStatus.ELIGIBLE: 0,
    SchemeStatus.MISSING_INFO: 1,
    SchemeStatus.NOT_ELIGIBLE: 2,
}


@router.post("/check", response_model=EligibilityCheckResponse)
def check_eligibility(payload: EligibilityCheckRequest, db: Session = Depends(get_db)) -> EligibilityCheckResponse:
    profile = payload.profile.model_dump(exclude_none=True)

    schemes = db.scalars(
        select(Scheme).options(selectinload(Scheme.eligibility_rules))
    ).all()

    # A state-restricted scheme from another state is simply out of scope —
    # not "not eligible" for a reason the citizen can act on.
    if profile.get("state"):
        schemes = [s for s in schemes if s.level == "central" or s.state == profile["state"]]

    evaluations = [evaluate_scheme(scheme, profile) for scheme in schemes]
    evaluations.sort(key=lambda e: _STATUS_ORDER[e.status])

    results = [
        SchemeEligibilityOut(
            scheme_slug=ev.scheme.slug,
            scheme_name=ev.scheme.name,
            source_url=ev.scheme.source_url,
            status=ev.status.value,
            rules=[
                RuleEvaluationOut(
                    field=r.field,
                    operator=r.operator,
                    value=r.value,
                    profile_value=r.profile_value,
                    result=r.result.value,
                    explanation=r.explanation,
                )
                for r in ev.rules
            ],
        )
        for ev in evaluations
    ]

    return EligibilityCheckResponse(
        eligible_count=sum(1 for e in evaluations if e.status == SchemeStatus.ELIGIBLE),
        missing_info_count=sum(1 for e in evaluations if e.status == SchemeStatus.MISSING_INFO),
        not_eligible_count=sum(1 for e in evaluations if e.status == SchemeStatus.NOT_ELIGIBLE),
        results=results,
    )
