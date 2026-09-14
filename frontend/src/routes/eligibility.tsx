import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ApiError,
  eligibilityApi,
  type EligibilityCheckResult,
  type SchemeEligibilityResult,
} from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/eligibility')({
  component: EligibilityPage,
})

const STATUS_META: Record<
  SchemeEligibilityResult['status'],
  { icon: string; label: string; badgeClass: string }
> = {
  eligible: {
    icon: '✅',
    label: 'Eligible',
    badgeClass: 'bg-green-50 text-[var(--color-govgreen)] border-green-200',
  },
  not_eligible: {
    icon: '❌',
    label: 'Not eligible',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
  },
  missing_info: {
    icon: '⚠️',
    label: 'Need more info',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
}

function SchemeResultCard({ result }: { result: SchemeEligibilityResult }) {
  const [expanded, setExpanded] = useState(false)
  const meta = STATUS_META[result.status]

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.badgeClass}`}
          >
            {meta.icon} {meta.label}
          </span>
          <h3 className="mt-2 text-lg font-medium text-[var(--color-ink)]">
            {result.schemeName}
          </h3>
        </div>
        <a
          href={result.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs text-[var(--color-saffron-deep)] hover:underline"
        >
          Official source ↗
        </a>
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="mt-3 text-sm font-medium text-[var(--color-saffron-deep)]"
      >
        {expanded ? 'Hide details' : 'Why?'}
      </button>

      {expanded && (
        <ul className="mt-3 space-y-2 border-t border-[var(--color-line)] pt-3">
          {result.rules.map((rule, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span>
                {rule.result === 'pass' ? '✅' : rule.result === 'fail' ? '❌' : '⚠️'}
              </span>
              <span className="text-[var(--color-ink-soft)]">{rule.explanation}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function EligibilityPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [result, setResult] = useState<EligibilityCheckResult | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  async function runCheck() {
    setError(null)
    setIsChecking(true)
    try {
      const res = await eligibilityApi.check()
      setResult(res)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not check your eligibility. Please try again.',
      )
    } finally {
      setIsChecking(false)
    }
  }

  if (isAuthLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading…</p>
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl text-[var(--color-ink)]">Check your eligibility</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        This runs your profile against each scheme's official rules — no guessing, every
        result is explainable.
      </p>

      {!result && (
        <button onClick={runCheck} disabled={isChecking} className="btn-primary mt-6">
          {isChecking ? 'Checking…' : 'Check my eligibility'}
        </button>
      )}

      {error && (
        <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          {error.toLowerCase().includes('profile') && (
            <>
              {' '}
              <Link to="/profile" className="font-medium underline">
                Complete your profile →
              </Link>
            </>
          )}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <div className="mb-6 flex gap-3 text-sm">
            <span className="rounded-full bg-green-50 px-3 py-1 text-[var(--color-govgreen)]">
              {result.eligibleCount} eligible
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
              {result.missingInfoCount} need info
            </span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">
              {result.notEligibleCount} not eligible
            </span>
          </div>

          <div className="space-y-4">
            {result.results.map((r) => (
              <SchemeResultCard key={r.schemeSlug} result={r} />
            ))}
          </div>

          <button
            onClick={runCheck}
            disabled={isChecking}
            className="mt-6 text-sm font-medium text-[var(--color-saffron-deep)]"
          >
            {isChecking ? 'Re-checking…' : 'Re-check'}
          </button>
        </div>
      )}
    </div>
  )
}
