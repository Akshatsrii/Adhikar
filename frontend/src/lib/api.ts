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

export { ApiError }
