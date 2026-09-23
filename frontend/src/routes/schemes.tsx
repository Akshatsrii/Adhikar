import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Users, SlidersHorizontal, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { schemesApi, PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/schemes')({
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

function SchemesPage() {
  const [schemes, setSchemes] = useState<PublicScheme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    schemesApi.list().then(res => {
      setSchemes(res.items)
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
              Filter Schemes <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 block">Category</label>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#00428a] focus:ring-[#00428a]" defaultChecked />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {['Agriculture', 'Education', 'Health & Wellness', 'Housing & Shelter', 'Employment'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#00428a] focus:ring-[#00428a]" />
                      <span className="text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area - Main Search & List */}
        <div className="flex-1">
          
          <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6 shadow-sm flex items-center">
            <div className="pl-3 pr-2 text-gray-400"><Search className="w-5 h-5"/></div>
            <input type="text" placeholder="Search by scheme name, state, or ministry..." className="flex-1 py-2 px-2 border-none focus:outline-none focus:ring-0 text-sm" />
            <button className="bg-[#00428a] text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-800 transition">Search</button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{schemes.length} Schemes Available</h2>
            <select className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-white focus:outline-none">
              <option>Sort by: Popularity</option>
              <option>Sort by: Recently Added</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-[#00428a]">
               <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {schemes.map((scheme, i) => (
                <Link to={`/scheme/${scheme.slug}`} key={i} className="flex flex-col md:flex-row bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition duration-300 group block">
                  <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden">
                    <img src={getCategoryImg(scheme.category)} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#00428a] text-xs font-bold px-2.5 py-1 rounded">
                      {scheme.category}
                    </div>
                  </div>
                  
                  <div className="p-5 md:p-6 flex flex-col justify-center flex-1">
                    <h3 className="text-lg font-bold text-[#00428a] mb-2 group-hover:text-blue-600 transition">{scheme.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {scheme.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-auto">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Benefit</p>
                        <p className="text-sm font-semibold text-gray-900">{scheme.benefit}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-0.5">Level</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-500" /> {scheme.level} {scheme.state ? `(${scheme.state})` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
