import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { lifeEventsApi, type LifeEvent, ApiError } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/life-events')({
  component: LifeEventsPage,
})

function LifeEventsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [events, setEvents] = useState<LifeEvent[]>([])
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    loadEvents()
  }, [user])

  async function loadEvents() {
    try {
      const data = await lifeEventsApi.history()
      setEvents(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    setIsSubmitting(true)
    setError(null)
    try {
      await lifeEventsApi.submit(text)
      setText('')
      await loadEvents()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit event')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading || isLoading) {
    return <p className="text-sm text-[var(--color-ink-soft)]">Loading...</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold text-[var(--color-ink)]">Life Events</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Tell us about a recent change in your life (e.g., "I just got married", "I lost my job"),
        and we'll figure out what government schemes might help you now.
      </p>

      {error && <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="E.g. Meri shaadi hone wali hai..."
          className="min-h-[100px] w-full rounded-md border border-[var(--color-line)] p-3 text-sm focus:border-[var(--color-saffron)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="btn-primary self-end"
        >
          {isSubmitting ? 'Analyzing...' : 'Report Life Event'}
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-lg font-medium text-[var(--color-ink)]">Event History</h2>
        {events.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-ink-soft)]">No life events reported yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {events.map((event) => (
              <div key={event._id} className="card">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-[var(--color-ink)]">"{event.rawText}"</p>
                  <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                    {event.eventType}
                  </span>
                </div>
                {event.suggestedCategories && event.suggestedCategories.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-[var(--color-ink-soft)]">Suggested scheme categories:</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {event.suggestedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-full border border-[var(--color-line)] bg-gray-50 px-2 py-0.5 text-xs text-[var(--color-ink)]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  {new Date(event.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
