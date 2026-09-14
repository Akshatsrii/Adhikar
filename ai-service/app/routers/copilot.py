from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models import Scheme
from app.schemas import CopilotRequest, CopilotResponse, DeadlineAlert, EligibilityProfile
from app.eligibility import evaluate_scheme, SchemeStatus
from app.gemini import _get_client, GENERATION_MODEL

router = APIRouter(prefix="/copilot", tags=["copilot"])

_COPILOT_PROMPT = """You are an Application Copilot helping a user fill out a form for the government scheme: {scheme_name}.

Context about the scheme:
{scheme_description}

The user is asking a question specifically about filling the application.
Question: {question}

Keep your answer very short, friendly, and practical (max 2-3 sentences).
"""

@router.post("/ask", response_model=CopilotResponse)
def ask_copilot(payload: CopilotRequest, db: Session = Depends(get_db)):
    scheme = db.scalar(select(Scheme).where(Scheme.slug == payload.scheme_slug))
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    client = _get_client()
    prompt = _COPILOT_PROMPT.format(
        scheme_name=scheme.name,
        scheme_description=scheme.description,
        question=payload.question
    )

    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=prompt
    )

    return CopilotResponse(answer=response.text or "I'm sorry, I couldn't understand that.")

@router.post("/deadlines", response_model=list[DeadlineAlert])
def get_deadlines(profile: EligibilityProfile, db: Session = Depends(get_db)):
    schemes = db.scalars(select(Scheme)).all()
    
    alerts = []
    today = date.today()
    prof_dict = profile.model_dump(exclude_none=True)

    for scheme in schemes:
        if scheme.deadline:
            # Check eligibility first
            res = evaluate_scheme(scheme, prof_dict)
            if res.status == SchemeStatus.ELIGIBLE:
                try:
                    # Expecting YYYY-MM-DD
                    d = datetime.strptime(scheme.deadline, "%Y-%m-%d").date()
                    days_left = (d - today).days
                    if 0 <= days_left <= 30:
                        alerts.append(
                            DeadlineAlert(
                                scheme_slug=scheme.slug,
                                scheme_name=scheme.name,
                                deadline=scheme.deadline,
                                days_left=days_left
                            )
                        )
                except ValueError:
                    pass
    
    # Sort by nearest deadline
    alerts.sort(key=lambda x: x.days_left)
    return alerts
