import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, Megaphone, Laptop, Users, Bot, Search, FileSignature, Globe2, TrendingUp, Handshake, ShieldCheck, HeartHandshake } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission')
  const { t } = useTranslation()

  const tabs = [
    { id: 'mission', label: 'Our Mission' },
    { id: 'features', label: 'What Adhikar Does' },
    { id: 'impact', label: 'Our Impact' },
    { id: 'partners', label: 'Partners' }
  ]

  return (
    <div className="w-full bg-[#f5f6fa] flex-1 flex flex-col font-sans">
      {/* Top Banner section */}
      <div className="relative bg-[#e6f0fa] w-full pt-16 pb-12 overflow-hidden shadow-sm">
        {/* Background Image of Parliament / Rashtrapati Bhavan faded */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rashtrapati_Bhavan%2C_New_Delhi.jpg/1280px-Rashtrapati_Bhavan%2C_New_Delhi.jpg')] bg-cover bg-center">
           <div className="absolute inset-0 bg-gradient-to-r from-[#e6f0fa] via-[#e6f0fa]/95 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-extrabold text-[#00428a] mb-3 tracking-tight">About Adhikar</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-5">Your Right. Our Mission.</h2>
          <p className="text-gray-700 max-w-3xl leading-relaxed text-sm bg-white/60 backdrop-blur-md p-4 rounded-lg border border-white shadow-sm font-medium">
            Adhikar is a centralized, AI-powered government scheme navigator designed to bridge the gap between Indian citizens and government welfare programs. We leverage Artificial Intelligence to help you seamlessly find, understand, and apply for government schemes, benefits, and services that you rightfully deserve.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex-1 flex flex-col relative z-10 -mt-6 mb-16">
        
        {/* Premium Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex overflow-x-auto scrollbar-hide mb-8">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] py-3 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#00428a] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[400px]">
          
          {/* TAB 1: OUR MISSION */}
          {activeTab === 'mission' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Empowering Citizens Through Technology</h3>
              <p className="text-gray-600 mb-8 max-w-4xl leading-relaxed">
                Millions of eligible citizens miss out on government welfare schemes due to lack of awareness, complex eligibility criteria, and tedious application processes. Our mission at Adhikar is to eliminate these barriers. We believe that accessing government benefits shouldn't be a privilege of the informed, but a fundamental right easily accessible to everyone.
              </p>
              
              <div className="grid md:grid-cols-4 gap-6">
                <Link to="/schemes" className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition group block cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Simplify Access</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Make discovering and understanding government schemes effortless for every citizen, regardless of digital literacy.
                  </p>
                </Link>
                <Link to="/notifications" className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition group block cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Megaphone className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Increase Awareness</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Proactively notify citizens about new schemes and deadlines they are eligible for.
                  </p>
                </Link>
                <Link to="/eligibility" className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition group block cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Laptop className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Enable Applications</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Provide step-by-step guidance, document preparation, and direct portal linking for applications.
                  </p>
                </Link>
                <Link to="/assistant" className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition group block cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Empower Citizens</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Ensure absolutely no eligible beneficiary is left behind in India's growth story.
                  </p>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: WHAT ADHIKAR DOES */}
          {activeTab === 'features' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How Adhikar Works for You</h3>
              <p className="text-gray-600 mb-8 max-w-4xl leading-relaxed">
                Adhikar acts as your personal digital assistant for navigating the complex web of Central and State government schemes. Using cutting-edge Generative AI and strict government data structures, we do the heavy lifting so you don't have to.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-[#00428a]">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">1. AI Eligibility Matchmaking</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">By analyzing your basic profile (age, caste, income, state, occupation), our smart algorithm instantly scans 1000+ schemes and filters out exactly what you are eligible for, saving you hours of manual research.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 text-green-700">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">2. Conversational AI Assistant</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Got a doubt about a scheme? Talk to our AI assistant in plain English or Hindi. It reads official government guidelines using RAG (Retrieval-Augmented Generation) and provides accurate, verified answers instantly.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-[#FF9933]">
                    <FileSignature className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">3. Document Assistance</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">Adhikar tells you exactly which documents are needed before you apply. It even helps you track missing documents like Income Certificates or Caste Certificates and guides you on how to get them.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-700">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2">4. Multi-lingual Support</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">The entire platform is designed to be accessible. Switch between Hindi and English instantly, ensuring language is never a barrier in claiming your rights.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OUR IMPACT */}
          {activeTab === 'impact' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Measuring What Matters</h3>
              <p className="text-gray-600 mb-8 max-w-4xl leading-relaxed">
                Since our inception, we have been rigorously focused on bridging the gap between policy making and policy delivery. Here is a snapshot of our simulated impact and goals.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-900 to-[#00428a] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
                  <div className="text-4xl font-black mb-2">1.2M+</div>
                  <div className="text-sm font-medium text-blue-100">Citizens Profiled & Matched</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
                  <div className="text-4xl font-black mb-2">1,500+</div>
                  <div className="text-sm font-medium text-green-100">Verified Govt Schemes Indexed</div>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <HeartHandshake className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
                  <div className="text-4xl font-black mb-2">₹500Cr+</div>
                  <div className="text-sm font-medium text-orange-100">Estimated Benefits Unlocked</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                <p className="font-semibold text-blue-800 italic">"Our goal for 2026 is to reach the last mile — connecting rural households with digital kiosks and CSCs through the Adhikar network."</p>
              </div>
            </div>
          )}

          {/* TAB 4: PARTNERS */}
          {activeTab === 'partners' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ecosystem & Partners</h3>
              <p className="text-gray-600 mb-8 max-w-4xl leading-relaxed">
                Adhikar operates by aggregating data from official government portals and collaborating with local administration centers to ensure the data is accurate and verifiable.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="border border-gray-200 rounded-xl p-6 flex items-center justify-center bg-gray-50 hover:bg-white hover:shadow-md transition">
                  <img src="/images/digital-india.svg" alt="Digital India" className="h-12 opacity-80" />
                </div>
                <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:shadow-md transition">
                  <Handshake className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-bold text-gray-600">Common Service Centers (CSCs)</span>
                </div>
                <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center mb-2">
                    <span className="font-bold text-gray-500">MyGov</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">MyGov API Integration</span>
                </div>
                <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:shadow-md transition">
                  <Globe2 className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-bold text-gray-600">State Govt Portals</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Footer Banner */}
      <div className="mt-auto w-full border-t-4 border-b-4 border-t-orange-500 border-b-green-600 bg-white relative overflow-hidden py-12 flex justify-center items-center shadow-inner">
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
        
        <h3 className="text-[#00428a] text-2xl font-bold tracking-wide relative z-10 italic">
          "A more inclusive, informed and empowered India"
        </h3>
      </div>
    </div>
  )
}
