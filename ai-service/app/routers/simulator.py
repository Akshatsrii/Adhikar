from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models import Scheme
from app.eligibility import evaluate_scheme, SchemeStatus
from app.schemas import SimulatorRequest, SimulatorResponse, SchemeListItem

router = APIRouter(prefix="/simulator", tags=["simulator"])

@router.post("/simulate", response_model=SimulatorResponse)
def simulate(payload: SimulatorRequest, db: Session = Depends(get_db)) -> SimulatorResponse:
    # 1. Fetch all schemes
    schemes = db.scalars(select(Scheme)).all()

    base_eligible = set()
    hypo_eligible = set()

    base_prof_dict = payload.base_profile.model_dump(exclude_none=True)
    hypo_prof_dict = payload.hypothetical_profile.model_dump(exclude_none=True)

    for scheme in schemes:
        res_base = evaluate_scheme(scheme, base_prof_dict)
        if res_base.status == SchemeStatus.ELIGIBLE:
            base_eligible.add(scheme.slug)

        res_hypo = evaluate_scheme(scheme, hypo_prof_dict)
        if res_hypo.status == SchemeStatus.ELIGIBLE:
            hypo_eligible.add(scheme.slug)

    # 2. Compare differences
    unlocked_slugs = hypo_eligible - base_eligible
    lost_slugs = base_eligible - hypo_eligible

    unlocked_schemes = [SchemeListItem.model_validate(s) for s in schemes if s.slug in unlocked_slugs]
    lost_schemes = [SchemeListItem.model_validate(s) for s in schemes if s.slug in lost_slugs]

    return SimulatorResponse(
        unlocked_schemes=unlocked_schemes,
        lost_schemes=lost_schemes,
    )
