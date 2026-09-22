import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/apply/$slug')({
  component: ApplyPage,
})

function ApplyPage() {
  const { slug } = Route.useParams()

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-white md:bg-transparent">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Apply Online</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Apply for Government Schemes</h1>
        <p className="text-sm text-gray-600">Complete your application with step-by-step guidance</p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 scrollbar-hide">
          
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400 shrink-0">
            <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs">1</span>
            <span>Select Scheme</span>
          </div>
          
          <div className="h-[1px] bg-gray-200 flex-1 mx-4 min-w-[30px]"></div>
          
          <div className="flex items-center gap-2 text-sm font-bold text-[#00428a] shrink-0">
            <span className="w-6 h-6 rounded-full bg-[#00428a] text-white flex items-center justify-center text-xs shadow-sm ring-4 ring-blue-50">2</span>
            <span>Fill Application</span>
          </div>
          
          <div className="h-[1px] bg-gray-200 flex-1 mx-4 min-w-[30px]"></div>
          
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400 shrink-0">
            <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs">3</span>
            <span>Upload Documents</span>
          </div>

          <div className="h-[1px] bg-gray-200 flex-1 mx-4 min-w-[30px]"></div>
          
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400 shrink-0">
            <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs">4</span>
            <span>Review & Submit</span>
          </div>
        </div>

        {/* Selected Scheme Card */}
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden flex gap-4">
          <div className="w-32 md:w-48 bg-gray-100 shrink-0">
            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop" alt="Scheme" className="w-full h-full object-cover" />
          </div>
          <div className="p-4 py-5 flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 text-lg mb-1">Post-Matric Scholarship for SC/ST/OBC Students</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded">Education</span>
              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">Central Scheme</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Financial assistance for higher education of SC/ST/OBC students.</p>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-700">
              <span className="flex items-center gap-1 text-[#00428a]">₹ Up to ₹25,000 per year</span>
              <span className="text-gray-400">|</span>
              <span className="flex items-center gap-1">⏱ Application Deadline: 30 Jun 2025</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Personal Information</h3>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Full Name (as per documents) <span className="text-red-500">*</span></label>
              <input type="text" defaultValue="Akshat Srivastava" className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
              <input type="date" defaultValue="1999-05-15" className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
              <div className="flex">
                <select className="border border-gray-300 border-r-0 rounded-l px-2 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none">
                  <option>+91</option>
                </select>
                <input type="tel" defaultValue="9876543210" placeholder="Enter mobile number" className="flex-1 border border-gray-300 rounded-r px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Email ID</label>
              <input type="email" placeholder="Enter email address" className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]" />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" defaultChecked className="text-[#00428a] focus:ring-[#00428a]" />
                <span className="text-sm text-gray-700 font-medium">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="text-[#00428a] focus:ring-[#00428a]" />
                <span className="text-sm text-gray-700 font-medium">Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" className="text-[#00428a] focus:ring-[#00428a]" />
                <span className="text-sm text-gray-700 font-medium">Other</span>
              </label>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
            <button type="button" className="text-gray-600 font-bold py-2 px-4 rounded hover:bg-gray-100 transition flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button type="button" className="bg-[#00428a] text-white font-bold py-2.5 px-6 rounded hover:bg-blue-800 transition flex items-center gap-2 text-sm shadow-sm">
              Save & Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
