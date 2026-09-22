import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle2, ChevronRight, FileText, Search, UploadCloud, FileEdit, Bell, FileSignature, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'Citizen'

  const recentSchemes = [
    { title: 'Post-Matric Scholarship for SC/ST/OBC', tag: 'Education', status: 'Eligible', action: 'Apply Now' },
    { title: 'PM-KISAN Samman Nidhi', tag: 'Agriculture', status: 'Needs More Info', action: 'View Details' },
    { title: 'Pradhan Mantri Awas Yojana (Gramin)', tag: 'Housing', status: 'Eligible', action: 'Apply Now' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#00428a] flex items-center gap-2">
          <span className="text-xl">👋</span> Welcome, {firstName}
        </h1>
        <p className="text-sm text-gray-500">Your personalized scheme dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Profile Completion */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold text-gray-900 mb-6">Profile Completion</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#00428a]" strokeWidth="3" strokeDasharray="80, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-lg font-bold text-[#00428a]">80%</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-3">Complete your profile to get more accurate scheme recommendations.</p>
              <button className="text-[#00428a] font-bold text-xs border border-[#00428a] rounded px-4 py-1.5 hover:bg-blue-50 transition">
                Complete Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Link to="/eligibility" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition group">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 text-center">Check Eligibility</span>
            </Link>

            <Link to="/schemes" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition group">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <FileEdit className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 text-center">Apply Online</span>
            </Link>

            <Link to="/assistant" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition group">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              </div>
              <span className="text-[11px] font-bold text-gray-700 text-center">Ask Adhikar AI</span>
            </Link>

            <Link to="/documents" className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition group">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 text-center">Upload Documents</span>
            </Link>

          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-0.5">Eligible Schemes</p>
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-0.5">Needs More Info</p>
            <h3 className="text-2xl font-bold text-gray-900">5</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-0.5">Applications</p>
            <h3 className="text-2xl font-bold text-gray-900">3</h3>
          </div>
        </div>
      </div>

      {/* Recent Schemes For You */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Recent Schemes for You</h3>
          <Link to="/eligibility" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3"/></Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentSchemes.map((scheme, idx) => (
            <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/30 transition">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-10 h-10 rounded shrink-0 flex items-center justify-center text-white font-bold text-xs ${
                  scheme.tag === 'Education' ? 'bg-blue-600' : scheme.tag === 'Agriculture' ? 'bg-green-600' : 'bg-red-500'
                }`}>
                  {scheme.tag[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{scheme.title}</h4>
                  <p className="text-[11px] font-medium text-gray-500">{scheme.tag}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 md:w-[400px]">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  scheme.status === 'Eligible' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  {scheme.status === 'Eligible' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  {scheme.status}
                </div>
                
                <button className={`px-5 py-2 rounded text-xs font-bold transition shadow-sm ${
                  scheme.status === 'Eligible' ? 'bg-[#00428a] text-white hover:bg-blue-800' : 'border border-[#00428a]/20 text-[#00428a] hover:bg-blue-50'
                }`}>
                  {scheme.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
