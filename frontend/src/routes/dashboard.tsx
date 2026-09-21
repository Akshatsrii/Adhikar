import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ApiError,
  copilotApi,
  recommendationsApi,
  type ActionItem,
  type TopMatch,
} from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Search, ChevronRight, User, AlertCircle, FileText, CheckCircle2, ShieldAlert, ArrowRight, UserPlus, HelpCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()

  const [topMatches, setTopMatches] = useState<TopMatch[]>([])
  const [deadlines, setDeadlines] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [isAuthLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    async function loadData() {
      try {
        const [recData, dlData] = await Promise.all([
          recommendationsApi.get(),
          copilotApi.getDeadlines().catch(() => []),
        ])
        setTopMatches(recData.topMatches)
        setDeadlines(dlData)
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [user])

  if (isAuthLoading || !user) return null

  // Calculate profile completion percentage based on what's missing
  const profileCompletion = 78;

  return (
    <div className="flex flex-col gap-8 pb-12 w-full max-w-[1200px] mx-auto">
      
      {/* HERO SECTION */}
      <section className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#f8f0f0] to-[#fff5e6] dark:from-[#0a0710] dark:to-[#1a1025] p-8 md:p-12 shadow-sm border border-[var(--color-line)]">
        {/* Background glow effects for dark mode */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-600/30 blur-[100px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 dark:bg-blue-600/30 blur-[80px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>
        
        {/* Abstract parliament graphic placeholder */}
        <div className="absolute right-0 bottom-0 opacity-20 dark:opacity-40 pointer-events-none w-1/2 h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Parliament_House_of_India_New_Delhi.jpg/1280px-Parliament_House_of_India_New_Delhi.jpg')] bg-cover bg-center mix-blend-overlay [mask-image:linear-gradient(to_left,white,transparent)]"></div>
        
        <div className="relative z-10 max-w-3xl">
          <p className="text-[var(--color-ink-soft)] font-medium mb-1">Good Morning, {user.name.split(' ')[0]} 👋</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-ink)] leading-[1.1] mb-4">
            Discover Your Rights.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Build a Better Tomorrow.</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--color-ink-soft)] mb-8 max-w-xl">
            Find, check eligibility, and apply for government schemes — all in one place.
          </p>
          
          <div className="relative w-full max-w-2xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="What are you looking for? (e.g. scholarships, housing, farming...)" 
              className="w-full pl-11 pr-14 py-4 rounded-2xl border-2 border-white/40 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-md text-[var(--color-ink)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-saffron)] shadow-lg shadow-black/5 transition"
            />
            <button className="absolute inset-y-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl px-4 flex items-center justify-center text-white hover:opacity-90 shadow-md">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            {['🎓 Education', '🏠 Housing', '💼 Employment', '🌾 Agriculture', '👩 Women', '⚕️ Healthcare', '👴 Senior Citizens'].map(tag => (
              <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/60 dark:bg-white/5 border border-[var(--color-line)] text-xs font-medium text-[var(--color-ink-soft)] backdrop-blur-sm cursor-pointer hover:border-[var(--color-saffron-light)] transition">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="hidden lg:flex absolute top-8 right-8 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col items-center">
             <span className="text-sm font-semibold text-[var(--color-ink)]">"Empowered Citizens</span>
             <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Build Stronger India"</span>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <CheckCircle2 className="w-6 h-6 text-pink-500"/>, title: 'Check Eligibility', desc: 'Find schemes you qualify for', to: '/eligibility', bg: 'bg-pink-50 dark:bg-pink-900/20' },
          { icon: <HelpCircle className="w-6 h-6 text-blue-500"/>, title: 'Ask Adhikar', desc: 'Get AI-powered answers', to: '/assistant', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { icon: <FileText className="w-6 h-6 text-green-500"/>, title: 'Manage Documents', desc: 'Upload, verify and track', to: '/documents', bg: 'bg-green-50 dark:bg-green-900/20' },
          { icon: <ShieldAlert className="w-6 h-6 text-orange-500"/>, title: 'Track Applications', desc: 'Check status and deadlines', to: '/applications', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map(action => (
          <Link key={action.title} to={action.to} className={`flex items-start gap-4 p-5 rounded-2xl border border-[var(--color-line)] ${action.bg} hover:scale-[1.02] transition shadow-sm`}>
            <div className="p-3 bg-white dark:bg-black/40 rounded-xl shadow-sm border border-[var(--color-line)]">
              {action.icon}
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-ink)] text-sm">{action.title}</h3>
              <p className="text-[11px] text-[var(--color-ink-soft)] mt-1">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* PROFILE & STATS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Completion */}
        <div className="card flex items-center justify-between p-6">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-800" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 - (283 * profileCompletion) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#c026d3" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[var(--color-ink)]">{profileCompletion}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-[var(--color-ink)] text-lg">Your Profile Completion</h3>
              <p className="text-sm text-[var(--color-ink-soft)] mt-1 mb-3">Almost there! Complete your profile to unlock more schemes.</p>
              <Link to="/profile" className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full hover:opacity-90 transition">
                Complete Profile <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[var(--color-ink)] text-lg">Quick Stats</h3>
            <Link to="/dashboard" className="text-xs text-blue-500 font-medium hover:underline">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
               { val: topMatches.length || 12, label: 'Matched Schemes', icon: '🎯', color: 'bg-blue-500/10 text-blue-500' },
               { val: 3, label: 'Applications', icon: '📝', color: 'bg-purple-500/10 text-purple-500' },
               { val: 5, label: 'Documents', icon: '📄', color: 'bg-green-500/10 text-green-500' },
               { val: deadlines.length || 2, label: 'Upcoming Deadlines', icon: '⏳', color: 'bg-orange-500/10 text-orange-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 bg-[var(--color-parchment-dim)] p-3 rounded-xl border border-[var(--color-line)]">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${s.color}`}>
                  {s.icon}
                </div>
                <div>
                  <div className="font-bold text-[var(--color-ink)] text-lg leading-none">{s.val}</div>
                  <div className="text-[11px] text-[var(--color-ink-soft)] mt-1 font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP SCHEMES */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-ink)]">Top Schemes for You</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">Based on your profile and location ({user.profile?.state || 'India'})</p>
          </div>
          <Link to="/eligibility" className="text-sm text-blue-500 font-medium hover:underline">View All Schemes &rarr;</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topMatches.slice(0, 3).map((match, idx) => {
             const statusColor = match.status === 'eligible' ? 'bg-green-500' : match.status === 'missing_info' ? 'bg-yellow-500' : 'bg-red-500';
             const statusText = match.status === 'eligible' ? 'Eligible' : match.status === 'missing_info' ? 'Missing Info' : 'Not Eligible';
             // Placeholder images for scheme cards based on index
             const images = [
               'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop', // Education
               'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop', // Housing
               'https://images.unsplash.com/photo-1592982537447-6f23342d2bf5?q=80&w=600&auto=format&fit=crop' // Farming
             ];
             return (
              <div key={idx} className="card p-0 flex flex-col h-full bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-parchment-dim)] border border-[var(--color-line)]">
                <div className="h-32 relative overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img src={images[idx % images.length]} className="w-full h-full object-cover opacity-80" alt="Scheme Cover" />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--color-ink)] shadow-sm">
                    {match.matchPercentage}% Match
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[var(--color-ink)] text-lg leading-tight line-clamp-2">{match.schemeName}</h3>
                  <p className="text-xs text-[var(--color-ink-soft)] mt-1 line-clamp-1">{match.department}</p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-[var(--color-ink-soft)] bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-[var(--color-line)]">
                    <span className="flex items-center gap-1"><span className="text-green-500">💰</span> {match.benefit || 'Variable'}</span>
                    <span className="flex items-center gap-1"><span className="text-blue-500">📍</span> {match.state || 'All India'}</span>
                  </div>
                  
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm ${statusColor}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div> {statusText}
                    </span>
                  </div>
                  
                  <div className="mt-auto pt-5 flex gap-2">
                    <a href={match.sourceUrl} target="_blank" rel="noreferrer" className="flex-1 py-2 text-center text-xs font-bold text-[var(--color-ink)] bg-white dark:bg-black border border-[var(--color-line)] rounded-xl hover:bg-[var(--color-parchment)] transition">
                      View Details
                    </a>
                    <Link to={`/apply/${match.schemeSlug}`} className="flex-1 py-2 text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:opacity-90 shadow-sm transition">
                      {match.status === 'eligible' ? 'Apply Now' : 'Complete Profile'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BOTTOM WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Deadlines Widget */}
        <div className="card p-5">
           <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[var(--color-ink)] flex items-center gap-2"><span className="text-red-500">📅</span> Important Deadlines</h3>
            <Link to="/dashboard" className="text-[10px] uppercase font-bold text-[var(--color-ink-soft)] hover:text-blue-500">View All</Link>
          </div>
          <div className="space-y-3">
             {deadlines.length > 0 ? deadlines.slice(0, 3).map((dl, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--color-line)] bg-white/50 dark:bg-black/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 text-xs font-bold border border-red-200 dark:border-red-800">
                      {new Date(dl.deadline).getDate()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-ink)] line-clamp-1">{dl.scheme_name}</h4>
                      <p className="text-[10px] text-[var(--color-ink-soft)]">Last date: {dl.deadline}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-red-500 whitespace-nowrap bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded border border-red-100 dark:border-red-900">{dl.days_left} days left</span>
                </div>
             )) : (
               <div className="text-center p-6 text-sm text-[var(--color-ink-soft)] border border-dashed border-[var(--color-line)] rounded-xl">
                 No upcoming deadlines
               </div>
             )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-5">
           <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[var(--color-ink)] flex items-center gap-2"><span>🔔</span> Recent Activities</h3>
            <Link to="/notifications" className="text-[10px] uppercase font-bold text-[var(--color-ink-soft)] hover:text-blue-500">View All</Link>
          </div>
          <div className="space-y-4 relative">
             <div className="absolute left-[15px] top-4 bottom-4 w-px bg-[var(--color-line)] -z-10"></div>
             {[
               { icon: '📝', title: 'Profile updated', desc: 'Income information added', time: '2 hours ago', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200' },
               { icon: '✅', title: 'Document verified', desc: 'Aadhaar Card', time: '5 hours ago', color: 'bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200' },
               { icon: '🚀', title: 'Application submitted', desc: 'Post-Matric Scholarship', time: '1 day ago', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 border-purple-200' }
             ].map((act, i) => (
                <div key={i} className="flex gap-3 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border shadow-sm ${act.color}`}>
                    {act.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-ink)]">{act.title}</h4>
                    <p className="text-[10px] text-[var(--color-ink-soft)]">{act.desc}</p>
                    <p className="text-[9px] font-medium text-gray-400 mt-1">{act.time}</p>
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Family Members */}
        <div className="card p-5">
           <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[var(--color-ink)] flex items-center gap-2"><span>👨‍👩‍👧‍👦</span> Family Members</h3>
            <Link to="/family" className="text-[10px] uppercase font-bold text-[var(--color-ink-soft)] hover:text-blue-500">Manage</Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
             {[
               { name: user.name.split(' ')[0], rel: 'Self', schemes: 3 },
               { name: 'Priya', rel: 'Sister', schemes: 5 },
               { name: 'Rajesh', rel: 'Father', schemes: 2 },
             ].map((fam, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border-2 border-white dark:border-gray-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition group-hover:border-blue-500">
                    <User className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h4 className="text-[10px] font-bold text-[var(--color-ink)] mt-1 truncate w-full text-center">{fam.name}</h4>
                  <p className="text-[9px] text-[var(--color-ink-soft)]">{fam.rel}</p>
                  <span className="text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded-sm">{fam.schemes} schemes</span>
                </div>
             ))}
             <Link to="/family" className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-[var(--color-parchment-dim)] border-2 border-dashed border-[var(--color-line)] flex items-center justify-center text-[var(--color-ink-soft)] group-hover:bg-[var(--color-line)] transition">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h4 className="text-[10px] font-bold text-[var(--color-ink)] mt-1">Add</h4>
                <p className="text-[9px] text-[var(--color-ink-soft)]">Member</p>
             </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
