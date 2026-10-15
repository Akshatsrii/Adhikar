import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Bookmark, ChevronRight, Printer, Trash2, Edit3, ArrowRight, Clock } from 'lucide-react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/saved')({
  component: SavedSchemesPage,
})

export interface SavedSchemeItem {
  slug: string
  name: string
  category: string
  benefit: string
  status: 'bookmarked' | 'docs_ready' | 'applied' | 'approved'
  note: string
  savedAt: string
}

const STORAGE_KEY = 'adhikar_saved_schemes'

export function SavedSchemesPage() {
  const [savedItems, setSavedItems] = useState<SavedSchemeItem[]>([])
  const [allSchemes, setAllSchemes] = useState<PublicScheme[]>([])
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [editNote, setEditNote] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    schemesApi.list(0, 100).then(res => {
      setAllSchemes(res.items)
    }).catch(console.error)

    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setSavedItems(parsed)
      } catch (e) {
        console.error(e)
      }
    } else {
      // Default initial mock bookmarks for new users to showcase feature immediately
      const initial: SavedSchemeItem[] = [
        {
          slug: 'pm-kisan-samman-nidhi',
          name: 'PM-KISAN Samman Nidhi',
          category: 'Agriculture',
          benefit: '₹6,000 / year DBT in 3 installments',
          status: 'applied',
          note: 'Submitted application on CSC portal. Land mutation record verified.',
          savedAt: new Date().toLocaleDateString('en-IN'),
        },
        {
          slug: 'pradhan-mantri-jan-arogya-yojana-pm-jay',
          name: 'Ayushman Bharat PM-JAY',
          category: 'Healthcare',
          benefit: '₹5,00,000 / family annual cashless health cover',
          status: 'docs_ready',
          note: 'Ration card and Aadhaar linked. Need to collect golden card from hospital.',
          savedAt: new Date().toLocaleDateString('en-IN'),
        },
      ]
      setSavedItems(initial)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    }
  }, [])

  const saveToStorage = (items: SavedSchemeItem[]) => {
    setSavedItems(items)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }

  const handleRemove = (slug: string) => {
    const updated = savedItems.filter(i => i.slug !== slug)
    saveToStorage(updated)
  }

  const handleUpdateStatus = (slug: string, status: SavedSchemeItem['status']) => {
    const updated = savedItems.map(i => (i.slug === slug ? { ...i, status } : i))
    saveToStorage(updated)
  }

  const handleSaveNote = (slug: string) => {
    const updated = savedItems.map(i => (i.slug === slug ? { ...i, note: editNote } : i))
    saveToStorage(updated)
    setEditingSlug(null)
  }

  const handleQuickAdd = (scheme: PublicScheme) => {
    if (savedItems.some(i => i.slug === scheme.slug)) return
    const newItem: SavedSchemeItem = {
      slug: scheme.slug,
      name: scheme.name,
      category: scheme.category,
      benefit: scheme.benefit || 'Direct government assistance',
      status: 'bookmarked',
      note: 'Saved from schemes catalog.',
      savedAt: new Date().toLocaleDateString('en-IN'),
    }
    const updated = [newItem, ...savedItems]
    saveToStorage(updated)
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredItems = savedItems.filter(i => {
    if (filterStatus === 'all') return true
    return i.status === filterStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 print:hidden">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Citizen Saved Schemes & Dossier</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden mb-8 print:border print:border-slate-300 print:bg-white print:text-black">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none print:hidden"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-blue-200 border border-white/20 print:text-slate-700 print:border-slate-300">
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              Personal Welfare Vault
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Saved Schemes & Application Tracker
            </h1>
            <p className="text-xs md:text-sm text-blue-200/80 leading-relaxed print:text-slate-600">
              Track your active government applications, record private notes, organize required documents, and print a formal citizen application dossier for offline visits.
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dossier</span>
            </button>
            <Link
              to="/schemes"
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/30 flex items-center gap-1.5"
            >
              <span>+ Browse Schemes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 print:hidden">
        {[
          { id: 'all', label: `All (${savedItems.length})` },
          { id: 'bookmarked', label: `Bookmarked (${savedItems.filter(i => i.status === 'bookmarked').length})` },
          { id: 'docs_ready', label: `Documents Ready (${savedItems.filter(i => i.status === 'docs_ready').length})` },
          { id: 'applied', label: `Applied (${savedItems.filter(i => i.status === 'applied').length})` },
          { id: 'approved', label: `Approved (${savedItems.filter(i => i.status === 'approved').length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              filterStatus === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Saved Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No schemes in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Bookmark entitlements from the schemes catalog to track their progress and create custom application checklists.
          </p>
          <Link
            to="/schemes"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
          >
            Explore Schemes Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => {
            const isEditing = editingSlug === item.slug
            return (
              <div
                key={item.slug}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-blue-200 transition-all duration-200 space-y-4 print:border-slate-300 print:shadow-none"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/40">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Saved on {item.savedAt}
                      </span>
                    </div>

                    <Link
                      to="/scheme/$slug"
                      params={{ slug: item.slug }}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 transition block leading-snug"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px]">₹</span>
                      <span>{item.benefit}</span>
                    </div>
                  </div>

                  {/* Status Dropdown Pill & Delete */}
                  <div className="flex items-center gap-3 shrink-0 print:hidden">
                    <select
                      value={item.status}
                      onChange={e => handleUpdateStatus(item.slug, e.target.value as any)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                        item.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'applied'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : item.status === 'docs_ready'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="bookmarked">📌 Bookmarked</option>
                      <option value="docs_ready">📁 Documents Ready</option>
                      <option value="applied">🚀 Applied</option>
                      <option value="approved">✅ Approved</option>
                    </select>

                    <button
                      onClick={() => handleRemove(item.slug)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Remove scheme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Private Citizen Note */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Citizen Notes & Action Checklist:</span>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditingSlug(item.slug)
                          setEditNote(item.note)
                        }}
                        className="text-blue-600 hover:underline flex items-center gap-1 print:hidden"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Note
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editNote}
                        onChange={e => setEditNote(e.target.value)}
                        className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                        rows={2}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveNote(item.slug)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSlug(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 italic">
                      "{item.note || 'No notes added. Click edit to add document checklists or application numbers.'}"
                    </p>
                  )}
                </div>

                {/* Print Verification Checklist */}
                <div className="hidden print:block pt-2 text-xs border-t border-slate-200 space-y-1">
                  <div className="font-bold text-slate-800">Physical Verification Checklist:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>[ ] Aadhaar Original & Photocopy</div>
                    <div>[ ] Bank Passbook / DBT Proof</div>
                    <div>[ ] Income Certificate (Tehsildar)</div>
                    <div>[ ] Ration Card / Category Proof</div>
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 pt-1 text-xs font-bold print:hidden">
                  <Link
                    to="/scheme/$slug"
                    params={{ slug: item.slug }}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Scheme Particulars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Suggested Flagship Schemes to Add */}
      {allSchemes.length > 0 && (
        <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-7 md:p-8 shadow-xs print:hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recommended Flagship Schemes</h3>
              <p className="text-xs text-slate-500">Quickly add high-benefit national missions to your vault.</p>
            </div>
            <Link to="/schemes" className="text-xs font-bold text-blue-600 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allSchemes
              .filter(s => !savedItems.some(i => i.slug === s.slug))
              .slice(0, 3)
              .map(scheme => (
                <div
                  key={scheme.slug}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {scheme.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{scheme.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{scheme.benefit || scheme.description}</p>
                  </div>
                  <button
                    onClick={() => handleQuickAdd(scheme)}
                    className="w-full py-1.5 bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 text-xs font-bold rounded-xl transition shadow-xs"
                  >
                    + Add to My Vault
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
