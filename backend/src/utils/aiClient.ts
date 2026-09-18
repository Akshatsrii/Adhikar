import { env } from '../config/env.js'

export async function aiFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers)
  headers.set('x-internal-key', env.internalAiKey)

  return fetch(`${env.aiServiceUrl}${path}`, {
    ...init,
    headers,
  })
}
