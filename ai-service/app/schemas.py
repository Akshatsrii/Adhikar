from pydantic import BaseModel, ConfigDict


class EligibilityRuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    field: str
    operator: str
    value: str


class DocumentRequirementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    is_mandatory: bool


class SchemeListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    department: str
    category: str
    level: str
    state: str | None
    benefit: str
    deadline: str | None


class SchemeDetail(SchemeListItem):
    description: str
    source_url: str
    application_url: str | None
    eligibility_rules: list[EligibilityRuleOut]
    documents_required: list[DocumentRequirementOut]


class SchemeListResponse(BaseModel):
    total: int
    items: list[SchemeListItem]
