import { createRootRoute, Outlet, Link, useLocation } from '@tanstack/react-router'
import { Sparkles, Globe, ArrowRight, ShieldCheck, User, Search, Menu, X, LayoutDashboard, FileText, Calculator, Newspaper, MessageSquareWarning, Phone, BookOpen, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { CommandPalette } from '@/components/CommandPalette'
import { AIChatBubble } from '@/components/AIChatBubble'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { user, logout } = useAuth()
  const { i18n } = useTranslation()
  const { pathname } = useLocation()
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
    }
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Sleek Modern Top Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs font-medium py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="tracking-wide font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next-Gen Welfare AI: Real-time discovery & 1-click official applications</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-2.5 py-0.5 border border-white/20">
              <Globe className="w-3 h-3 text-white/80" />
              <button 
                onClick={() => changeLanguage('hi')} 
                className={`px-1.5 py-0.5 rounded transition ${i18n.language === 'hi' ? 'bg-white text-blue-900 font-bold' : 'hover:text-white/80'}`}
              >
                हिन्दी
              </button>
              <span className="text-white/40">|</span>
              <button 
                onClick={() => changeLanguage('en')} 
                className={`px-1.5 py-0.5 rounded transition ${i18n.language === 'en' ? 'bg-white text-blue-900 font-bold' : 'hover:text-white/80'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scroll-Aware Glassmorphic Navbar */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_4px_30px_rgba(0,0,0,0.08)]' : 'bg-white/70 backdrop-blur-xl border-b border-slate-100/60 shadow-none'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                  Adhikar
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/60 shadow-xs">
                  AI Copilot
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-tight">Citizen Welfare Platform</span>
            </div>
          </Link>

          {/* Centered Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 backdrop-blur-md">
            <Link 
              to="/" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-blue-700 [&.active]:shadow-xs"
            >
              Home
            </Link>
            <Link 
              to="/schemes" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-blue-700 [&.active]:shadow-xs"
            >
              Schemes
            </Link>
            <Link 
              to="/eligibility" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-blue-700 [&.active]:shadow-xs"
            >
              Check Eligibility
            </Link>
            <Link 
              to="/assistant" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-blue-700 [&.active]:shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Assistant
            </Link>
            <Link 
              to="/documents" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-blue-700 [&.active]:shadow-xs"
            >
              Documents
            </Link>
            <Link 
              to="/calculator" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-blue-700 [&.active]:shadow-xs"
            >
              Calculators
            </Link>
            <Link 
              to="/contact" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-blue-700 [&.active]:shadow-xs"
            >
              Helpdesk
            </Link>
            <Link 
              to="/grievance" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-white transition-all [&.active]:bg-white [&.active]:text-rose-600 [&.active]:shadow-xs flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Grievance
            </Link>
          </nav>

          {/* Right Action / Auth */}
          <div className="flex items-center gap-2">
            {/* Spotlight */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition group"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition" />
              <span className="hidden sm:inline text-slate-500 font-medium">Search</span>
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
            </button>

            {!user ? (
              <Link
                to="/login"
                className="btn-shimmer text-white text-xs font-bold px-5 py-2.5 rounded-full hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-transform"
              >
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2.5 bg-slate-100/80 p-1 pr-3.5 rounded-full border border-slate-200/60">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm ring-2 ring-blue-100">
                  {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight max-w-[110px] truncate">{user.name}</span>
                  <button onClick={logout} className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 text-left transition">Sign out</button>
                </div>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
            <nav className="px-4 py-4 grid grid-cols-2 gap-2">
              {[
                { to: '/', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
                { to: '/schemes', label: 'Schemes', icon: <BookOpen className="w-4 h-4" /> },
                { to: '/eligibility', label: 'Eligibility', icon: <TrendingUp className="w-4 h-4" /> },
                { to: '/assistant', label: 'AI Copilot', icon: <Sparkles className="w-4 h-4" /> },
                { to: '/documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
                { to: '/calculator', label: 'Calculators', icon: <Calculator className="w-4 h-4" /> },
                { to: '/news', label: 'News', icon: <Newspaper className="w-4 h-4" /> },
                { to: '/grievance', label: 'Grievance', icon: <MessageSquareWarning className="w-4 h-4" /> },
                { to: '/contact', label: 'Helpdesk', icon: <Phone className="w-4 h-4" /> },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition [&.active]:bg-blue-50 [&.active]:text-blue-700"
                >
                  <span className="text-slate-400">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main" className="flex-1 flex flex-col relative w-full">
        <Outlet />
      </main>
    
      {/* 3. Modern Sleek Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 w-full border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">Adhikar</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Next-generation citizen intelligence platform bridging India's welfare gap with Gemini AI reasoning and deterministic eligibility verification.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  All Systems Operational
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/schemes" className="hover:text-white transition">Schemes Catalog</Link></li>
                <li><Link to="/saved" className="hover:text-white transition">My Saved Schemes</Link></li>
                <li><Link to="/calculator" className="hover:text-white transition">Subsidy Calculators</Link></li>
                <li><Link to="/compare" className="hover:text-white transition">Scheme Comparator</Link></li>
                <li><Link to="/readiness" className="hover:text-white transition">Readiness Audit</Link></li>
                <li><Link to="/eligibility" className="hover:text-white transition">Eligibility Engine</Link></li>
                <li><Link to="/assistant" className="hover:text-white transition">AI Copilot</Link></li>
                <li><Link to="/documents" className="hover:text-white transition">Smart Document Hub</Link></li>
                <li><Link to="/state-schemes" className="hover:text-white transition">State Level Welfare</Link></li>
                <li><Link to="/impact" className="hover:text-white transition">Social Impact Dashboard</Link></li>
                <li><Link to="/news" className="hover:text-white transition">Welfare News Feed</Link></li>
                <li><Link to="/timeline" className="hover:text-white transition">My Application Timeline</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/about" className="hover:text-white transition">About Architecture</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Citizen Grievance Redressal</Link></li>
                <li><Link to="/grievance" className="hover:text-white transition">File / Track Grievance</Link></li>
                <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">PM-KISAN Portal</a></li>
                <li><a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">Ayushman Bharat Portal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Support & Trust</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="text-slate-300 font-semibold">Toll-Free National Helpline:</li>
                <li className="text-white font-mono text-sm">1800-11-0000</li>
                <li className="text-slate-300 font-semibold pt-2">Direct Contact:</li>
                <li>support@adhikar-platform.in</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Adhikar. Built for Bharat with Modern Microservices.</p>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-slate-400 transition">Privacy</Link>
              <Link to="/about" className="hover:text-slate-400 transition">Terms</Link>
              <Link to="/about" className="hover:text-slate-400 transition">Security</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Spotlight / Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />

      {/* Floating AI Chat Bubble */}
      <AIChatBubble />
    </div>
  )
}
