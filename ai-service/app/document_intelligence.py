import json
import base64
from datetime import date
from google.genai import types

from app.gemini import _get_client, GENERATION_MODEL

_EXTRACT_PROMPT = """Analyze the provided document (likely an Indian government certificate like an Income Certificate).
Extract the following information and return ONLY a valid JSON object. Do not include markdown formatting or markdown code blocks like ```json.

Expected JSON schema:
{
  "document_type": "INCOME_CERTIFICATE" | "AADHAAR" | "PAN" | "UNKNOWN",
  "name": "Full name of the person",
  "income": numeric value if income certificate, else null,
  "issue_date": "YYYY-MM-DD" if available, else null,
  "expiry_date": "YYYY-MM-DD" if available, else null,
  "is_expired": boolean (true if expiry date is in the past compared to today, false otherwise),
  "confidence": 0.0 to 1.0 (how confident are you in this extraction)
}

Today's date is: {today_date}
"""

def extract_document_fields(mime_type: str, base64_data: str) -> dict:
    client = _get_client()
    image_bytes = base64.b64decode(base64_data)
    
    prompt = _EXTRACT_PROMPT.format(today_date=date.today().isoformat())
    
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
            "document_type": "UNKNOWN",
            "confidence": 0.0
        }
