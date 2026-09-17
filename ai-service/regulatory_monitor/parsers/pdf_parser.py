"""Stage 13 — PDF to text, with an OCR fallback for scanned circulars.

Many state-government notifications are scanned images rather than digital text,
so a text-layer extraction that returns nothing is expected, not an error —
that case falls through to the same pretrained OCR used in Stage 7.
"""

import io
import re

from pypdf import PdfReader

MIN_USEFUL_CHARS = 50


def parse(content: bytes) -> str:
    text = _extract_text_layer(content)
    if len(text) < MIN_USEFUL_CHARS:
        text = _ocr_fallback(content)

    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract_text_layer(content: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(content))
        return "\n".join((page.extract_text() or "") for page in reader.pages).strip()
    except Exception:
        return ""


def _ocr_fallback(content: bytes) -> str:
    try:
        import pytesseract
        from pdf2image import convert_from_bytes

        pages = convert_from_bytes(content, dpi=200)
        return "\n".join(pytesseract.image_to_string(p.convert("L")) for p in pages).strip()
    except Exception:
        # OCR is best-effort; an unreadable PDF should surface as "no change
        # detected" rather than crashing a scheduled monitoring run.
        return ""
