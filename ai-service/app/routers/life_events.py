from fastapi import APIRouter
from app.life_events import categories_for_event, classify_life_event
from app.schemas import LifeEventClassifyRequest, LifeEventClassifyResponse

router = APIRouter(prefix="/life-events", tags=["life-events"])


@router.post("/classify", response_model=LifeEventClassifyResponse)
def classify(payload: LifeEventClassifyRequest) -> LifeEventClassifyResponse:
    event_type, confidence = classify_life_event(payload.text)

    return LifeEventClassifyResponse(
        event_type=event_type.value,
        confidence=confidence,
        suggested_categories=categories_for_event(event_type),
    )
