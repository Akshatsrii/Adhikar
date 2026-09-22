import { createFileRoute } from '@tanstack/react-router'
import { Search, Users, SlidersHorizontal } from 'lucide-react'

export const Route = createFileRoute('/schemes')({
  component: SchemesPage,
})

function SchemesPage() {
  const schemes = [
    { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop', tag: 'Education', title: 'Post-Matric Scholarship for SC/ST/OBC Students', desc: 'Financial assistance for higher education of SC/ST/OBC students.', amt: 'Up to ₹25,000 per year', tg: 'Eligible SC/ST/OBC Students' },
    { img: 'https://images.unsplash.com/photo-1592982537447-6f23342d2bf5?q=80&w=400&auto=format&fit=crop', tag: 'Agriculture', title: 'PM-KISAN Samman Nidhi', desc: 'Direct income support to small and marginal farmers.', amt: '₹6,000 per year', tg: 'Small and marginal farmers' },
    { img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop', tag: 'Housing', title: 'Pradhan Mantri Awas Yojana', desc: 'Financial assistance for construction of pucca houses.', amt: '₹1.5 - 2.5 Lakh', tg: 'Eligible rural/urban families' },
    { img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop', tag: 'Healthcare', title: 'Ayushman Bharat Yojana', desc: 'Health insurance coverage of up to ₹5 lakh per family per year.', amt: 'Up to ₹5 Lakh/year', tg: 'Economically weaker families' },
    { img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=400&auto=format&fit=crop', tag: 'Employment', title: 'PM Mudra Yojana', desc: 'Loans for small businesses and non-corporate non-farm enterprises.', amt: 'Up to ₹10 Lakh loan', tg: 'Small Business owners' },
    { img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=400&auto=format&fit=crop', tag: 'Women', title: 'Beti Bachao Beti Padhao', desc: 'Financial assistance and educational support for girl children.', amt: 'Educational support', tg: 'Girl children and women' },
  ]

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
                <label className="text-xs font-semibold text-gray-700 block mb-2">Search Schemes</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:border-[#00428a] focus:outline-none bg-gray-50 focus:bg-white" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Category</label>
                <div className="space-y-2">
                  {['Education', 'Housing', 'Employment', 'Agriculture', 'Women', 'Healthcare', 'Senior Citizens', 'Divyangjan', 'Other Schemes'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-[#00428a] focus:ring-[#00428a]" defaultChecked={cat === 'Education'} />
                      <span className="text-sm text-gray-600">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">State</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                  <option>All India</option>
                  <option>Rajasthan</option>
                  <option>Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">Scheme Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" className="text-[#00428a] focus:ring-[#00428a]" defaultChecked />
                    <span className="text-sm text-gray-600">Central Schemes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" className="text-[#00428a] focus:ring-[#00428a]" />
                    <span className="text-sm text-gray-600">State Schemes</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Scheme Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#00428a] mb-1">All Government Schemes</h2>
              <p className="text-sm text-gray-600">Explore and discover schemes available for you</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-semibold text-gray-700">324 Schemes Found</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort by:</span>
              <select className="border-none text-sm font-semibold text-[#00428a] focus:ring-0 cursor-pointer bg-transparent py-0 pl-1 pr-6">
                <option>Popularity</option>
                <option>Newest</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {schemes.map((s, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition group">
                <div className="h-36 relative bg-gray-100 overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className={`absolute bottom-2 left-2 px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1 ${s.tag === 'Education' ? 'bg-blue-600' : s.tag === 'Agriculture' ? 'bg-green-600' : s.tag === 'Housing' ? 'bg-red-500' : s.tag === 'Healthcare' ? 'bg-teal-500' : s.tag === 'Employment' ? 'bg-indigo-600' : 'bg-purple-500'}`}>
                    {s.tag}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 h-10 group-hover:text-[#00428a] transition">{s.title}</h4>
                  <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">{s.desc}</p>
                  
                  <div className="mt-auto space-y-2 mb-4 bg-gray-50 p-2 rounded border border-gray-100">
                    <div className="flex items-center text-[11px] text-gray-700 gap-2 font-medium">
                       <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px]">₹</span> 
                       {s.amt}
                    </div>
                    <div className="flex items-center text-[11px] text-gray-700 gap-2 font-medium">
                       <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[9px]"><Users className="w-2.5 h-2.5"/></span> 
                       {s.tg}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button className="border border-[#00428a] text-[#00428a] text-xs font-bold py-2 rounded hover:bg-blue-50 transition">View Details</button>
                    <button className="bg-[#00428a] text-white text-xs font-bold py-2 rounded hover:bg-blue-800 transition">Apply Now</button>
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
