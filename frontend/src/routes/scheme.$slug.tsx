import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight, Share2, Printer, MapPin, Building2, Banknote, Users, CheckCircle2, Monitor, Calendar } from 'lucide-react'

export const Route = createFileRoute('/scheme/$slug')({
  component: SchemeDetailPage,
})

function SchemeDetailPage() {
  const { slug } = Route.useParams()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-[#f5f6fa]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/schemes" className="text-blue-600 hover:underline">Government Schemes</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Scheme Detail</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start border-b border-gray-200 relative">
           <div className="w-24 h-24 rounded overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
             <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop" alt="Scheme Logo" className="w-full h-full object-cover" />
           </div>
           <div className="flex-1">
             <h1 className="text-2xl font-bold text-gray-900 mb-3">Post-Matric Scholarship for SC/ST/OBC Students</h1>
             <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
               <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <MapPin className="w-3.5 h-3.5" /> Central Scheme
               </span>
               <span className="flex items-center gap-1.5 text-gray-600">
                  <Building2 className="w-3.5 h-3.5" /> Ministry of Education
               </span>
             </div>
           </div>
           
           <div className="absolute top-6 right-6 flex gap-2">
             <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
               <Share2 className="w-4 h-4" />
             </button>
             <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
               <Printer className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 px-6 scrollbar-hide">
          <button className="px-5 py-4 text-sm font-bold text-[#00428a] border-b-2 border-[#00428a] whitespace-nowrap bg-blue-50/30">Overview</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Eligibility</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Benefits</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Documents</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">Application Process</button>
          <button className="px-5 py-4 text-sm font-semibold text-gray-500 hover:text-gray-800 whitespace-nowrap">FAQs</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-8">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">About the Scheme</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Financial assistance is given to the ST/SC/OBC students for pursuing higher education. The objective of the scheme is to provide financial assistance to the ST/SC/OBC students studying at post matriculation or post-secondary stage to enable them to complete their education.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Highlights</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><Banknote className="w-5 h-5"/></div>
                  <div><p className="font-bold text-sm text-gray-900">Up to ₹25,000</p><p className="text-xs text-gray-500">per year</p></div>
                </div>
                <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Users className="w-5 h-5"/></div>
                  <div><p className="font-bold text-sm text-gray-900">SC/ST/OBC</p><p className="text-xs text-gray-500">students</p></div>
                </div>
                <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5"/></div>
                  <div><p className="font-bold text-sm text-gray-900">Annual family</p><p className="text-xs text-gray-500">income limit</p></div>
                </div>
                <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-lg flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"><Monitor className="w-5 h-5"/></div>
                  <div><p className="font-bold text-sm text-gray-900">Online</p><p className="text-xs text-gray-500">application</p></div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Important Dates</h3>
              <div className="flex gap-4">
                <div className="flex-1 border border-blue-100 bg-blue-50/50 p-4 rounded-lg flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600"/>
                  <div><p className="text-xs text-gray-500 font-medium">Application Start</p><p className="font-bold text-sm text-gray-900">01 July 2025</p></div>
                </div>
                <div className="flex-1 border border-green-100 bg-green-50/50 p-4 rounded-lg flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600"/>
                  <div><p className="text-xs text-gray-500 font-medium">Application End</p><p className="font-bold text-sm text-gray-900">30 June 2026</p></div>
                </div>
              </div>
            </section>
            
            <div className="pt-6 border-t border-gray-200 flex gap-4">
              <Link to={`/apply/${slug}`} className="flex-1 bg-[#00428a] text-white text-center font-bold py-3.5 rounded-lg hover:bg-blue-800 transition shadow-sm">
                Apply Now
              </Link>
              <button className="flex-1 border border-[#00428a] text-[#00428a] font-bold py-3.5 rounded-lg hover:bg-blue-50 transition">
                Download Guidelines
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
