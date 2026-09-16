import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ApiError,
  copilotApi,
  recommendationsApi,
  type ActionItem,
  type TopMatch,
} from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

const STATUS_BADGE: Record<TopMatch['status'], { icon: string; className: string }> = {
  eligible: { icon: '✅', className: 'bg-green-50 text-[var(--color-govgreen)] border-green-200' },
  missing_info: { icon: '⚠️', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  not_eligible: { icon: '❌', className: 'bg-red-50 text-red-700 border-red-200' },
}

function MatchCard({ match }: { match: TopMatch }) {
  const badge = STATUS_BADGE[match.status]

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${badge.className}`}
          >
            {badge.icon} {match.matchPercentage}% match
          </span>
          <h3 className="mt-2 font-medium text-[var(--color-ink)]">{match.schemeName}</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{match.benefit}</p>
        </div>
        <a
          href={match.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs text-[var(--color-saffron-deep)] hover:underline"
        >
          Source ↗
        </a>
      </div>
      {match.deadline && (
        <p className="mt-3 text-xs text-[var(--color-ink-soft)]">Deadline: {match.deadline}</p>
      )}
    </div>
  )
}

function ActionItemRow({ item }: { item: ActionItem }) {
  return (
    <Link
      to="/profile"
      className="flex items-center justify-between rounded-lg border border-[var(--color-line)] bg-white px-4 py-3 text-sm hover:border-[var(--color-saffron)]"
    >
      <span className="text-[var(--color-ink)]">{item.message}</span>
      <span className="text-[var(--color-saffron-deep)]">→</span>
    </Link>
  )
}

function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [topMatches, setTopMatches] = useState<TopMatch[]>([])
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [deadlines, setDeadlines] = useState<Array<{ scheme_slug: string, scheme_name: string, deadline: string, days_left: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return

    async function loadData() {
      try {
        const [recData, dlData] = await Promise.all([
          recommendationsApi.get(),
          copilotApi.getDeadlines().catch(() => []),
        ])
        setTopMatches(recData.topMatches)
        setActionItems(recData.actionItems)
        setDeadlines(dlData)
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Could not load your dashboard data.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  if (isAuthLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading your dashboard…</p>
  }

  if (!user) return null

  const eligibleCount = topMatches.filter((m) => m.status === 'eligible').length ?? 0

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-[var(--color-ink)]">Welcome, {user.name}</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            {topMatches.length > 0
              ? `${eligibleCount} scheme${eligibleCount === 1 ? '' : 's'} you're eligible for right now.`
              : "Complete your profile to see schemes matched to you."}
          </p>
        </div>

        {deadlines && deadlines.length > 0 && (
          <div className="w-full bg-red-50 border border-red-200 rounded p-4 mb-4">
            <h3 className="font-bold text-red-800 mb-2">⏰ Urgent Deadlines!</h3>
            <ul className="space-y-1">
              {deadlines.map((dl, i) => (
                <li key={i} className="text-sm font-medium text-red-700">
                  {dl.scheme_name} expires in {dl.days_left} days ({dl.deadline})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron-deep)]"
          >
            Edit profile
          </Link>
          <Link to="/assistant" className="btn-primary !py-2 !px-4 text-sm">
            Ask Adhikar
          </Link>
          <Link
            to="/eligibility"
            className="inline-flex items-center justify-center rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron-deep)]"
          >
            Full eligibility check
          </Link>
        </div>
      </div>

      {isLoading && (
        <p className="mt-8 text-sm text-[var(--color-ink-soft)]">Finding your matches…</p>
      )}

      {error && (
        <p className="mt-8 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {!isLoading && (
        <>
          {actionItems.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-medium text-[var(--color-ink-soft)]">
                Complete your profile to unlock more matches
              </h2>
              <div className="mt-3 space-y-2">
                {actionItems.map((item) => (
                  <ActionItemRow key={item.field} item={item} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-sm font-medium text-[var(--color-ink-soft)]">Top matches</h2>
            {topMatches.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
                No matches yet —{' '}
                <Link to="/profile" className="font-medium text-[var(--color-saffron-deep)]">
                  complete your profile
                </Link>{' '}
                to get started.
              </p>
            ) : (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {topMatches.map((m) => (
                  <MatchCard key={m.schemeSlug} match={m} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
