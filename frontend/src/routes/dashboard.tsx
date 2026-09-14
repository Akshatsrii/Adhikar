import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isLoading, user, navigate])

  if (isLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading your dashboard…</p>
  }

  if (!user) return null

  return (
    <div>
      <h1 className="text-3xl text-[var(--color-ink)]">Welcome, {user.name}</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Your profile isn't complete yet — add your details to see matched schemes.
      </p>
      <div className="mt-4 flex gap-3">
        <Link
          to="/profile"
          className="inline-flex items-center justify-center rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron-deep)]"
        >
          Complete your profile →
        </Link>
        <Link
          to="/eligibility"
          className="inline-flex items-center justify-center rounded-md bg-[var(--color-saffron)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-saffron-deep)]"
        >
          Check Eligibility
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-[var(--color-ink-soft)]">Matched schemes</p>
          <p className="mt-1 text-3xl text-[var(--color-ink)]">—</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--color-ink-soft)]">Applications in progress</p>
          <p className="mt-1 text-3xl text-[var(--color-ink)]">—</p>
        </div>
        <div className="card">
          <p className="text-sm text-[var(--color-ink-soft)]">Profile completeness</p>
          <p className="mt-1 text-3xl text-[var(--color-ink)]">0%</p>
        </div>
      </div>
    </div>
  )
}
