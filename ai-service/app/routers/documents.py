from fastapi import APIRouter, File, HTTPException, UploadFile

from app.document_extraction import check_expiry, extract_fields
from app.ocr import OcrError, extract_text_from_image
from app.schemas import DocumentExtractionResponse

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024  # 8MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/extract", response_model=DocumentExtractionResponse)
async def extract_document(file: UploadFile = File(...)) -> DocumentExtractionResponse:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type '{file.content_type}'. Upload a JPEG, PNG, or WEBP image.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large — max 8MB.")

    try:
        ocr_text = extract_text_from_image(file_bytes)
    except OcrError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    if not ocr_text:
        raise HTTPException(
            status_code=422,
            detail="Couldn't read any text from this image — try a clearer photo or scan.",
        )

    fields = extract_fields(ocr_text)
    is_expired = check_expiry(fields.get("issue_date"))

    return DocumentExtractionResponse(
        document_type=fields.get("document_type") or "Other",
        full_name=fields.get("full_name"),
        issue_date=fields.get("issue_date"),
        income_amount=fields.get("income_amount"),
        id_number=fields.get("id_number"),
        issuing_authority=fields.get("issuing_authority"),
        is_expired=is_expired,
        ocr_text_preview=ocr_text[:300],
    )
