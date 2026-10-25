import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Search, SlidersHorizontal, ExternalLink, Zap, FilterX, Loader2, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

type SchemesSearch = { category?: string }

export const Route = createFileRoute('/schemes')({
  validateSearch: (search: Record<string, unknown>): SchemesSearch => {
    return { category: search.category as string | undefined }
  },
  component: SchemesPage,
})

const getCategoryImg = (cat: string) => {
  switch (cat?.toLowerCase()) {
    case 'education': return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop'
    case 'agriculture': return 'https://images.unsplash.com/photo-1592982537447-6f23342d2bf5?q=80&w=400&auto=format&fit=crop'
    case 'housing': return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop'
    case 'healthcare': return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop'
    case 'employment': return 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=400&auto=format&fit=crop'
    case 'women': return 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400&auto=format&fit=crop'
    default: return 'https://images.unsplash.com/photo-1571260899304-4250708f069f?q=80&w=400&auto=format&fit=crop'
  }
}

const CATEGORIES = ['Agriculture', 'Education', 'Healthcare', 'Housing', 'Employment', 'Women', 'Disability', 'Social Welfare']

function SchemesPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  
  const [schemes, setSchemes] = useState<PublicScheme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(search.category || null)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 250)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    schemesApi.list(0, 200).then(res => {
      setSchemes(res.items)
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (search.category !== activeCategory) {
      setActiveCategory(search.category || null)
    }
  }, [search.category])

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat)
    navigate({ search: { category: cat || undefined }, replace: true })
  }

  const filteredSchemes = schemes.filter(s => {
    if (debouncedQuery && !s.name.toLowerCase().includes(debouncedQuery.toLowerCase()) && !s.description?.toLowerCase().includes(debouncedQuery.toLowerCase())) return false
    if (activeCategory && s.category !== activeCategory) return false
    return true
  })

  const catDots: Record<string, string> = {
    Agriculture: 'bg-emerald-500', Employment: 'bg-blue-500', Housing: 'bg-amber-500',
    Healthcare: 'bg-rose-500', Education: 'bg-indigo-500', 'Social Welfare': 'bg-violet-500',
    Women: 'bg-pink-500', Disability: 'bg-purple-500',
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* FAANG-level Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400">Verified Catalog</span>
            <span>·</span>
            <span>Direct Government Portals Only</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 animate-fade-in-up">Government Schemes</h1>
              <p className="text-slate-400 text-sm max-w-xl animate-fade-in-up-1">
                {isLoading ? 'Loading verified schemes...' : `${filteredSchemes.length} of ${schemes.length} schemes`} · Updated from official portals weekly
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full md:w-80 animate-fade-in-up-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search schemes or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-white/40 focus:ring-4 focus:ring-white/10 transition font-medium"
              />
            </div>
          </div>

          {/* Category pill filters */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${
                activeCategory === null
                  ? 'bg-white text-slate-900 border-white shadow-sm'
                  : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
              }`}
            >
              All ({schemes.length})
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition border flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? 'bg-white text-slate-900 border-white shadow-sm'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${catDots[cat] || 'bg-slate-400'}`} />
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body: Sidebar + Cards */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-56 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" /> Filter by Category
              </h3>
              {activeCategory && (
                <button 
                  onClick={() => handleCategoryChange(null)}
                  className="text-[10px] font-bold text-rose-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            
            <div className="space-y-1.5">
              <button 
                onClick={() => handleCategoryChange(null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activeCategory === null 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Schemes</span>
                <span className="text-[10px] opacity-80">{schemes.length}</span>
              </button>

              {CATEGORIES.map(cat => {
                const count = schemes.filter(s => s.category === cat).length
                const isActive = activeCategory === cat
                return (
                  <button 
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-80">{count}</span>
                  </button>
                )
              })}
            </div>

            {activeCategory && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <button 
                  onClick={() => handleCategoryChange(null)} 
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 py-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <FilterX className="w-3.5 h-3.5 text-slate-400" /> Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Scheme Cards */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs text-slate-400 font-medium">Fetching verified government schemes...</p>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No matching schemes found</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto mb-6">
                Try adjusting your search criteria or clearing your active category filter.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); handleCategoryChange(null) }} 
                className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSchemes.map((scheme) => (
                <div 
                  key={scheme.slug} 
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300 group flex flex-col md:flex-row gap-5 md:items-center"
                >
                  <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 relative">
                    <img 
                      src={getCategoryImg(scheme.category)} 
                      alt={scheme.category} 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1571260899304-4250708f069f?q=80&w=400&auto=format&fit=crop' }} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white">
                        {scheme.level || 'Central'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/40">
                        {scheme.category}
                      </span>
                      {scheme.state && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {scheme.state}
                        </span>
                      )}
                    </div>

                    <Link 
                      to="/scheme/$slug" 
                      params={{ slug: scheme.slug }} 
                      className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug mb-2 line-clamp-1 block"
                    >
                      {scheme.name}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {scheme.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                      <div className="flex items-center gap-1.5">
                         <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[11px] font-bold">₹</span>
                         <span className="text-slate-800">{scheme.benefit || 'Direct DBT Benefits'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 font-normal">
                         <Users className="w-3.5 h-3.5" />
                         <span className="truncate max-w-[200px]">{scheme.department || 'Government of India'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-row md:flex-col gap-2.5 mt-2 md:mt-0 w-full md:w-32">
                    <Link 
                      to="/scheme/$slug" 
                      params={{ slug: scheme.slug }} 
                      className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 text-center text-xs font-bold rounded-xl hover:bg-slate-100 transition"
                    >
                      View Details
                    </Link>
                    
                    {/* Direct External Official Application Link */}
                    <a 
                      href={scheme.application_url || scheme.source_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full py-2 rounded-xl text-xs font-bold transition shadow-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-center flex items-center justify-center gap-1"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <Link 
                      to="/compare" 
                      className="w-full py-1 text-center text-[10px] font-bold text-slate-500 hover:text-blue-600 transition"
                    >
                      Compare Scheme
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
