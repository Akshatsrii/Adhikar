import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Clock, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/track')({
  component: TrackPage,
})

function TrackPage() {
  const apps = [
    { title: 'Post-Matric Scholarship', id: 'APP-2025-001234', date: '15 Jan 2025', status: 'Under Review' },
    { title: 'PM-KISAN Samman Nidhi', id: 'APP-2025-001278', date: '10 Jan 2025', status: 'Approved' },
    { title: 'Rajasthan Skill Development', id: 'APP-2024-009876', date: '05 Dec 2024', status: 'Under Review' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Track Your Application</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Track Your Application</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 px-2 scrollbar-hide">
          <button className="px-5 py-4 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a] whitespace-nowrap bg-blue-50/50">All Applications</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Under Review (2)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Approved (1)</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Rejected (0)</button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100 p-6 space-y-4">
          {apps.map((app, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border border-gray-100 rounded-lg hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded overflow-hidden shrink-0 bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{app.title}</h3>
                  <div className="flex gap-4 text-xs font-medium text-gray-500">
                    <span>ID: <span className="text-gray-900">{app.id}</span></span>
                    <span>Submitted: {app.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 md:w-[350px]">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  app.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {app.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {app.status}
                </div>
                <button className="px-5 py-2 rounded text-xs font-bold transition shadow-sm border border-[#00428a]/20 text-[#00428a] hover:bg-blue-50 w-32 text-center">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
