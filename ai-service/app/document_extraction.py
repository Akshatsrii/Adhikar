"""Structured field extraction from OCR'd document text — Gemini prompting,
not a trained model. Tesseract already did the hard perceptual work; this
step just turns messy OCR text into a clean JSON shape the rest of the app
can validate against (Stage 8's mismatch detector consumes this output).
"""

import json
from datetime import date, datetime

from app.gemini import GENERATION_MODEL, _get_client

KNOWN_DOCUMENT_TYPES = [
    "Income certificate",
    "Domicile / residence certificate",
    "Aadhaar card",
    "Bank passbook",
    "Age proof",
    "Mark sheet",
    "Land ownership records",
    "Other",
]

_EXTRACTION_PROMPT = """You are extracting structured data from OCR text of an \
Indian government document. The OCR may contain noise/errors — do your best \
to infer the correct values.

Return ONLY a JSON object, no markdown, no explanation, in this exact shape:
{{
  "document_type": "<one of: {doc_types}>",
  "full_name": "<string or null>",
  "issue_date": "<YYYY-MM-DD or null>",
  "income_amount": "<number or null>",
  "id_number": "<string or null — e.g. Aadhaar/certificate number>",
  "issuing_authority": "<string or null>"
}}

OCR text:
\"\"\"
{ocr_text}
\"\"\"
"""


def extract_fields(ocr_text: str) -> dict:
    client = _get_client()

    prompt = _EXTRACTION_PROMPT.format(
        doc_types=", ".join(KNOWN_DOCUMENT_TYPES), ocr_text=ocr_text[:6000]
    )

    from google.genai import types
    response = client.models.generate_content(
        model=GENERATION_MODEL, 
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    raw = (response.text or "").strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = {
            "document_type": "Other",
            "full_name": None,
            "issue_date": None,
            "income_amount": None,
            "id_number": None,
            "issuing_authority": None,
        }

    return parsed


# A certificate older than this is treated as likely-expired for the
# purposes of the readiness flag — plain date arithmetic, not a model.
CERTIFICATE_VALIDITY_DAYS = 365


def check_expiry(issue_date_str: str | None) -> bool | None:
    """Returns True if expired, False if still valid, None if unknown."""
    if not issue_date_str:
        return None

    try:
        issue_date = datetime.strptime(issue_date_str, "%Y-%m-%d").date()
    except ValueError:
        return None

    age_days = (date.today() - issue_date).days
    return age_days > CERTIFICATE_VALIDITY_DAYS
