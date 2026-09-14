from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.eligibility import evaluate_scheme
from app.models import Scheme
from app.recommendations import build_action_items, rank_schemes
from app.schemas import ActionItem, EligibilityCheckRequest, RecommendationsResponse, TopMatch

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.post("", response_model=RecommendationsResponse)
def get_recommendations(
    payload: EligibilityCheckRequest, db: Session = Depends(get_db)
) -> RecommendationsResponse:
    profile = payload.profile.model_dump(exclude_none=True)

    schemes = db.scalars(select(Scheme).options(selectinload(Scheme.eligibility_rules))).all()

    if profile.get("state"):
        schemes = [s for s in schemes if s.level == "central" or s.state == profile["state"]]

    evaluations = [evaluate_scheme(scheme, profile) for scheme in schemes]

    ranked = rank_schemes(evaluations)
    top_matches = [
        TopMatch(
            scheme_slug=scored.evaluation.scheme.slug,
            scheme_name=scored.evaluation.scheme.name,
            source_url=scored.evaluation.scheme.source_url,
            category=scored.evaluation.scheme.category,
            benefit=scored.evaluation.scheme.benefit,
            deadline=scored.evaluation.scheme.deadline,
            status=scored.evaluation.status.value,
            match_percentage=scored.match_percentage,
        )
        for scored in ranked
    ]

    action_items = [ActionItem(**item) for item in build_action_items(evaluations)]

    return RecommendationsResponse(top_matches=top_matches, action_items=action_items)
