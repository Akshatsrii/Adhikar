import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, CheckCircle2, Clock, FileText, Bell, Check, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { notificationsApi } from '@/lib/api'
import type { AppNotification } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) loadNotifications()
  }, [user])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await notificationsApi.list()
      setNotifications(data.notifications)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead()
      await loadNotifications()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    } catch (err) {
      console.error(err)
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const getIconAndColor = (kind: string) => {
    switch (kind) {
      case 'new_scheme': return { icon: <Bell className="w-5 h-5" />, color: 'bg-orange-100 text-orange-600' }
      case 'status_update': return { icon: <FileText className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' }
      case 'document_verified': return { icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-green-100 text-green-600' }
      case 'deadline': return { icon: <Clock className="w-5 h-5" />, color: 'bg-red-100 text-red-600' }
      default: return { icon: <Bell className="w-5 h-5" />, color: 'bg-gray-100 text-gray-600' }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa] min-h-screen">
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Notifications</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00428a] mb-2">Notifications</h1>
          <p className="text-sm text-gray-600">Stay updated with important alerts</p>
        </div>
        
        {notifications.some(n => !n.readAt) && (
          <button onClick={handleMarkAllRead} className="text-[#00428a] font-bold hover:underline flex items-center gap-1.5 text-sm">
            <Check className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-[#00428a]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center text-gray-500 flex flex-col items-center">
            <Bell className="w-12 h-12 text-gray-300 mb-3" />
            <p className="font-bold text-gray-900 mb-1">No Notifications</p>
            <p className="text-sm">You are all caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => {
              const { icon, color } = getIconAndColor(n.kind)
              return (
                <div key={n.id} className={`p-4 md:p-5 flex gap-4 hover:bg-gray-50 transition ${!n.readAt ? 'bg-blue-50/20' : ''}`} onClick={() => !n.readAt && handleMarkRead(n.id)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!n.readAt ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{n.title}</h4>
                      <span className="text-xs font-medium text-gray-400 shrink-0 ml-4">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-sm ${!n.readAt ? 'text-gray-800' : 'text-gray-500'}`}>{n.body}</p>
                    
                    {n.schemeSlug && (
                      <Link to="/scheme/$slug" params={{ slug: n.schemeSlug }} className="inline-block mt-3 text-xs font-bold text-[#00428a] hover:underline">
                        View Scheme →
                      </Link>
                    )}
                  </div>
                  {!n.readAt && (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
