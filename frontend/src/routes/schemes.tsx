import { getCategoryImg } from '@/lib/categoryImages'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Search, SlidersHorizontal, ExternalLink, Zap, FilterX, Loader2, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { SignInGate } from '@/components/SignInGate'

type SchemesSearch = { category?: string }

export const Route = createFileRoute('/schemes')({
  validateSearch: (search: Record<string, unknown>): SchemesSearch => {
    return { category: search.category as string | undefined }
  },
  component: SchemesPage,
})



const CATEGORIES = ['Agriculture', 'Education', 'Healthcare', 'Housing', 'Employment', 'Women', 'Disability', 'Social Welfare']

function SchemesPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  
  const { user, isLoading: authLoading } = useAuth()
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
    if (!user) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    schemesApi.list(0, 200).then(res => {
      setSchemes(res.items)
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [user])

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
    Agriculture: 'bg-[#FF5500]', Employment: 'bg-[#FF7729]', Housing: 'bg-[#F59E0B]',
    Healthcare: 'bg-[#FF5500]', Education: 'bg-[#EA580C]', 'Social Welfare': 'bg-black',
    Women: 'bg-[#C2410C]', Disability: 'bg-neutral-800',
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5500]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <SignInGate />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black font-sans">

      {/* Header & filters */}
      <div className="bg-white border-b border-[#EAE6DF] py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF5500] mb-3 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Official Government Catalog</span>
            <span>·</span>
            <span className="text-neutral-500 font-normal">Direct Portals Only</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-2">Government Schemes</h1>
              <p className="text-[#52525B] text-sm max-w-xl">
                {isLoading ? 'Loading verified schemes...' : `${filteredSchemes.length} of ${schemes.length} schemes`} · Updated from official gazette portals
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search schemes or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#EAE6DF] text-black placeholder:text-neutral-400 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/10 transition font-medium"
              />
            </div>
          </div>

          {/* Category pill filters */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-[#EAE6DF]">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${
                activeCategory === null
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-neutral-700 border-[#EAE6DF] hover:bg-neutral-50'
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
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-neutral-700 border-[#EAE6DF] hover:bg-neutral-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${catDots[cat] || 'bg-[#FF5500]'}`} />
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
          <div className="bg-white rounded-2xl border border-[#EAE6DF] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DF] mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5500]" /> Filter by Category
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
                className={`w-full text-left px-3 py-2 rounded-full text-xs font-bold transition flex items-center justify-between ${
                  activeCategory === null 
                    ? 'bg-black text-white shadow-xs' 
                    : 'text-[#52525B] hover:bg-[#FAF8F5] text-black'
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
                    className={`w-full text-left px-3 py-2 rounded-full text-xs font-bold transition flex items-center justify-between ${
                      isActive 
                        ? 'bg-black text-white shadow-xs' 
                        : 'text-[#52525B] hover:bg-[#FAF8F5] text-black'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-80">{count}</span>
                  </button>
                )
              })}
            </div>

            {activeCategory && (
              <div className="pt-4 mt-4 border-t border-[#EAE6DF]">
                <button 
                  onClick={() => handleCategoryChange(null)} 
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#52525B] bg-[#FAF8F5] text-black py-2 rounded-full hover:bg-[#FAF8F5] transition"
                >
                  <FilterX className="w-3.5 h-3.5 text-neutral-400" /> Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Scheme Cards */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF5500]" />
              <p className="text-xs text-neutral-400 font-medium">Fetching verified government schemes...</p>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE6DF] p-12 text-center shadow-xs">
              <div className="w-14 h-14 bg-[#FAF8F5] rounded-2xl flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-black mb-1">No matching schemes found</h3>
              <p className="text-[#52525B] text-xs max-w-sm mx-auto mb-6">
                Try adjusting your search criteria or clearing your active category filter.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); handleCategoryChange(null) }} 
                className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-neutral-800 transition shadow-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSchemes.map((scheme) => (
                <div 
                  key={scheme.slug} 
                  className="bg-white rounded-3xl border border-[#EAE6DF] p-6 sm:p-7 shadow-xs card-lift hover:border-[#FF5500]/50 hover:shadow-[0_16px_36px_rgba(255,85,0,0.06)] transition-all duration-300 group flex flex-col md:flex-row gap-6 md:items-center relative overflow-hidden"
                >
                  <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden shrink-0 bg-neutral-100 border border-[#EAE6DF] relative">
                    <img 
                      src={getCategoryImg(scheme.category, scheme.name, scheme.slug)} 
                      alt={scheme.name} 
                      onError={(e) => { e.currentTarget.src = '/categories/default.jpg' }} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/10 shadow-xs">
                        {scheme.level || 'Central'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5500] bg-[#FFF2E8] px-3 py-1 rounded-full border border-[#FFD6BA]">
                        {scheme.category}
                      </span>
                      {scheme.state && (
                        <span className="text-[10px] font-bold text-neutral-600 bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EAE6DF]">
                          {scheme.state}
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        Official Gazette
                      </span>
                    </div>

                    <Link 
                      to="/scheme/$slug" 
                      params={{ slug: scheme.slug }} 
                      className="text-base sm:text-lg font-black text-black group-hover:text-[#FF5500] transition-colors leading-snug mb-2 line-clamp-1 block"
                    >
                      {scheme.name}
                    </Link>

                    <p className="text-xs sm:text-sm text-[#52525B] line-clamp-2 mb-4 leading-relaxed font-normal">
                      {scheme.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-700">
                      <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#EAE6DF]">
                         <span className="w-4 h-4 rounded-full bg-[#FFF2E8] text-[#FF5500] flex items-center justify-center text-[10px] font-black">₹</span>
                         <span className="text-black font-bold">{scheme.benefit || 'Direct DBT Benefits'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                         <Users className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                         <span className="truncate max-w-[220px]">{scheme.department || 'Government of India'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-row md:flex-col gap-2.5 mt-2 md:mt-0 w-full md:w-36">
                    <Link 
                      to="/scheme/$slug" 
                      params={{ slug: scheme.slug }} 
                      className="w-full py-2.5 bg-[#FAF8F5] text-black border border-[#EAE6DF] text-center text-xs font-bold rounded-full hover:bg-neutral-100 hover:border-neutral-300 transition"
                    >
                      View Details
                    </Link>
                    
                    {/* Direct External Official Application Link */}
                    <a 
                      href={scheme.application_url || scheme.source_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full py-2.5 rounded-full text-xs font-bold transition shadow-xs bg-black text-white hover:bg-neutral-800 text-center flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <Link 
                      to="/compare" 
                      className="w-full py-1 text-center text-[10px] font-bold text-neutral-400 hover:text-black transition"
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
