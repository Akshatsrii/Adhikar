import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import { Search, ChevronDown, Bot, ArrowRight, FileText, CheckCircle2, User, Phone, Home, Building2, Briefcase, Leaf, Users, HeartPulse, Accessibility, MoreHorizontal, Megaphone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { schemesApi } from '@/lib/api'
import type { PublicScheme } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth()
  const { t } = useTranslation()
  const [featuredSchemes, setFeaturedSchemes] = useState<PublicScheme[]>([])
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  
  useEffect(() => {
    // Fetch all to get accurate counts and top 4 for featured
    schemesApi.list(0, 100).then(res => {
      const counts: Record<string, number> = {};
      res.items.forEach(s => {
        counts[s.category] = (counts[s.category] || 0) + 1;
      });
      setCategoryCounts(counts);
      setFeaturedSchemes(res.items.slice(0, 4));
    }).catch(console.error);
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const baseCategories = [
    { icon: <Leaf className="w-6 h-6 text-green-600" />, title: 'Agriculture', color: 'bg-green-50 border-green-200' },
    { icon: <Briefcase className="w-6 h-6 text-blue-600" />, title: 'Employment', color: 'bg-blue-50 border-blue-200' },
    { icon: <Home className="w-6 h-6 text-amber-600" />, title: 'Housing', color: 'bg-amber-50 border-amber-200' },
    { icon: <Accessibility className="w-6 h-6 text-purple-600" />, title: 'Disability', color: 'bg-purple-50 border-purple-200' },
    { icon: <Users className="w-6 h-6 text-pink-600" />, title: 'Women', color: 'bg-pink-50 border-pink-200' },
    { icon: <HeartPulse className="w-6 h-6 text-red-600" />, title: 'Healthcare', color: 'bg-red-50 border-red-200' },
    { icon: <Building2 className="w-6 h-6 text-indigo-600" />, title: 'Education', color: 'bg-indigo-50 border-indigo-200' },
    { icon: <MoreHorizontal className="w-6 h-6 text-gray-600" />, title: 'Social Welfare', color: 'bg-gray-50 border-gray-200' },
  ]

  const categoryCards = baseCategories.map(cat => ({
    ...cat,
    count: `${categoryCounts[cat.title] || 0} Schemes`
  }))

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans text-gray-800">
      
      {/* HERO SECTION */}
      <div className="relative bg-[#e6f0fa] w-full h-[450px] overflow-hidden flex items-center">
        <div className="absolute right-0 top-0 w-3/4 h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rashtrapati_Bhavan%2C_New_Delhi.jpg/1280px-Rashtrapati_Bhavan%2C_New_Delhi.jpg')] bg-cover bg-center">
           <div className="absolute inset-0 bg-gradient-to-r from-[#e6f0fa] via-[#e6f0fa]/90 to-transparent"></div>
           <svg className="absolute right-0 top-0 h-full w-[400px] opacity-90 hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M100,0 C60,20 40,80 0,100 L100,100 Z" fill="#138808" opacity="0.6"/>
             <path d="M100,0 C70,20 50,80 15,100 L100,100 Z" fill="#FFFFFF" opacity="0.6"/>
             <path d="M100,0 C80,20 60,80 30,100 L100,100 Z" fill="#FF9933" opacity="0.6"/>
           </svg>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-[2.2rem] font-bold text-[#00428a] leading-[1.1] mb-4">
              {t('hero.title1')}<br/>{t('hero.title2')}
            </h2>
            <p className="text-gray-700 mb-8 max-w-[500px] leading-snug font-medium">
              {t('hero.desc')}
            </p>
            
            {/* Search Bar in Hero */}
            <div className="bg-white p-2 rounded-lg shadow-lg flex gap-2 max-w-lg border border-gray-100 relative z-20">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder={t('hero.search_placeholder')} className="w-full pl-10 pr-4 py-3 border-none focus:outline-none text-sm text-gray-800" />
              </div>
              <button onClick={() => navigate({ to: '/schemes' })} className="bg-[#00428a] text-white px-6 py-2 rounded hover:bg-blue-800 transition font-bold text-sm">
                 {t('hero.search_btn')}
              </button>
            </div>
          </div>
          
          <div className="absolute top-4 right-8 text-right hidden lg:block bg-white/70 backdrop-blur px-3 py-2 rounded shadow-sm border border-white">
            <div className="text-xs font-semibold text-gray-800">"Empowered Citizens</div>
            <div className="text-xs font-semibold text-gray-800">Prosperous India"</div>
          </div>
        </div>
      </div>

      <div className="bg-[#00428a] w-full py-2 overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center gap-4 text-xs font-semibold text-white">
          <span className="bg-red-600 px-2 py-0.5 rounded flex items-center gap-1 shrink-0 uppercase tracking-wider text-[10px]"><Megaphone className="w-3 h-3"/> {t('hero.updates')}</span>
          <div className="whitespace-nowrap flex-1 overflow-hidden">
            <div className="inline-block animate-[marquee_20s_linear_infinite] pl-[100%]">
              New schemes for students announced. Direct benefit transfers initiated for PM-KISAN. Scholarships portal open till 30th November.
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        
        <div className="space-y-8">
          
          {/* Categories Grid */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-5">Browse by Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryCards.map((cat, i) => (
                <Link key={i} to="/schemes" search={{ category: cat.title }} className={`p-4 rounded border ${cat.color} flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 hover:shadow-md transition cursor-pointer group`}>
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-[13px]">{cat.title}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Schemes */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">Featured Schemes</h3>
              <Link to="/schemes" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4"/></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredSchemes.length === 0 ? (
                 <div className="col-span-2 text-center text-gray-500 py-10">Loading schemes...</div>
              ) : (
                featuredSchemes.map((s, i) => (
                  <div key={i} className="border border-gray-200 rounded flex flex-col overflow-hidden hover:border-[#00428a] hover:shadow-md transition">
                    <div className="h-1.5 w-full bg-[#00428a]"></div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 h-10">{s.name}</h4>
                      <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">{s.description}</p>
                      <div className="mt-auto space-y-2 mb-4">
                        <div className="flex items-center text-[11px] text-gray-600 gap-1"><span className="text-[#00428a]">₹</span> {s.benefit || 'Variable Support'}</div>
                        <div className="flex items-center text-[11px] text-gray-600 gap-1"><Users className="w-3 h-3 text-[#00428a]"/> {s.category}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Link to="/scheme/$slug" params={{ slug: s.slug }} className="border border-gray-300 text-center text-gray-700 text-xs font-semibold py-1.5 rounded hover:bg-gray-50 transition">View Details</Link>
                        <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="bg-[#00428a] text-center text-white text-xs font-semibold py-1.5 rounded hover:bg-blue-800 transition">Apply Now</a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* How Adhikar Works */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-5">How Adhikar Works</h3>
            <div className="flex items-center justify-between gap-2">
               {[
                 { num: 1, title: 'Create Profile', desc: 'Tell us a few details about yourself', color: 'bg-blue-600' },
                 { num: 2, title: 'Check Eligibility', desc: 'Our system finds the best matching schemes', color: 'bg-emerald-500' },
                 { num: 3, title: 'Get Guidance', desc: 'Step-by-step application process', color: 'bg-amber-500' },
                 { num: 4, title: 'Apply & Track', desc: 'Submit and track your application', color: 'bg-purple-600' },
               ].map((step, i) => (
                 <div key={i} className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                          {step.num}
                        </div>
                        <h4 className="font-bold text-gray-900 text-[13px] leading-tight">{step.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 pl-11">{step.desc}</p>
                    </div>
                    {i < 3 && <ChevronDown className="w-4 h-4 text-gray-300 shrink-0 -rotate-90 hidden md:block" />}
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        {/* Right Side: Check Eligibility Form */}
        <div className="space-y-6">
          <div className="bg-white rounded border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00428a]"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Check Your Eligibility</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                  <option>Select State</option>
                  <option>Rajasthan</option>
                  <option>Delhi</option>
                  <option>Maharashtra</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                  <option>Select Category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC/ST</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                <input type="number" placeholder="Enter your age" className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Occupation</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                  <option>Select Occupation</option>
                  <option>Student</option>
                  <option>Farmer</option>
                  <option>Unemployed</option>
                </select>
              </div>
              
              <button type="button" onClick={() => navigate({ to: '/eligibility-results' })} className="w-full bg-[#00428a] text-white font-bold py-2.5 rounded mt-4 hover:bg-blue-800 transition flex items-center justify-center gap-2">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="bg-white rounded border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-bold text-gray-900">Important Links</h3>
              <Link to="/" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3"/></Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/MyGov_logo.png" className="h-6 object-contain" alt="MyGov" />
                <span className="text-[9px] font-medium text-gray-600 leading-tight">Meri Sarkar</span>
              </div>
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/UMANG_App_Logo.png" className="h-6 object-contain" alt="UMANG" />
                <span className="text-[9px] font-medium text-gray-600 leading-tight">UMANG</span>
              </div>
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <div className="h-6 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-[#00428a]"><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>
                </div>
                <span className="text-[9px] font-medium text-gray-600 leading-tight">National Scholarship Portal</span>
              </div>
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <div className="h-6 flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="h-full w-full text-green-700"><rect width="80" height="80" x="10" y="10" fill="currentColor"/></svg>
                </div>
                <span className="text-[9px] font-medium text-gray-600 leading-tight">Rajasthan State Portal</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
