const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export interface UserProfileSummary {
  age?: number
  state?: string
  education?: string
  income?: number
  occupation?: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  profile?: UserProfileSummary
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const token = getToken()

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : null) ?? 'Something went wrong. Please try again.'
    throw new ApiError(message, response.status)
  }

  return data as TResponse
}

export function getToken(): string | null {
  return localStorage.getItem('adhikar_token')
}

export function setToken(token: string): void {
  localStorage.setItem('adhikar_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('adhikar_token')
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => request<{ user: AuthUser }>('/auth/me'),
}

export interface ProfilePayload {
  age?: number
  state?: string
  education?: string
  income?: number
  occupation?: string
}

export const profileApi = {
  get: () => request<{ profile: UserProfileSummary }>('/profile'),

  update: (payload: ProfilePayload) =>
    request<{ profile: UserProfileSummary }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
}

export interface AskSource {
  schemeSlug: string
  schemeName: string
  sourceUrl: string
  chunkType: string
}

export interface AskResponse {
  answer: string
  sources: AskSource[]
}

interface RawAskResponse {
  answer: string
  sources: { scheme_slug: string; scheme_name: string; source_url: string; chunk_type: string }[]
}

export const aiApi = {
  ask: async (query: string): Promise<AskResponse> => {
    const raw = await request<RawAskResponse>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })

    return {
      answer: raw.answer,
      sources: raw.sources.map((s) => ({
        schemeSlug: s.scheme_slug,
        schemeName: s.scheme_name,
        sourceUrl: s.source_url,
        chunkType: s.chunk_type,
      })),
    }
  },
}

export type EligibilityStatus = 'eligible' | 'not_eligible' | 'missing_info'

export interface EligibilityRuleResult {
  field: string
  operator: string
  value: string
  profileValue: string | null
  result: 'pass' | 'fail' | 'unknown'
  explanation: string
}

export interface SchemeEligibilityResult {
  schemeSlug: string
  schemeName: string
  sourceUrl: string
  status: EligibilityStatus
  rules: EligibilityRuleResult[]
}

export interface EligibilityCheckResult {
  eligibleCount: number
  missingInfoCount: number
  notEligibleCount: number
  results: SchemeEligibilityResult[]
}

interface RawRuleResult {
  field: string
  operator: string
  value: string
  profile_value: string | null
  result: 'pass' | 'fail' | 'unknown'
  explanation: string
}

interface RawSchemeResult {
  scheme_slug: string
  scheme_name: string
  source_url: string
  status: EligibilityStatus
  rules: RawRuleResult[]
}

interface RawEligibilityResponse {
  eligible_count: number
  missing_info_count: number
  not_eligible_count: number
  results: RawSchemeResult[]
}

export const eligibilityApi = {
  check: async (): Promise<EligibilityCheckResult> => {
    const raw = await request<RawEligibilityResponse>('/eligibility/check', { method: 'POST' })

    return {
      eligibleCount: raw.eligible_count,
      missingInfoCount: raw.missing_info_count,
      notEligibleCount: raw.not_eligible_count,
      results: raw.results.map((r) => ({
        schemeSlug: r.scheme_slug,
        schemeName: r.scheme_name,
        sourceUrl: r.source_url,
        status: r.status,
        rules: r.rules.map((rule) => ({
          field: rule.field,
          operator: rule.operator,
          value: rule.value,
          profileValue: rule.profile_value,
          result: rule.result,
          explanation: rule.explanation,
        })),
      })),
    }
  },
}

export interface TopMatch {
  schemeSlug: string
  schemeName: string
  sourceUrl: string
  category: string
  benefit: string
  deadline: string | null
  status: EligibilityStatus
  matchPercentage: number
}

export interface ActionItem {
  field: string
  message: string
  affectedSchemeCount: number
}

export interface RecommendationsResult {
  topMatches: TopMatch[]
  actionItems: ActionItem[]
}

interface RawTopMatch {
  scheme_slug: string
  scheme_name: string
  source_url: string
  category: string
  benefit: string
  deadline: string | null
  status: EligibilityStatus
  match_percentage: number
}

interface RawActionItem {
  field: string
  message: string
  affected_scheme_count: number
}

interface RawRecommendationsResponse {
  top_matches: RawTopMatch[]
  action_items: RawActionItem[]
}

