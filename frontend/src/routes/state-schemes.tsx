import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Search, MapPin } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/state-schemes')({
  component: StateSchemesPage,
})

function StateSchemesPage() {
  const states = [
    'Rajasthan', 'Uttar Pradesh', 'Maharashtra', 'Madhya Pradesh', 
    'Bihar', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'All States'
  ]

  const schemes = [
    { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop', tag: 'Skill Development', title: 'Rajasthan Skill Development Scheme', desc: 'Skill training for youth.', amt: 'Skill Training', tg: 'Youth' },
    { img: 'https://images.unsplash.com/photo-1592982537447-6f23342d2bf5?q=80&w=400&auto=format&fit=crop', tag: 'Employment', title: 'Indira Gandhi Urban Employment Guarantee', desc: 'Employment opportunities in urban areas.', amt: 'Employment', tg: 'Urban poor' },
    { img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop', tag: 'Women', title: 'Rajasthan Bhamashah Yojana', desc: 'Financial assistance for women.', amt: 'Financial support', tg: 'Women' },
    { img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop', tag: 'Education', title: 'Rajasthan Anuprati Coaching Scheme', desc: 'Education, State Scheme.', amt: 'Coaching fees', tg: 'Students' },
    { img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=400&auto=format&fit=crop', tag: 'Agriculture', title: 'Mukhya Mantri Kisan Samman Nidhi', desc: 'Financial help for farmers.', amt: 'Financial aid', tg: 'Farmers' },
    { img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400&auto=format&fit=crop', tag: 'Healthcare', title: 'Chief Minister Chiranjeevi Swasthya Bima Yojana', desc: 'Financial assistance for treatment.', amt: 'Health Insurance', tg: 'All citizens' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">State Schemes</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar - State List */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">State Schemes</h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search state..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#00428a] focus:outline-none bg-gray-50 focus:bg-white" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-50">
                {states.map((state, i) => (
                  <li key={i}>
                    <button className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2 transition ${
                      i === 0 ? 'bg-blue-50 text-[#00428a] border-l-2 border-[#00428a]' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                      <MapPin className={`w-3.5 h-3.5 ${i === 0 ? 'text-[#00428a]' : 'text-gray-400'}`} />
                      {state}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Content - Scheme Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#00428a] mb-1">Rajasthan Government Schemes</h2>
              <p className="text-sm text-gray-600">Schemes and services for citizens of Rajasthan</p>
            </div>
            <button className="bg-[#00428a] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-800 transition shadow-sm">
              View Official Portal
            </button>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {schemes.map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition group">
                <div className="h-32 relative bg-gray-100 overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm bg-blue-600">
                    {s.tag}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 h-10 group-hover:text-[#00428a] transition">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">{s.desc}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-100">
                    <button className="border border-[#00428a] text-[#00428a] text-xs font-bold py-1.5 rounded hover:bg-blue-50 transition">View Details</button>
                    <button className="bg-[#00428a] text-white text-xs font-bold py-1.5 rounded hover:bg-blue-800 transition">Apply Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  )
}
