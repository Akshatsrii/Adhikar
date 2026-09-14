from fastapi import APIRouter
from app.document_intelligence import extract_document_fields
from app.schemas import DocumentExtractRequest, DocumentExtractResponse

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/extract", response_model=DocumentExtractResponse)
def extract_fields(payload: DocumentExtractRequest) -> DocumentExtractResponse:
    result = extract_document_fields(payload.mime_type, payload.base64_data)
    
    return DocumentExtractResponse(
        document_type=result.get("document_type", "UNKNOWN"),
        name=result.get("name"),
        income=result.get("income"),
        issue_date=result.get("issue_date"),
        expiry_date=result.get("expiry_date"),
        is_expired=result.get("is_expired"),
        confidence=result.get("confidence", 0.0),
    )
