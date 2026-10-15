import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, Sparkles, BookOpen, ShieldCheck, FileText, ArrowRight, CornerDownLeft, X, Building2 } from 'lucide-react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [schemes, setSchemes] = useState<PublicScheme[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    schemesApi.list(0, 50).then(res => {
      setSchemes(res.items)
    }).catch(console.error)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // System navigation shortcuts
  const systemPages = [
    { title: 'Schemes Directory', desc: 'Browse all central and state welfare initiatives', path: '/schemes', icon: BookOpen, tag: 'Browse' },
    { title: 'Check Eligibility', desc: 'Instant demographic and rule-based entitlement matcher', path: '/eligibility', icon: ShieldCheck, tag: 'Tool' },
    { title: 'AI Welfare Copilot', desc: 'Ask complex citizen questions to Gemini AI assistant', path: '/assistant', icon: Sparkles, tag: 'AI' },
    { title: 'Smart Document Hub', desc: 'DigiLocker OCR and encrypted vault', path: '/documents', icon: FileText, tag: 'Vault' },
    { title: 'Citizen Helpdesk & Grievance', desc: 'Direct escalation and grievance registration', path: '/contact', icon: Building2, tag: 'Support' },
  ]

  const filteredPages = systemPages.filter(p => 
    !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase())
  )

  const filteredSchemes = schemes.filter(s => 
    !query || 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.category.toLowerCase().includes(query.toLowerCase()) ||
    (s.department && s.department.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 6)

  const totalItems = filteredPages.length + filteredSchemes.length

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % (totalItems || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + totalItems) % (totalItems || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex < filteredPages.length) {
          const target = filteredPages[selectedIndex]
          if (target) {
            navigate({ to: target.path as any })
            onClose()
          }
        } else {
          const schemeIdx = selectedIndex - filteredPages.length
          const targetScheme = filteredSchemes[schemeIdx]
          if (targetScheme) {
            navigate({ to: '/scheme/$slug', params: { slug: targetScheme.slug } })
            onClose()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, totalItems, selectedIndex, filteredPages, filteredSchemes, navigate, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Spotlight Modal */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden z-10 transition-all duration-200 animate-in zoom-in-95">
        
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search schemes, benefits, documents, or tools... (e.g. Kisan, Health, PMAY)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 transition">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          
          {/* Quick Platform Pages */}
          {filteredPages.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Navigation & Tools
              </div>
              <div className="space-y-1">
                {filteredPages.map((page, idx) => {
                  const isSelected = selectedIndex === idx
                  const Icon = page.icon
                  return (
                    <div
                      key={page.path}
                      onClick={() => {
                        navigate({ to: page.path as any })
                        onClose()
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {page.title}
                          </div>
                          <div className={`text-[11px] truncate max-w-sm ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {page.desc}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {page.tag}
                        </span>
                        {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Schemes Results */}
          {filteredSchemes.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
                <span>Verified Schemes ({filteredSchemes.length})</span>
                <span className="text-[9px] lowercase font-normal">press enter to view</span>
              </div>
              <div className="space-y-1">
                {filteredSchemes.map((scheme, sIdx) => {
                  const overallIdx = filteredPages.length + sIdx
                  const isSelected = selectedIndex === overallIdx
                  return (
                    <div
                      key={scheme.slug}
                      onClick={() => {
                        navigate({ to: '/scheme/$slug', params: { slug: scheme.slug } })
                        onClose()
                      }}
                      onMouseEnter={() => setSelectedIndex(overallIdx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          ₹
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {scheme.name}
                          </div>
                          <div className={`text-[11px] truncate max-w-md ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {scheme.benefit || scheme.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {scheme.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-10 text-center text-slate-400">
              <p className="text-xs font-semibold">No results matching "{query}"</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching for keywords like "farmer", "health", "scholarship", or "ration".</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">↑</kbd>
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-blue-600">Adhikar Spotlight</span>
        </div>
      </div>
    </div>
  )
}
