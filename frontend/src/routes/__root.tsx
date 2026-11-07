import { createRootRoute, Outlet, Link, useLocation } from '@tanstack/react-router'
import {
  Sparkles, ArrowRight, User, Search, Menu, X, LayoutDashboard, FileText,
  Calculator, MessageSquareWarning, Phone, BookOpen, TrendingUp, ChevronDown,
  Bell
} from 'lucide-react'
import { Show, UserButton } from '@clerk/react'
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
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language?.startsWith('hi') ? 'hi' : 'en')
  const { pathname } = useLocation()
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setMobileOpen(false)
    setToolsOpen(false)
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
    setLang(lng)
    try {
      localStorage.setItem('adhikar_lang', lng)
      document.documentElement.lang = lng
    } catch {}
  }

  const currentLang = lang

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black font-sans flex flex-col selection:bg-[#FF5500] selection:text-white">
      


      {/* 2. Main Navbar */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-2xl border-b border-[#EAE6DF] shadow-[0_4px_20px_rgba(0,0,0,0.03)]' : 'bg-white/90 backdrop-blur-xl border-b border-[#EAE6DF]/60 shadow-none'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center gap-4">
          
          {/* Brand Logo with Official Adhikar Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img 
              src="/adhikar-logo.png" 
              alt="Adhikar — Your Right, Delivered" 
              className="h-9 sm:h-10 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200" 
            />
            <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider bg-[#FFF2E8] text-[#EA580C] px-2 py-0.5 rounded-full border border-[#FFD6BA] self-center">
              Gov AI
            </span>
          </Link>

          {/* Centered Navigation Pill Container */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-full border border-[#EAE6DF]">
            <Link 
              to="/" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-black hover:bg-white transition-all [&.active]:bg-white [&.active]:text-black [&.active]:shadow-xs"
            >
              Home
            </Link>
            <Link 
              to="/schemes" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-black hover:bg-white transition-all [&.active]:bg-white [&.active]:text-black [&.active]:shadow-xs"
            >
              Schemes
            </Link>
            <Link 
              to="/eligibility" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-black hover:bg-white transition-all [&.active]:bg-white [&.active]:text-black [&.active]:shadow-xs"
            >
              Eligibility
            </Link>
            <Link 
              to="/assistant" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-black hover:bg-white transition-all [&.active]:bg-white [&.active]:text-black [&.active]:shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5500]" />
              AI Copilot
            </Link>
            <Link 
              to="/documents" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-black hover:bg-white transition-all [&.active]:bg-white [&.active]:text-black [&.active]:shadow-xs"
            >
              Documents
            </Link>

            {/* Resources Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setToolsOpen(o => !o)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-black hover:bg-white transition-all flex items-center gap-1"
              >
                <span>Resources</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {toolsOpen && (
                <div 
                  className="absolute left-0 mt-2 w-52 bg-white rounded-3xl shadow-xl border border-[#EAE6DF] py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setToolsOpen(false)}
                >
                  <Link to="/calculator" onClick={() => setToolsOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF2E8] hover:text-[#FF5500] transition">
                    <Calculator className="w-3.5 h-3.5 text-neutral-400" />
                    Calculator
                  </Link>
                  <Link to="/state-schemes" onClick={() => setToolsOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF2E8] hover:text-[#FF5500] transition">
                    <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                    State Schemes
                  </Link>
                  <Link to="/grievance" onClick={() => setToolsOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF2E8] hover:text-[#FF5500] transition">
                    <MessageSquareWarning className="w-3.5 h-3.5 text-neutral-400" />
                    Grievances
                  </Link>
                  <Link to="/family" onClick={() => setToolsOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF2E8] hover:text-[#FF5500] transition">
                    <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
                    Family Welfare
                  </Link>
                  <Link to="/timeline" onClick={() => setToolsOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF2E8] hover:text-[#FF5500] transition">
                    <LayoutDashboard className="w-3.5 h-3.5 text-neutral-400" />
                    Timeline
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Bilingual Switcher */}
            <div className="hidden sm:flex items-center bg-[#F5F2EC] rounded-full p-0.5 border border-[#EAE6DF]">
              <button 
                onClick={() => changeLanguage('hi')} 
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${currentLang === 'hi' ? 'bg-[#FF5500] text-white shadow-xs' : 'text-neutral-600 hover:text-black'}`}
                title="Switch to Hindi"
              >
                हिन्दी
              </button>
              <button 
                onClick={() => changeLanguage('en')} 
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${currentLang === 'en' ? 'bg-[#FF5500] text-white shadow-xs' : 'text-neutral-600 hover:text-black'}`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Search Pill Input/Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F5F2EC] hover:bg-[#EAE5DE] text-neutral-600 border border-[#EAE6DF] transition group"
              title="Search (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FF5500] transition" />
              <span className="hidden sm:inline">Search schemes, benefits...</span>
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-neutral-400 bg-white px-1.5 py-0.5 rounded-md border border-[#EAE6DF]">⌘K</kbd>
            </button>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-full bg-[#F5F2EC] hover:bg-[#EAE5DE] border border-[#EAE6DF] text-neutral-700 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-neutral-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5500]" />
            </Link>

            {/* Sign In Button / User Profile */}
            <Show when="signed-out">
              {!user ? (
                <Link
                  to="/login"
                  className="bg-black hover:bg-neutral-800 text-white font-bold px-5 py-2 text-xs rounded-full flex items-center gap-1.5 shadow-sm transition hover:scale-[1.02]"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="flex items-center gap-2 bg-[#F5F2EC] p-1 pr-3 rounded-full border border-[#EAE6DF]">
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <button onClick={logout} className="text-[11px] font-semibold text-[#FF5500] hover:text-[#EA4C00] transition">
                    Logout
                  </button>
                </div>
              )}
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center text-xs font-bold text-neutral-800 hover:text-black px-3 py-1.5 rounded-full bg-[#F5F2EC] border border-[#EAE6DF] transition"
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-8 h-8 rounded-full border border-[#EAE6DF]',
                    }
                  }}
                />
              </div>
            </Show>

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-9 h-9 rounded-2xl bg-[#F5F2EC] hover:bg-[#EAE5DE] border border-[#EAE6DF] flex items-center justify-center text-neutral-700 transition"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#EAE6DF] bg-white/98 backdrop-blur-xl animate-fade-in">
            <nav className="px-4 py-4 grid grid-cols-2 gap-2">
              {[
                { to: '/', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
                { to: '/schemes', label: 'Schemes', icon: <BookOpen className="w-4 h-4" /> },
                { to: '/eligibility', label: 'Eligibility', icon: <TrendingUp className="w-4 h-4" /> },
                { to: '/assistant', label: 'AI Copilot', icon: <Sparkles className="w-4 h-4 text-[#FF5500]" /> },
                { to: '/documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
                { to: '/calculator', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
                { to: '/grievance', label: 'Grievances', icon: <MessageSquareWarning className="w-4 h-4" /> },
                { to: '/contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-700 hover:bg-[#FFF2E8] hover:text-[#FF5500] transition [&.active]:bg-[#FFF2E8] [&.active]:text-[#FF5500]"
                >
                  <span className="text-neutral-400">{item.icon}</span>
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
    
      {/* 3. Sleek Premium Black Footer */}
      <footer className="bg-black text-neutral-400 pt-16 pb-12 w-full border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/adhikar-logo-dark.png" 
                  alt="Adhikar — Your Right, Delivered" 
                  className="h-10 sm:h-11 w-auto object-contain" 
                />
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                {t('footer.tagline')}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-900 text-neutral-300 border border-neutral-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5500] animate-pulse"></span>
                  {currentLang === 'hi' ? 'सभी सरकारी सेवाएं सक्रिय हैं' : 'All Welfare Systems Operational'}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {t('footer.quick_links')}
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link to="/schemes" className="hover:text-[#FF5500] transition">{t('nav.schemes')}</Link></li>
                <li><Link to="/eligibility" className="hover:text-[#FF5500] transition">{t('nav.eligibility')}</Link></li>
                <li><Link to="/assistant" className="hover:text-[#FF5500] transition">{t('nav.assistant')}</Link></li>
                <li><Link to="/documents" className="hover:text-[#FF5500] transition">{t('nav.documents')}</Link></li>
                <li><Link to="/state-schemes" className="hover:text-[#FF5500] transition">{t('nav.state_schemes')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {t('footer.citizen_tools')}
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link to="/calculator" className="hover:text-[#FF5500] transition">{t('nav.calculator')}</Link></li>
                <li><Link to="/state-schemes" className="hover:text-[#FF5500] transition">{t('nav.state_schemes')}</Link></li>
                <li><Link to="/grievance" className="hover:text-[#FF5500] transition">{t('nav.grievances')}</Link></li>
                <li><Link to="/family" className="hover:text-[#FF5500] transition">{t('nav.family')}</Link></li>
                <li><Link to="/timeline" className="hover:text-[#FF5500] transition">{t('nav.timeline')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                {t('footer.verified_portals')}
              </h4>
              <div className="space-y-2 text-xs">
                <p className="text-[11px] text-neutral-500">Official Direct Integration</p>
                <div className="flex items-center gap-2 text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span>National Portal of India (.gov.in)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span>Direct Benefit Transfer (DBT Bharat)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span>MyGov Citizen Services</span>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-neutral-500">
              © 2026 Adhikar. Built for Indian Citizens. 100% Deterministic Rule Engine.
            </p>
            <div className="flex items-center gap-6 text-neutral-400">
              <Link to="/about" className="hover:text-white transition">About</Link>
              <Link to="/contact" className="hover:text-white transition">Contact</Link>
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global AI Chat Bubble & Command Palette */}
      <AIChatBubble />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  )
}
