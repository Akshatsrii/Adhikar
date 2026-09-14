from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.rejection_debugger import debug_rejection
from app.schemas import DebuggerRequest, DebuggerResponse

router = APIRouter(prefix="/debugger", tags=["debugger"])

@router.post("/debug", response_model=DebuggerResponse)
def extract_fields(payload: DebuggerRequest, db: Session = Depends(get_db)) -> DebuggerResponse:
    try:
        result = debug_rejection(
            db=db,
            scheme_slug=payload.scheme_slug,
            profile=payload.profile,
            mime_type=payload.mime_type,
            base64_data=payload.base64_data
        )
        
        return DebuggerResponse(
            root_cause=result.get("root_cause", "Unknown error"),
            missing_evidence=result.get("missing_evidence"),
            citation=result.get("citation", ""),
            next_steps=result.get("next_steps", []),
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
