from pydantic import BaseModel, ConfigDict


class ImpactOut(BaseModel):
    scheme_slug: str
    total_evaluated: int
    lost_eligibility_count: int
    gained_eligibility_count: int
    unchanged_count: int
    lost_eligibility_user_ids: list[str]
    gained_eligibility_user_ids: list[str]


class RegulatoryChangeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    scheme_slug: str
    scheme_name: str
    change_type: str
    field: str | None
    old_value: str | None
    new_value: str | None
    summary: str
    confidence: float
    source_url: str
    authority_level: str
    impact: ImpactOut | None
    status: str
    detected_at: str


class ChangeListResponse(BaseModel):
    total: int
    items: list[RegulatoryChangeOut]


class ReviewRequest(BaseModel):
    reviewed_by: str
    note: str | None = None


class ReviewResponse(BaseModel):
    id: int
    status: str
    applied: bool
    new_version_number: int | None
    affected_user_ids: list[str]


class SchemeVersionOut(BaseModel):
    version_number: int
    source_url: str
    authority_level: str
    created_at: str
    snapshot: dict


class VersionListResponse(BaseModel):
    scheme_slug: str
    versions: list[SchemeVersionOut]
