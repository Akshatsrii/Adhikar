from pydantic import BaseModel

class DocumentExtractRequest(BaseModel):
    filename: str
    mime_type: str
    base64_data: str

class DocumentExtractResponse(BaseModel):
    document_type: str
    name: str | None = None
    income: float | None = None
    issue_date: str | None = None
    expiry_date: str | None = None
    is_expired: bool | None = None
    confidence: float
