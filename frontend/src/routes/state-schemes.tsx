import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Search, MapPin, Users, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { schemesApi, PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/state-schemes')({
  component: StateSchemesPage,
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

const statesList = [
  'All States', 'Rajasthan', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 
  'Bihar', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'West Bengal'
]

function StateSchemesPage() {
  const [activeState, setActiveState] = useState('Rajasthan')
  const [search, setSearch] = useState('')
  const [schemes, setSchemes] = useState<PublicScheme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    schemesApi.list(0, 200).then(res => {
      setSchemes(res.items.filter(s => s.level === 'State'))
    }).catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const filteredSchemes = schemes.filter(s => {
    if (activeState !== 'All States' && s.state !== activeState) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">State Schemes</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#00428a] mb-2">State-Specific Schemes</h1>
          <p className="text-sm text-gray-600">Find government initiatives tailored to your state</p>
        </div>
        
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search state schemes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#00428a] text-sm" 
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* State Selector */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" /> Select State
            </h3>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {statesList.map(state => (
                <button
                  key={state}
                  onClick={() => setActiveState(state)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition ${
                    activeState === state 
                      ? 'bg-blue-50 text-[#00428a]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#00428a]" />
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
              <MapPin className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No State Schemes Found</h3>
              <p className="text-gray-500 text-sm">We couldn't find any state-specific schemes matching your criteria in {activeState}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSchemes.map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                  <div className="h-40 w-full overflow-hidden relative">
                    <img src={getCategoryImg(s.category)} alt={s.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-[#00428a] uppercase tracking-wider shadow-sm">
                      {s.category}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">{s.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-3">{s.description}</p>
                    
                    <div className="mt-auto space-y-2 mb-5">
                      <div className="flex items-center text-xs text-gray-600 gap-2 font-medium">
                        <span className="text-[#00428a] font-bold">₹</span> {s.benefit || 'Variable Support'}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 gap-2 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#00428a]"/> {s.department || s.state}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-100">
                      <Link to="/scheme/$slug" params={{ slug: s.slug }} className="border border-gray-300 text-center text-gray-700 text-xs font-bold py-2 rounded hover:bg-gray-50 transition">Details</Link>
                      <a href={s.source_url || '#'} target="_blank" rel="noopener noreferrer" className="bg-[#00428a] text-center text-white text-xs font-bold py-2 rounded hover:bg-blue-800 transition">Apply Now</a>
                    </div>
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
