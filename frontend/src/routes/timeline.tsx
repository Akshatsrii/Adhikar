import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { applicationsApi } from '@/lib/api'
import { Clock, CheckCircle2, Circle, AlertCircle, Plus, Trash2, ChevronDown, ChevronUp, FileText, Calendar, ArrowRight, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/timeline')({
  component: ApplicationTimeline,
})

type StatusType = 'pending' | 'in-progress' | 'submitted' | 'approved' | 'rejected'

interface TimelineEntry {
  id: number
  scheme: string
  category: string
  appliedDate: string
  status: StatusType
  nextStep: string
  notes: string
  deadline?: string
}

const statusConfig: Record<StatusType, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  pending: { label: 'Pending', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300', icon: Circle },
  'in-progress': { label: 'In Progress', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', icon: Clock },
  submitted: { label: 'Submitted', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300', icon: FileText },
  approved: { label: 'Approved âœ“', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-300', icon: AlertCircle },
}

const defaultEntries: TimelineEntry[] = [
  {
    id: 1,
    scheme: 'PM Awas Yojana (Urban)',
    category: 'Housing',
    appliedDate: 'Sep 5, 2025',
    status: 'approved',
    nextStep: 'Receive first installment via DBT',
    notes: 'Application ID: PMAY-U-2025-00124. Approved under BLC category.',
    deadline: '',
  },
  {
    id: 2,
    scheme: 'PM-KISAN Samman Nidhi',
    category: 'Agriculture',
    appliedDate: 'Oct 1, 2025',
    status: 'submitted',
    nextStep: 'Aadhaar verification pending at block office',
    notes: 'Register number: RJT-2025-PM-88. Visit block office within 15 days.',
    deadline: 'Oct 30, 2025',
  },
  {
    id: 3,
    scheme: 'Ayushman Bharat PMJAY',
    category: 'Healthcare',
    appliedDate: 'Oct 8, 2025',
    status: 'in-progress',
    nextStep: 'Collect Ayushman card from nearest CSC center',
    notes: 'eKYC done. Waiting for card generation.',
    deadline: '',
  },
  {
    id: 4,
    scheme: 'National Scholarship (Post-Matric)',
    category: 'Education',
    appliedDate: 'Oct 12, 2025',
    status: 'pending',
    nextStep: 'Upload income certificate and previous marksheet',
    notes: '',
    deadline: 'Nov 30, 2025',
  },
]

const statusOrder: StatusType[] = ['pending', 'in-progress', 'submitted', 'approved', 'rejected']

export default function ApplicationTimeline() {
  const [entries, setEntries] = useState<TimelineEntry[]>(defaultEntries)

  useEffect(() => {
    applicationsApi.list()
      .then(apps => {
        if (apps && apps.length > 0) {
          const mapped: TimelineEntry[] = apps.map((app: any, idx: number) => {
            const rawStatus = (app.status || "").toLowerCase()
            const st: StatusType = (rawStatus === "approved" ? "approved" : rawStatus === "rejected" ? "rejected" : rawStatus === "submitted" ? "submitted" : "in-progress")
            return {
              id: 1000 + idx,
              scheme: app.schemeName || app.schemeSlug,
              category: app.category || "General",
              appliedDate: new Date(app.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
              status: st,
              nextStep: app.nextStep || "Application under department review",
              notes: `Reference ID: ${app.referenceNumber || app._id || "N/A"}`,
              deadline: app.deadline || ""
            }
          })
          setEntries(mapped)
        }
      })
      .catch(() => {})
  }, [])
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1, 2]))
  const [adding, setAdding] = useState(false)
  const [newEntry, setNewEntry] = useState({ scheme: '', category: 'Housing', appliedDate: '', notes: '', deadline: '' })

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const cycleStatus = (id: number) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const idx = statusOrder.indexOf(e.status)
      return { ...e, status: statusOrder[(idx + 1) % statusOrder.length] }
    }))
  }

  const deleteEntry = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const addEntry = () => {
    if (!newEntry.scheme.trim()) return
    const entry: TimelineEntry = {
      id: Date.now(),
      scheme: newEntry.scheme,
      category: newEntry.category,
      appliedDate: newEntry.appliedDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      nextStep: 'Begin application process',
      notes: newEntry.notes,
      deadline: newEntry.deadline,
    }
    setEntries(prev => [entry, ...prev])
    setNewEntry({ scheme: '', category: 'Housing', appliedDate: '', notes: '', deadline: '' })
    setAdding(false)
  }

  const counts = {
    approved: entries.filter(e => e.status === 'approved').length,
    pending: entries.filter(e => e.status === 'pending' || e.status === 'in-progress').length,
    submitted: entries.filter(e => e.status === 'submitted').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-indigo-300 mb-5">
            <Clock className="w-3.5 h-3.5" />
            <span>My Application Journey</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Application Timeline</h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Track every scheme you've applied for â€” from pending to approved â€” in a single visual timeline. Never miss a deadline or next step.
          </p>
          {/* Stats */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            {[
              { label: 'Approved', val: counts.approved, color: 'text-emerald-400' },
              { label: 'In-Flight', val: counts.pending, color: 'text-amber-400' },
              { label: 'Submitted', val: counts.submitted, color: 'text-blue-400' },
              { label: 'Total', val: entries.length, color: 'text-white' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/15 text-center">
                <div className={`text-2xl font-black ${stat.color}`}>{stat.val}</div>
                <div className="text-[11px] text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">

        {/* Add New Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-slate-900">Your Applications</h2>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-full transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Scheme
          </button>
        </div>

        {/* Add Form */}
        {adding && (
          <div className="bg-white rounded-2xl border-2 border-indigo-300 p-6 mb-6 shadow-md">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Add New Scheme Application
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Scheme Name *</label>
                <input
                  value={newEntry.scheme}
                  onChange={e => setNewEntry(p => ({ ...p, scheme: e.target.value }))}
                  placeholder="e.g. MGNREGA Job Card, PM Ujjwala Yojana..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                <select
                  value={newEntry.category}
                  onChange={e => setNewEntry(p => ({ ...p, category: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {['Housing', 'Agriculture', 'Healthcare', 'Education', 'Employment', 'Women & Child', 'Food Security', 'Social Welfare'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Deadline (optional)</label>
                <input
                  type="date"
                  value={newEntry.deadline}
                  onChange={e => setNewEntry(p => ({ ...p, deadline: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Notes</label>
                <textarea
                  value={newEntry.notes}
                  onChange={e => setNewEntry(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Application ID, reference number, special instructions..."
                  rows={2}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addEntry} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-full transition">
                Add to Timeline
              </button>
              <button onClick={() => setAdding(false)} className="text-slate-500 hover:text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-full transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-300 via-blue-200 to-slate-200 hidden sm:block" />

          <div className="space-y-4">
            {entries.map((entry) => {
              const cfg = statusConfig[entry.status]
              const Icon = cfg.icon
              const isExpanded = expanded.has(entry.id)
              return (
                <div key={entry.id} className="sm:pl-14 relative">
                  {/* Status dot on timeline */}
                  <div className={`absolute left-3 top-5 w-6 h-6 rounded-full border-2 ${cfg.border} ${cfg.bg} flex items-center justify-center hidden sm:flex`}>
                    <Icon className={`w-3 h-3 ${cfg.color}`} />
                  </div>

                  <div className={`bg-white rounded-2xl border-2 ${cfg.border} shadow-sm hover:shadow-md transition-all duration-300`}>
                    {/* Card Header */}
                    <div className="p-4 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                            {entry.category}
                          </span>
                          {entry.deadline && (
                            <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" /> Deadline: {entry.deadline}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-slate-900">{entry.scheme}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Applied: {entry.appliedDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => cycleStatus(entry.id)}
                          title="Click to advance status"
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-full transition border border-indigo-200"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Next Step</div>
                            <p className="text-xs font-semibold text-slate-700">{entry.nextStep}</p>
                          </div>
                        </div>
                        {entry.notes && (
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Notes</div>
                              <p className="text-xs text-slate-600">{entry.notes}</p>
                            </div>
                          </div>
                        )}
                        {/* Status Progress Bar */}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Progress</div>
                          <div className="flex items-center gap-1.5">
                            {statusOrder.slice(0, 4).map((s, i) => {
                              const currentIdx = statusOrder.indexOf(entry.status)
                              const active = i <= currentIdx
                              return (
                                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${active ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                              )
                            })}
                          </div>
                          <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-medium">
                            <span>Pending</span>
                            <span>In-Progress</span>
                            <span>Submitted</span>
                            <span>Approved</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {entries.length === 0 && (
            <div className="text-center py-16">
              <Clock className="w-14 h-14 mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-semibold">No applications tracked yet.</p>
              <p className="text-slate-400 text-sm mt-1">Click "Add Scheme" to start your journey.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
