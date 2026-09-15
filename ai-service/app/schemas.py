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


class TopMatch(BaseModel):
    scheme_slug: str
    scheme_name: str
    source_url: str
    category: str
    benefit: str
    deadline: str | None
    status: str
    match_percentage: int


class ActionItem(BaseModel):
    field: str
    message: str
    affected_scheme_count: int


class RecommendationsResponse(BaseModel):
    top_matches: list[TopMatch]
    action_items: list[ActionItem]


class LifeEventClassifyRequest(BaseModel):
    text: str


class LifeEventClassifyResponse(BaseModel):
    event_type: str
    confidence: float
    suggested_categories: list[str]


class FamilyMemberInput(BaseModel):
    member_id: str
    name: str
    profile: EligibilityProfile


class FamilyOptimizeRequest(BaseModel):
    members: list[FamilyMemberInput]


class MemberMatches(BaseModel):
    member_id: str
    member_name: str
    eligible_schemes: list[SchemeListItem]


class ConflictOut(BaseModel):
    conflict_type: str
    scheme_slugs: list[str]
    scheme_names: list[str]
    member_ids: list[str]
    message: str
    recommended_resolution: str | None = None


class FamilyOptimizeResponse(BaseModel):
    members: list[MemberMatches]
    conflicts: list[ConflictOut]


class DocumentExtractionResponse(BaseModel):
    document_type: str
    full_name: str | None
    issue_date: str | None
    income_amount: float | None
    id_number: str | None
    issuing_authority: str | None
    is_expired: bool | None
    ocr_text_preview: str


class DebuggerRequest(BaseModel):
    scheme_slug: str
    profile: EligibilityProfile
    filename: str
    mime_type: str
    base64_data: str

class DebuggerResponse(BaseModel):
    root_cause: str
    missing_evidence: str | None = None
    citation: str
    next_steps: list[str]

class SimulatorRequest(BaseModel):
    base_profile: EligibilityProfile
    hypothetical_profile: EligibilityProfile

class SimulatorResponse(BaseModel):
    unlocked_schemes: list[SchemeListItem]
    lost_schemes: list[SchemeListItem]

class CopilotRequest(BaseModel):
    scheme_slug: str
    question: str
    context_field: str | None = None

class CopilotResponse(BaseModel):
    answer: str

class DeadlineAlert(BaseModel):
    scheme_slug: str
    scheme_name: str
    deadline: str
    days_left: int
