"""OCR — pretrained Tesseract model, no training happens here. This turns
a document image into raw text; structured field extraction from that text
is a separate, LLM-based step (see document_extraction.py).
"""

import io

import pytesseract
from PIL import Image


class OcrError(Exception):
    pass


def extract_text_from_image(file_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(file_bytes))
    except Exception as exc:
        raise OcrError(f"Could not read image file: {exc}") from exc

    # Basic preprocessing: convert to grayscale, which measurably improves
    # Tesseract's accuracy on scanned government documents.
    image = image.convert("L")

    text = pytesseract.image_to_string(image)
    return text.strip()
