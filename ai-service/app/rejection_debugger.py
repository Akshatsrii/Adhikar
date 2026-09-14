import json
import base64
from sqlalchemy.orm import Session
from sqlalchemy import select
from google.genai import types

from app.gemini import _get_client, GENERATION_MODEL
from app.models import Scheme
from app.schemas import EligibilityProfile

_DEBUG_PROMPT = """You are an expert government scheme eligibility analyst and debugger.
You are provided with:
1. The rules of a government scheme.
2. The user's current profile.
3. An image of a rejection letter (or screenshot of application status).

Analyze the rejection letter to determine EXACTLY why the application was rejected.
Cross-reference the rejection reason with the scheme rules and the user's profile to explain the root cause in plain, understandable language.

Output your analysis strictly as a JSON object matching this schema:
{
  "root_cause": "A plain English explanation of why it was rejected.",
  "missing_evidence": "If a document is missing or invalid, specify it here. Else null.",
  "citation": "A quote from the scheme rules that justifies the rejection.",
  "next_steps": ["Step 1 to fix", "Step 2 to fix"]
}

---
SCHEME RULES:
{scheme_rules}

---
USER PROFILE:
{user_profile}
"""

def debug_rejection(db: Session, scheme_slug: str, profile: EligibilityProfile, mime_type: str, base64_data: str) -> dict:
    scheme = db.scalar(select(Scheme).where(Scheme.slug == scheme_slug))
    if not scheme:
        raise ValueError(f"Scheme '{scheme_slug}' not found.")

    rules_text = f"Scheme: {scheme.name}\n"
    for rule in scheme.eligibility_rules:
        rules_text += f"- {rule.field} {rule.operator} {rule.value}\n"
        
    client = _get_client()
    image_bytes = base64.b64decode(base64_data)
    
    prompt = _DEBUG_PROMPT.format(
        scheme_rules=rules_text,
        user_profile=profile.model_dump_json(exclude_none=True)
    )
    
    response = client.models.generate_content(
        model=GENERATION_MODEL,
        contents=[
            prompt,
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        ]
    )

    raw = (response.text or "").strip()
    if raw.startswith("```"):
        raw = raw.strip("`").removeprefix("json").strip()

    try:
        parsed = json.loads(raw)
        return parsed
    except (json.JSONDecodeError, ValueError):
        return {
            "root_cause": "Could not determine root cause from the document.",
            "missing_evidence": None,
            "citation": "N/A",
            "next_steps": ["Please review the document manually."]
        }
