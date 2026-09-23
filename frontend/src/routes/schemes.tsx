import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Search, Users, SlidersHorizontal, Loader2, FilterX } from 'lucide-react'
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

const CATEGORIES = ['Agriculture', 'Education', 'Healthcare', 'Housing', 'Employment', 'Women', 'Disability', 'Social Welfare'];

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

  // Sync state if URL changes
  useEffect(() => {
    if (search.category !== activeCategory) {
      setActiveCategory(search.category || null);
    }
  }, [search.category])

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    navigate({ search: { category: cat || undefined }, replace: true });
  }

  const filteredSchemes = schemes.filter(s => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (activeCategory && s.category !== activeCategory) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
              Filter Schemes <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 block">Category</label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                       type="radio" 
                       name="category"
                       className="w-4 h-4 text-[#00428a] focus:ring-[#00428a]" 
                       checked={activeCategory === null}
                       onChange={() => handleCategoryChange(null)}
                    />
                    <span className="text-sm text-gray-700 font-medium">All Categories</span>
                  </label>
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="radio" 
                         name="category"
                         className="w-4 h-4 text-[#00428a] focus:ring-[#00428a]"
                         checked={activeCategory === cat}
                         onChange={() => handleCategoryChange(cat)}
                      />
                      <span className="text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {activeCategory && (
                <button onClick={() => handleCategoryChange(null)} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-600 bg-red-50 py-2 rounded border border-red-100 hover:bg-red-100 transition">
                  <FilterX className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#00428a]">Government Schemes</h1>
              <p className="text-sm text-gray-500 mt-1">Found {filteredSchemes.length} matching schemes</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search schemes..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#00428a]" />
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No schemes found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">We couldn't find any schemes matching your current filters. Try adjusting your search criteria or clearing filters.</p>
              <button onClick={() => {setSearchQuery(''); handleCategoryChange(null);}} className="mt-6 px-4 py-2 bg-[#00428a] text-white text-sm font-bold rounded hover:bg-blue-800 transition">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSchemes.map((scheme) => (
                <div key={scheme.slug} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition group flex flex-col md:flex-row gap-5 md:items-center">
                  <div className="w-full md:w-48 h-32 rounded overflow-hidden shrink-0 bg-gray-100">
                    <img src={getCategoryImg(scheme.category)} alt={scheme.category} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{scheme.category}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{scheme.level}</span>
                    </div>
                    <Link to="/scheme/$slug" params={{ slug: scheme.slug }} className="text-lg font-bold text-gray-900 hover:text-[#00428a] transition leading-tight mb-2 line-clamp-1 block">
                      {scheme.name}
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {scheme.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
                      <div className="flex items-center gap-1.5">
                         <span className="text-[#00428a] font-bold">₹</span> {scheme.benefit || 'Variable Support'}
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Users className="w-3.5 h-3.5 text-gray-400" /> {scheme.department || 'Govt. of India'}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2 mt-4 md:mt-0 w-full md:w-32">
                    <Link to="/scheme/$slug" params={{ slug: scheme.slug }} className="w-full py-2 bg-white border-2 border-[#00428a] text-[#00428a] text-center text-xs font-bold rounded hover:bg-blue-50 transition">
                      View Details
                    </Link>
                    <a href={scheme.source_url || '#'} target="_blank" rel="noopener noreferrer" className="w-full py-2 bg-[#00428a] text-white text-center text-xs font-bold rounded hover:bg-blue-800 transition">
                      Apply Now
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
