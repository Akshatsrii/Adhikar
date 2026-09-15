import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import get_db
from app.models import AdminUpdateQueue, Scheme, EligibilityRule
from app.schemas import AdminQueueItem, AdminApproveRequest
from app.gemini import _get_client, GENERATION_MODEL
from google.genai import types

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/trigger_crawler")
def trigger_crawler(db: Session = Depends(get_db)):
    """
    Stage 13: Simulated Crawler + RSS Monitor.
    In reality, this would hit URLs. For the demo, we simulate finding a change
    to a scheme and pushing it to the change detection pipeline.
    """
    scheme = db.scalar(select(Scheme).where(Scheme.slug == "pm-kisan"))
    if not scheme:
        return {"message": "No schemes to crawl."}
    
    # Simulate a new document fetched
    new_source_text = "The PM-KISAN scheme has been updated. The new income limit is Rs 5,00,000 per year, and farmers must own land. Deadline extended to 2026-12-31."
    
    # Stage 14 & 16: Semantic Diff & Conflict Resolution
    client = _get_client()
    diff_prompt = f"""You are analyzing a new government notification against existing scheme rules.
Existing Rules for {scheme.name}:
- Income <= 200000
- State == UP
- Deadline: 2025-01-01

New Notification Text:
{new_source_text}

Identify the semantic differences. Create a JSON with:
"change_type": "RULE_CHANGE" or "DEADLINE_EXTENSION",
"diff_summary": "A short English explanation of the change.",
"confidence": a float between 0.0 and 1.0 (1.0 = highly certain this is an authoritative change),
"new_rules": array of new parsed rules.
"""
    
    response = client.models.generate_content(
        model=GENERATION_MODEL, 
        contents=diff_prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    raw = (response.text or "").strip()
    
    try:
        parsed = json.loads(raw)
        
        # Stage 15: Impact Analysis (Simulated affected users count)
        affected = 150 # In real app, we'd query Node.js or run an engine pass
        
        # Add to Admin Queue (Stage 19)
        queue_item = AdminUpdateQueue(
            scheme_slug=scheme.slug,
            change_type=parsed.get("change_type", "RULE_CHANGE"),
            diff_summary=parsed.get("diff_summary", "Detected updates to scheme parameters."),
            affected_users_count=affected,
            ai_confidence_score=parsed.get("confidence", 0.85),
            source_url="https://india.gov.in/simulated-update",
            raw_extracted_rules=json.dumps(parsed.get("new_rules", []))
        )
        db.add(queue_item)
        db.commit()
        return {"message": "Crawler finished. 1 update pushed to Admin Queue."}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/queue", response_model=list[AdminQueueItem])
def get_queue(db: Session = Depends(get_db)):
    items = db.scalars(select(AdminUpdateQueue).where(AdminUpdateQueue.status == "PENDING")).all()
    return items

@router.post("/approve")
def approve_update(req: AdminApproveRequest, db: Session = Depends(get_db)):
    item = db.scalar(select(AdminUpdateQueue).where(AdminUpdateQueue.id == req.queue_id))
    if not item:
        raise HTTPException(404, "Queue item not found")
        
    if req.action == "APPROVE":
        item.status = "APPROVED"
        # Stage 17: Apply the rule change automatically to the DB
        scheme = db.scalar(select(Scheme).where(Scheme.slug == item.scheme_slug))
        if scheme:
            # Here we would parse item.raw_extracted_rules and update scheme.eligibility_rules
            # For MVP, we update the benefit/deadline to reflect change
            scheme.deadline = "2026-12-31" # Simulated apply
        db.commit()
        return {"message": "Approved and applied."}
    else:
        item.status = "REJECTED"
        db.commit()
        return {"message": "Rejected."}
