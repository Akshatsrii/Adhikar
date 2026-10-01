import { createFileRoute, Link, useNavigate, Navigate } from '@tanstack/react-router'
import { Search, ChevronDown, ArrowRight, Home, Building2, Briefcase, Leaf, Users, HeartPulse, Accessibility, MoreHorizontal, Megaphone } from 'lucide-react'
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
      
      {/* HERO SECTION - PREMIUM REDESIGN */}
      <div className="relative w-full h-[500px] overflow-hidden flex items-center bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rashtrapati_Bhavan%2C_New_Delhi.jpg/1280px-Rashtrapati_Bhavan%2C_New_Delhi.jpg" alt="Background" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-900/80"></div>
          {/* Subtle glowing orbs */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <h2 className="text-[2.5rem] md:text-[3.2rem] font-extrabold text-white leading-[1.1] mb-5 tracking-tight drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">{t('hero.title1')}</span><br/>
              {t('hero.title2')}
            </h2>
            <p className="text-slate-300 mb-10 max-w-[500px] leading-relaxed text-lg font-light">
              {t('hero.desc')}
            </p>
            
            {/* Search Bar in Hero - Glassmorphic */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex gap-2 max-w-lg border border-white/20 relative z-20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input type="text" placeholder={t('hero.search_placeholder')} className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none focus:outline-none text-base text-white placeholder:text-slate-400" />
              </div>
              <button onClick={() => navigate({ to: '/schemes' })} className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 transition-all font-semibold text-sm">
                 {t('hero.search_btn')}
              </button>
            </div>
          </div>
          
          <div className="absolute top-4 right-8 text-right hidden lg:block">
            <div className="glass px-4 py-3 rounded-2xl shadow-lg">
              <div className="text-xs font-medium text-slate-200 tracking-wide">"Empowered Citizens</div>
              <div className="text-xs font-bold text-white tracking-wide">Prosperous India"</div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM MARQUEE */}
      <div className="bg-slate-900 border-b border-slate-800 w-full py-2.5 overflow-hidden flex items-center shadow-inner">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center gap-4 text-[11px] font-medium text-slate-300">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 uppercase tracking-widest text-[9px] font-bold"><Megaphone className="w-3 h-3"/> {t('hero.updates')}</span>
          <div className="whitespace-nowrap flex-1 overflow-hidden">
            <div className="inline-block animate-[marquee_25s_linear_infinite] pl-[100%]">
              New schemes for students announced. Direct benefit transfers initiated for PM-KISAN. Scholarships portal open till 30th November.
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        
        <div className="space-y-8">
          
          {/* Categories Grid */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Browse by Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categoryCards.map((cat, i) => (
                <Link key={i} to="/schemes" search={{ category: cat.title }} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100 hover:bg-white transition-all duration-300 cursor-pointer group">
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-[14px]">{cat.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Schemes */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Featured Schemes</h3>
              <Link to="/schemes" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 group">View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredSchemes.length === 0 ? (
                 <div className="col-span-2 text-center text-slate-400 py-12 text-sm font-medium">Loading schemes...</div>
              ) : (
                featuredSchemes.map((s, i) => (
                  <div key={i} className="border border-slate-100 bg-white rounded-2xl flex flex-col overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
                    <div className="p-6 flex flex-col flex-1 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none"></div>
                      <h4 className="font-bold text-slate-900 text-[15px] leading-tight mb-2 line-clamp-2 h-10 relative z-10">{s.name}</h4>
                      <p className="text-[12px] text-slate-500 mb-5 line-clamp-2 relative z-10 leading-relaxed">{s.description}</p>
                      <div className="mt-auto space-y-2.5 mb-6">
                        <div className="flex items-center text-[12px] font-medium text-slate-600 gap-2"><div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] shrink-0">₹</div> {s.benefit || 'Variable Support'}</div>
                        <div className="flex items-center text-[12px] font-medium text-slate-600 gap-2"><div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Users className="w-3 h-3"/></div> {s.category}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                        <Link to="/scheme/$slug" params={{ slug: s.slug }} className="border border-slate-200 text-center text-slate-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all">View Details</Link>
                        <Link to="/apply/$slug" params={{ slug: s.slug }} className="bg-indigo-600 text-center text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all">Apply Now</Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* How Adhikar Works */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">How Adhikar Works</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2">
               {[
                 { num: 1, title: 'Create Profile', desc: 'Tell us a few details about yourself', color: 'bg-indigo-600 shadow-indigo-200' },
                 { num: 2, title: 'Check Eligibility', desc: 'Our system finds the best matching schemes', color: 'bg-emerald-500 shadow-emerald-200' },
                 { num: 3, title: 'Get Guidance', desc: 'Step-by-step application process', color: 'bg-amber-500 shadow-amber-200' },
                 { num: 4, title: 'Apply & Track', desc: 'Submit and track your application', color: 'bg-violet-600 shadow-violet-200' },
               ].map((step, i) => (
                 <div key={i} className="flex items-center gap-4 flex-1 w-full md:w-auto">
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl ${step.color} shadow-lg text-white flex items-center justify-center font-bold text-[15px] shrink-0`}>
                          {step.num}
                        </div>
                        <h4 className="font-bold text-slate-900 text-[14px] leading-tight">{step.title}</h4>
                      </div>
                      <p className="text-[12px] text-slate-500 pl-[52px] leading-relaxed">{step.desc}</p>
                    </div>
                    {i < 3 && <ChevronDown className="w-5 h-5 text-slate-200 shrink-0 -rotate-90 hidden md:block ml-2" />}
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        {/* Right Side: Check Eligibility Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Check Eligibility</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all">
                  <option>Select State</option>
                  <option>Rajasthan</option>
                  <option>Delhi</option>
                  <option>Maharashtra</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all">
                  <option>Select Category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC/ST</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                <input type="number" placeholder="Enter your age" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Occupation</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all">
                  <option>Select Occupation</option>
                  <option>Student</option>
                  <option>Farmer</option>
                  <option>Unemployed</option>
                </select>
              </div>
              
              <button type="button" onClick={() => navigate({ to: '/eligibility-results' })} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 rounded-xl mt-6 shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">Important Links</h3>
              <Link to="/" className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1 group">View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/></Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-200 hover:bg-slate-50 transition-all group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/MyGov_logo.png" className="h-7 object-contain group-hover:scale-110 transition-transform" alt="MyGov" />
                <span className="text-[10px] font-semibold text-slate-600 leading-tight">Meri Sarkar</span>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-200 hover:bg-slate-50 transition-all group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/UMANG_App_Logo.png" className="h-7 object-contain group-hover:scale-110 transition-transform" alt="UMANG" />
                <span className="text-[10px] font-semibold text-slate-600 leading-tight">UMANG</span>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-200 hover:bg-slate-50 transition-all group">
                <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-indigo-600"><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 leading-tight">National Scholarship</span>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-200 hover:bg-slate-50 transition-all group">
                <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <svg viewBox="0 0 100 100" className="h-full w-full text-emerald-600"><rect width="80" height="80" x="10" y="10" fill="currentColor" rx="15"/></svg>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 leading-tight">State Portal</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
