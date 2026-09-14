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


class AskProfile(BaseModel):
    state: str | None = None
    age: int | None = None
    income: float | None = None
    occupation: str | None = None
    education: str | None = None


class AskRequest(BaseModel):
    query: str
    profile: AskProfile | None = None
    top_k: int = 5


class AskSource(BaseModel):
    scheme_slug: str
    scheme_name: str
    source_url: str
    chunk_type: str


class AskResponse(BaseModel):
    answer: str
    sources: list[AskSource]


class EligibilityProfile(BaseModel):
    age: int | None = None
    state: str | None = None
    education: str | None = None
    income: float | None = None
    occupation: str | None = None


class EligibilityCheckRequest(BaseModel):
    profile: EligibilityProfile


class RuleEvaluationOut(BaseModel):
    field: str
    operator: str
    value: str
    profile_value: str | None
    result: str
    explanation: str


class SchemeEligibilityOut(BaseModel):
    scheme_slug: str
    scheme_name: str
    source_url: str
    status: str
    rules: list[RuleEvaluationOut]


class EligibilityCheckResponse(BaseModel):
    eligible_count: int
    missing_info_count: int
    not_eligible_count: int
    results: list[SchemeEligibilityOut]
