import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/eligibility-results')({
  component: EligibilityResultsPage,
})

function EligibilityResultsPage() {
  const results = [
    { title: 'Post-Matric Scholarship', tag: 'Eligible', match: 95, action: 'Apply Now' },
    { title: 'PM-KISAN Samman Nidhi', tag: 'Needs More Info', match: 70, action: 'Update Check' },
    { title: 'Pradhan Mantri Awas Yojana', tag: 'Not Eligible', match: 40, action: 'View Details' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/eligibility" className="text-blue-600 hover:underline">Check Eligibility</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Results</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Your Eligibility Results</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 px-2 scrollbar-hide">
          <button className="px-5 py-4 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a] whitespace-nowrap bg-blue-50/50">Eligible (8)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Needs More Info (12)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Not Eligible (15)</button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100 p-6 space-y-4">
          {results.map((res, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{res.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${res.match > 80 ? 'bg-green-500' : res.match > 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${res.match}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">Match: {res.match}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 md:w-[350px]">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  res.tag === 'Eligible' ? 'bg-green-50 text-green-700 border-green-200' : res.tag === 'Needs More Info' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {res.tag === 'Eligible' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {res.tag}
                </div>
                <button className={`px-5 py-2 rounded text-xs font-bold transition shadow-sm w-32 ${
                  res.tag === 'Eligible' ? 'bg-[#00428a] text-white hover:bg-blue-800' : 'border border-[#00428a]/20 text-[#00428a] hover:bg-blue-50'
                }`}>
                  {res.action}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
