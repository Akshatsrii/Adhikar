import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Search, Users, SlidersHorizontal, Loader2, FilterX, ExternalLink } from 'lucide-react'
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
  const [activeCategory, setActiveCategory] = useState<string | null>(search.category || null)

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
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (activeCategory && s.category !== activeCategory) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      
      {/* Top Banner Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Verified Schemes Catalog
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Direct Portals</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Government Entitlements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredSchemes.length} verified national & state welfare initiatives
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by scheme name or keyword..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-white shadow-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-64 shrink-0">
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
                      className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-700 text-center text-xs font-bold rounded-xl hover:bg-slate-100 transition"
                    >
                      View Details
                    </Link>
                    
                    {/* Direct External Official Application Link */}
                    <a 
                      href={scheme.application_url || scheme.source_url || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full py-2.5 rounded-xl text-xs font-bold transition shadow-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-center flex items-center justify-center gap-1"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
