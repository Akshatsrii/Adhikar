import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { notificationsApi, type AppNotification } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

const KIND_META: Record<AppNotification['kind'], { icon: string; className: string }> = {
  eligibility_lost: { icon: '⚠️', className: 'border-amber-200 bg-amber-50' },
  eligibility_gained: { icon: '✅', className: 'border-green-200 bg-green-50' },
  documents_changed: { icon: '📄', className: 'border-[var(--color-line)] bg-white' },
  deadline_changed: { icon: '⏰', className: 'border-red-200 bg-red-50' },
}

function NotificationCard({
  notification,
  onRead,
}: {
  notification: AppNotification
  onRead: () => void
}) {
  const meta = KIND_META[notification.kind]
  const isUnread = notification.readAt === null

  return (
    <div
      className={`rounded-lg border px-4 py-3 ${meta.className} ${isUnread ? '' : 'opacity-60'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2">
          <span>{meta.icon}</span>
          <div>
            <h3 className="text-sm font-medium text-[var(--color-ink)]">
              {notification.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{notification.body}</p>
            {notification.sourceUrl && (
              <a
                href={notification.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-[var(--color-saffron-deep)] hover:underline"
              >
                Verify on the official source ↗
              </a>
            )}
          </div>
        </div>

        {isUnread && (
          <button
            onClick={onRead}
            className="shrink-0 text-xs text-[var(--color-saffron-deep)] hover:underline"
          >
            Mark read
          </button>
        )}
      </div>
    </div>
  )
}

function NotificationsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) navigate({ to: '/login' })
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    notificationsApi
      .list()
      .then((res) => {
        setNotifications(res.notifications)
        setUnreadCount(res.unreadCount)
      })
      .finally(() => setIsLoading(false))
  }, [user])

  async function handleRead(id: string) {
    await notificationsApi.markRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  async function handleReadAll() {
    await notificationsApi.markAllRead()
    const now = new Date().toISOString()
    setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })))
    setUnreadCount(0)
  }

  if (isAuthLoading) return <p className="text-sm text-[var(--color-ink-soft)]">Loading…</p>
  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-[var(--color-ink)]">Alerts</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            When a government rule changes in a way that affects you, it shows up here.
          </p>
        </div>

        {unreadCount > 0 && (
          <button onClick={handleReadAll} className="text-sm text-[var(--color-saffron-deep)]">
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {isLoading && (
        <p className="mt-8 text-sm text-[var(--color-ink-soft)]">Loading your alerts…</p>
      )}

      {!isLoading && notifications.length === 0 && (
        <p className="mt-8 text-sm text-[var(--color-ink-soft)]">
          No alerts — nothing has changed for your schemes.
        </p>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="mt-6 space-y-3">
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onRead={() => handleRead(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