export const recommendationsApi = {
  get: async (): Promise<RecommendationsResult> => {
    const raw = await request<RawRecommendationsResponse>('/recommendations')

    return {
      topMatches: raw.top_matches.map((m) => ({
        schemeSlug: m.scheme_slug,
        schemeName: m.scheme_name,
        sourceUrl: m.source_url,
        category: m.category,
        benefit: m.benefit,
        deadline: m.deadline,
        status: m.status,
        matchPercentage: m.match_percentage,
      })),
      actionItems: raw.action_items.map((a) => ({
        field: a.field,
        message: a.message,
        affectedSchemeCount: a.affected_scheme_count,
      })),
    }
  },
}

export interface FamilyMemberInput {
  name: string
  relation: 'spouse' | 'child' | 'parent' | 'sibling' | 'other'
  profile: {
    age?: number
    state?: string
    education?: string
    income?: number
    occupation?: string
  }
}

export interface FamilyMember extends FamilyMemberInput {
  _id: string
}

export interface FamilyOptimizeResult {
  members: Array<{
    member_id: string
    member_name: string
    eligible_schemes: Array<{
      slug: string
      name: string
      category: string
      benefit: string
    }>
  }>
  conflicts: Array<{
    conflict_type: string
    scheme_slugs: string[]
    scheme_names: string[]
    member_ids: string[]
    message: string
    recommended_resolution?: string
  }>
}

export const familyApi = {
  list: async (): Promise<FamilyMember[]> => {
    const raw = await request<{ members: FamilyMember[] }>('/family')
    return raw.members
  },
  add: async (data: FamilyMemberInput): Promise<FamilyMember> => {
    const raw = await request<{ member: FamilyMember }>('/family', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return raw.member
  },
  remove: async (id: string): Promise<void> => {
    await request(`/family/${id}`, { method: 'DELETE' })
  },
  optimize: async (): Promise<FamilyOptimizeResult> => {
    return await request<FamilyOptimizeResult>('/family/optimize', { method: 'POST' })
  },
}

export interface LifeEvent {
  _id: string
  rawText: string
  eventType: string
  confidence: number
  suggestedCategories: string[]
  createdAt: string
}

export const lifeEventsApi = {
  submit: async (text: string): Promise<LifeEvent> => {
    const raw = await request<{ event: LifeEvent }>('/life-events', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return raw.event
  },
  history: async (): Promise<LifeEvent[]> => {
    const raw = await request<{ events: LifeEvent[] }>('/life-events')
    return raw.events
  },
}

export interface DocumentExtraction {
  document_type: string
  name: string | null
  income: number | null
  issue_date: string | null
  expiry_date: string | null
  is_expired: boolean | null
  confidence: number
}

export const documentsApi = {
  extract: async (filename: string, mimeType: string, base64Data: string): Promise<DocumentExtraction> => {
    return await request<DocumentExtraction>('/documents/extract', {
      method: 'POST',
      body: JSON.stringify({ filename, mimeType, base64Data }),
    })
  },
}

export interface ApplicationValidation {
  isValid: boolean
  warnings: string[]
}

export const applicationsApi = {
  validate: async (data: { schemeId: string, nameOnApplication: string, dobOnApplication?: string }): Promise<ApplicationValidation> => {
    return await request<ApplicationValidation>('/applications/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

export interface DebuggerResult {
  root_cause: string
  missing_evidence: string | null
  citation: string
  next_steps: string[]
}

export const debuggerApi = {
  debug: async (schemeSlug: string, filename: string, mimeType: string, base64Data: string): Promise<DebuggerResult> => {
    return await request<DebuggerResult>('/debugger/debug', {
      method: 'POST',
      body: JSON.stringify({ schemeSlug, filename, mimeType, base64Data }),
    })
  }
}

export interface SimulatorResult {
  unlocked_schemes: Array<{ slug: string; name: string; category: string; benefit: string }>
  lost_schemes: Array<{ slug: string; name: string; category: string; benefit: string }>
}

export const simulatorApi = {
  simulate: async (data: { hypotheticalIncome?: number, hypotheticalAge?: number }): Promise<SimulatorResult> => {
    return await request<SimulatorResult>('/simulator/simulate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const copilotApi = {
  ask: async (schemeSlug: string, question: string): Promise<{ answer: string }> => {
    return await request<{ answer: string }>('/copilot/ask', {
      method: 'POST',
      body: JSON.stringify({ schemeSlug, question }),
    })
  },
  getDeadlines: async (): Promise<Array<{ scheme_slug: string, scheme_name: string, deadline: string, days_left: number }>> => {
    return await request<any>('/copilot/deadlines')
  }
}

export { ApiError }
