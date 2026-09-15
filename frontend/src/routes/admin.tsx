import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { adminApi } from '@/lib/api'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)

  useEffect(() => {
    loadQueue()
  }, [])

  async function loadQueue() {
    setLoading(true)
    try {
      const data = await adminApi.getQueue()
      setQueue(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleTrigger() {
    setTriggering(true)
    try {
      await adminApi.triggerCrawler()
      await loadQueue()
    } catch (e) {
      console.error(e)
    } finally {
      setTriggering(false)
    }
  }

  async function handleApprove(id: number, action: 'APPROVE' | 'REJECT') {
    try {
      await adminApi.approveChange(id, action)
      setQueue(prev => prev.filter(q => q.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-ink)]">Admin Verification Queue</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Review and approve automated scheme updates detected by AI crawlers.
          </p>
        </div>
        <button 
          onClick={handleTrigger} 
          disabled={triggering}
          className="btn-primary"
        >
          {triggering ? 'Crawling...' : 'Run Crawler'}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading queue...</p>
      ) : queue.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-gray-500">Queue is empty. No new changes detected.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {queue.map(item => (
            <div key={item.id} className="rounded-xl border border-[var(--color-line)] p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-2">
                    {item.change_type}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--color-ink)]">{item.scheme_slug}</h3>
                  <a href={item.source_url} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-saffron)] hover:underline">
                    View Source Document ↗
                  </a>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[var(--color-ink-soft)]">AI Confidence</div>
                  <div className={`text-lg font-bold ${item.ai_confidence_score > 0.8 ? 'text-green-600' : 'text-orange-500'}`}>
                    {(item.ai_confidence_score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-100">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Semantic Diff</h4>
                <p className="text-sm text-[var(--color-ink)]">{item.diff_summary}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-[var(--color-ink-soft)]">
                  <span className="font-bold text-[var(--color-ink)]">{item.affected_users_count}</span> users will be affected.
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => handleApprove(item.id, 'REJECT')} className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded hover:bg-red-50">
                    Reject
                  </button>
                  <button onClick={() => handleApprove(item.id, 'APPROVE')} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700">
                    Approve & Notify Users
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
