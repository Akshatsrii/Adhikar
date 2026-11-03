import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/react'
import { authApi, clearToken, getToken, setToken, type AuthUser } from '@/lib/api'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUser()
  const { signOut } = useClerk()
  const { getToken: getClerkToken } = useClerkAuth()

  const [localUser, setLocalUser] = useState<AuthUser | null>(null)
  const [localLoading, setLocalLoading] = useState(true)

  // Sync Clerk token with local API client if signed in with Clerk
  useEffect(() => {
    if (clerkSignedIn) {
      getClerkToken()
        .then((token) => {
          if (token) setToken(token)
        })
        .catch(console.error)
    }
  }, [clerkSignedIn, getClerkToken])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLocalLoading(false)
      return
    }

    authApi
      .me()
      .then((res) => setLocalUser(res.user))
      .catch(() => clearToken())
      .finally(() => setLocalLoading(false))
  }, [])

  // Derived user: if Clerk is signed in, construct AuthUser from Clerk user; otherwise fallback to localUser
  const user: AuthUser | null = useMemo(() => {
    if (clerkSignedIn && clerkUser) {
      return {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress || 'Citizen',
        email: clerkUser.primaryEmailAddress?.emailAddress,
        role: (clerkUser.publicMetadata?.role as 'citizen' | 'admin') || localUser?.role || 'citizen',
        profile: localUser?.profile,
      }
    }
    return localUser
  }, [clerkSignedIn, clerkUser, localUser])

  const isLoading = !clerkLoaded || (localLoading && !clerkSignedIn)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: (nextUser, token) => {
        setToken(token)
        setLocalUser(nextUser)
      },
      logout: () => {
        clearToken()
        setLocalUser(null)
        if (clerkSignedIn) {
          signOut()
        }
      },
    }),
    [user, isLoading, clerkSignedIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
