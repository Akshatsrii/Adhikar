import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi, clearToken, getToken, setToken, type AuthUser } from '@/lib/api'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: (nextUser, token) => {
        setToken(token)
        setUser(nextUser)
      },
      logout: () => {
        clearToken()
        setUser(null)
      },
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
