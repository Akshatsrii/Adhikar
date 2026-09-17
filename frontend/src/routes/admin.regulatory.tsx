import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ApiError, adminApi, type RegulatoryChange } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/admin/regulatory')({
  component: AdminRegulatoryPage,
})

function ChangeCard({
  change,
  onReviewed,
}: {
  change: RegulatoryChange
  onReviewed: (id: number, action: 'approved' | 'rejected', notified: number) => void
}) {
  const [note, setNote] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function act(action: 'approve' | 'reject') {
    setError(null)
    setIsBusy(true)
    try {
      if (action === 'approve') {
        const res = await adminApi.approve(change.id, note || undefined)
        onReviewed(change.id, 'approved', res.notifications_created)
      } else {
        await adminApi.reject(change.id, note || undefined)
        onReviewed(change.id, 'rejected', 0)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Review action failed.')
    } finally {
      setIsBusy(false)
    }
  }

  const confidencePct = Math.round(change.confidence * 100)

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--color-ink)]">{change.schemeName}</h3>
          <span className="mt-1 inline-block rounded-full bg-[var(--color-parchment-dim)] px-2 py-0.5 text-xs text-[var(--color-ink-soft)]">
            {change.changeType.replace(/_/g, ' ')}
          </span>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--color-line)] px-2 py-0.5 text-xs text-[var(--color-ink-soft)]">
          {change.authorityLevel}
        </span>
      </div>

      <p className="mt-3 text-sm text-[var(--color-ink)]">{change.summary}</p>

      {change.oldValue !== null && change.newValue !== null && (
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="rounded bg-red-50 px-2 py-1 text-red-700 line-through">
            {change.oldValue}
          </span>
          <span className="text-[var(--color-ink-soft)]">→</span>
          <span className="rounded bg-green-50 px-2 py-1 text-[var(--color-govgreen)]">
            {change.newValue}
          </span>
        </div>
      )}

      {change.impact && (
        <div className="mt-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-parchment-dim)]/40 px-3 py-2 text-sm">
          <p className="font-medium text-[var(--color-ink)]">Citizen impact</p>
          <p className="mt-1 text-[var(--color-ink-soft)]">
            {change.impact.totalEvaluated} evaluated ·{' '}
            <strong className="text-red-700">{change.impact.lostEligibilityCount}</strong> may
            lose eligibility ·{' '}
            <strong className="text-[var(--color-govgreen)]">
              {change.impact.gainedEligibilityCount}
            </strong>{' '}
            may gain it · {change.impact.unchangedCount} unaffected
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-ink-soft)]">
        <span>AI confidence: {confidencePct}%</span>
        <a
          href={change.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--color-saffron-deep)] hover:underline"
        >
          Official source ↗
        </a>
      </div>

      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="field mt-4"
        placeholder="Review note (optional)"
      />

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-3 flex gap-3">
        <button onClick={() => act('approve')} disabled={isBusy} className="btn-primary flex-1">
          {isBusy ? 'Working…' : 'Approve & publish'}
        </button>
        <button
          onClick={() => act('reject')}
          disabled={isBusy}
          className="flex-1 rounded-md border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:border-red-300 hover:text-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  )
}

function AdminRegulatoryPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [changes, setChanges] = useState<RegulatoryChange[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) navigate({ to: '/login' })
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    adminApi
      .listChanges('pending')
      .then(setChanges)
      .catch((err) =>
        setError(
          err instanceof ApiError && err.status === 403
            ? 'This page is restricted to administrators.'
            : 'Could not load the review queue.',
        ),
      )
      .finally(() => setIsLoading(false))
  }, [user])

  function handleReviewed(id: number, action: 'approved' | 'rejected', notified: number) {
    setChanges((prev) => prev.filter((c) => c.id !== id))
    setToast(
      action === 'approved'
        ? `Change published${notified > 0 ? ` — ${notified} citizen${notified === 1 ? '' : 's'} notified` : ''}.`
        : 'Change rejected — nothing was published.',
    )
  }

  if (isAuthLoading) return <p className="text-sm text-[var(--color-ink-soft)]">Loading…</p>
  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl text-[var(--color-ink)]">Regulatory review queue</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Detected changes to official scheme rules. Nothing reaches citizens until it's
        approved here.
      </p>

      {toast && (
        <p className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm text-[var(--color-govgreen)]">
          {toast}
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {isLoading && (
        <p className="mt-8 text-sm text-[var(--color-ink-soft)]">Loading pending changes…</p>
      )}

      {!isLoading && !error && changes.length === 0 && (
        <p className="mt-8 text-sm text-[var(--color-ink-soft)]">
          Queue is clear — no pending regulatory changes.
        </p>
      )}

      {changes.length > 0 && (
        <div className="mt-6 space-y-4">
          {changes.map((c) => (
            <ChangeCard key={c.id} change={c} onReviewed={handleReviewed} />
          ))}
        </div>
      )}
    </div>
  )
}
