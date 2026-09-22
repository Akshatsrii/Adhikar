import { createFileRoute } from '@tanstack/react-router'
import { FileText, Megaphone, Laptop, Users } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="w-full bg-white flex-1 flex flex-col">
      {/* Top Banner section */}
      <div className="relative bg-[#e6f0fa] w-full pt-16 pb-12 overflow-hidden">
        {/* Background Image of Parliament / Rashtrapati Bhavan faded */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rashtrapati_Bhavan%2C_New_Delhi.jpg/1280px-Rashtrapati_Bhavan%2C_New_Delhi.jpg')] bg-cover bg-center">
           <div className="absolute inset-0 bg-gradient-to-r from-[#e6f0fa] via-[#e6f0fa]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl font-bold text-[#00428a] mb-2">About Adhikar</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Right. Our Mission.</h2>
          <p className="text-gray-600 max-w-2xl leading-relaxed text-sm">
            Adhikar is an AI-powered government scheme navigator that helps citizens easily find, understand and apply for government schemes, benefits and services available across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex-1 flex flex-col relative z-10">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-8 mb-8 gap-8 text-sm font-medium">
          <button className="text-[#00428a] border-b-2 border-[#00428a] pb-3 -mb-[2px]">Our Mission</button>
          <button className="text-gray-500 hover:text-gray-800 pb-3">Key Features</button>
          <button className="text-gray-500 hover:text-gray-800 pb-3">Our Impact</button>
          <button className="text-gray-500 hover:text-gray-800 pb-3">Partners</button>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
        
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Simplify Access</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Make government schemes easy to find and understand
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Megaphone className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Increase Awareness</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Reach every citizen with accurate information
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <Laptop className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Enable Applications</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Guide step-by-step application process
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Empower Citizens</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ensure no eligible beneficiary is left behind
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Banner */}
      <div className="mt-auto w-full border-t-4 border-b-4 border-t-orange-500 border-b-green-600 bg-white relative overflow-hidden py-10 flex justify-center items-center">
        {/* Ashoka Chakra faded background */}
        <div className="absolute right-[-5%] bottom-[-50%] opacity-5 w-[400px] h-[400px]">
           <svg viewBox="0 0 100 100" className="w-full h-full text-[#000080] animate-[spin_60s_linear_infinite]">
             <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
             <circle cx="50" cy="50" r="5" fill="currentColor"/>
             {Array.from({length: 24}).map((_, i) => (
               <line key={i} x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="1.5" transform={`rotate(${i * 15} 50 50)`} />
             ))}
           </svg>
        </div>
        
        <h3 className="text-[#00428a] text-2xl font-medium tracking-wide relative z-10 italic">
          "A more inclusive, informed and empowered India"
        </h3>
      </div>
    </div>
  )
}
