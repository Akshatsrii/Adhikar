import { getCategoryImg } from '@/lib/categoryImages'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Search, MapPin, Users, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/state-schemes')({
  component: StateSchemesPage,
})



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
        <Link to="/" className="text-[#FF5500] hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">State Schemes</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FF5500] mb-2">State-Specific Schemes</h1>
          <p className="text-sm text-gray-600">Find government initiatives tailored to your state</p>
        </div>
        
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search state schemes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#FF5500] text-sm" 
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* State Selector */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded border border-gray-200 shadow-sm p-4 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF5500]" /> Select State
            </h3>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {statesList.map(state => (
                <button
                  key={state}
                  onClick={() => setActiveState(state)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition ${
                    activeState === state 
                      ? 'bg-[#FFF2E8] text-[#FF5500]' 
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
              <Loader2 className="w-8 h-8 animate-spin text-[#FF5500]" />
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
              <MapPin className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No State Schemes Found</h3>
              <p className="text-gray-500 text-sm">We couldn't find any state-specific schemes matching your criteria in {activeState}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchemes.map((s, i) => (
                <div key={i} className="bg-white rounded-[26px] border border-[#EAE6DF] overflow-hidden shadow-xs hover:shadow-[0_16px_36px_rgba(255,85,0,0.08)] hover:border-[#FF5500]/50 transition-all duration-300 flex flex-col group card-lift">
                  <div className="h-44 w-full overflow-hidden relative bg-neutral-100">
                    <img 
                      src={getCategoryImg(s.category, s.name, s.slug)} 
                      alt={s.name} 
                      onError={(e) => { e.currentTarget.src = '/categories/default.jpg' }} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5500] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#FFD6BA] shadow-xs">
                        {s.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                        {s.state || 'State'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-black text-black leading-snug mb-2 line-clamp-2 text-base group-hover:text-[#FF5500] transition-colors">{s.name}</h3>
                    <p className="text-xs text-neutral-600 mb-4 line-clamp-2 leading-relaxed">{s.description}</p>
                    
                    <div className="mt-auto space-y-2 mb-5 pb-4 border-b border-[#EAE6DF]">
                      <div className="flex items-center text-xs text-neutral-800 gap-2 font-bold truncate">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF2E8] text-[11px] font-black text-[#FF5500] shrink-0">₹</span>
                        <span className="truncate">{s.benefit || 'Direct State Welfare Transfer'}</span>
                      </div>
                      <div className="flex items-center text-xs text-neutral-500 gap-2 font-medium truncate">
                        <Users className="w-3.5 h-3.5 text-[#FF5500] shrink-0"/>
                        <span className="truncate">{s.department || s.state}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2.5 mt-auto">
                      <Link to="/scheme/$slug" params={{ slug: s.slug }} className="border border-[#EAE6DF] text-center text-neutral-700 text-xs font-bold py-2.5 rounded-full hover:bg-[#FAF8F5] hover:border-neutral-300 transition">
                        Details
                      </Link>
                      <Link to="/apply/$slug" params={{ slug: s.slug }} className="bg-[#0B3B24] hover:bg-[#072718] text-center text-white text-xs font-bold py-2.5 rounded-full transition shadow-xs hover:scale-[1.02]">
                        Apply Now
                      </Link>
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
