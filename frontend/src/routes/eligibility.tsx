import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { statesAndDistricts } from '@/lib/statesDistricts'

export const Route = createFileRoute('/eligibility')({
  component: EligibilityPage,
})

function EligibilityPage() {
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const states = Object.keys(statesAndDistricts)
  const districts = selectedState ? statesAndDistricts[selectedState] : []
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full bg-white md:bg-transparent">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800">Check Eligibility</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#00428a] mb-2">Check Your Eligibility</h1>
        <p className="text-sm text-gray-600">Find schemes you may qualify for based on your profile</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Form */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Tell us about yourself</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedDistrict('')
                  }}
                >
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">District</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                >
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]">
                  <option>Select Category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC/ST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input type="number" placeholder="Enter your age" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]">
                  <option>Select Occupation</option>
                  <option>Student</option>
                  <option>Farmer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income (₹)</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a] focus:ring-1 focus:ring-[#00428a]">
                  <option>Select Income Range</option>
                  <option>Below 1 Lakh</option>
                  <option>1 - 2.5 Lakhs</option>
                  <option>Above 5 Lakhs</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button type="button" className="w-full bg-[#00428a] text-white font-bold py-3.5 rounded-md hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-md">
                Check My Eligibility <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - How it works */}
        <div className="w-full lg:w-[350px] shrink-0 pt-4 lg:pt-0">
          <h3 className="text-lg font-bold text-gray-900 mb-6">How it works?</h3>
          
          <div className="relative border-l-2 border-blue-100 pl-8 space-y-10 py-2 ml-4">
            
            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
                1
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Fill in your basic details</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Provide information about your profile</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
                2
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Our system matches schemes</h4>
              <p className="text-xs text-gray-500 leading-relaxed">We check eligibility criteria for all relevant schemes</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow ring-4 ring-white">
                3
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Get personalized results</h4>
              <p className="text-xs text-gray-500 leading-relaxed">View schemes you qualify for with detailed information</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
