import { createRootRoute, Outlet, Link, useLocation } from '@tanstack/react-router'
import { Sparkles, Globe, ArrowRight, ShieldCheck, User, Search, Menu, X, LayoutDashboard, FileText, Calculator, MessageSquareWarning, Phone, BookOpen, TrendingUp, ChevronDown } from 'lucide-react'
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
    try {
      localStorage.setItem('adhikar_lang', lng)
      document.documentElement.lang = lng
    } catch {}
  }

  const currentLang = i18n.language?.startsWith('hi') ? 'hi' : 'en'

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111827] font-sans flex flex-col selection:bg-[#FF5B00] selection:text-white">
      
      {/* 1. Warm Modern Top Announcement Banner */}
      <div className="bg-[#18181B] text-neutral-200 text-xs font-medium py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5B00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5B00]"></span>
            </span>
            <span className="tracking-wide font-medium flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8533] shrink-0" />
              <span className="truncate">{t('announcement')}</span>
            </span>
          </div>

          {/* Hindi / English Language Switcher */}
          <div className="flex items-center gap-3 shrink-0 text-xs font-semibold">
            <div className="flex items-center gap-1 bg-neutral-900 rounded-full p-1 border border-neutral-700/80">
              <Globe className="w-3 h-3 text-neutral-400 ml-1.5" />
              <button 
                onClick={() => changeLanguage('hi')} 
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${currentLang === 'hi' ? 'bg-[#FF5B00] text-white shadow-xs' : 'text-neutral-400 hover:text-white'}`}
                title="Switch to Hindi"
              >
                हिन्दी
              </button>
              <button 
                onClick={() => changeLanguage('en')} 
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${currentLang === 'en' ? 'bg-[#FF5B00] text-white shadow-xs' : 'text-neutral-400 hover:text-white'}`}
                title="Switch to English"
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Warm Glassmorphic Navbar */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-[#FDFBF7]/90 backdrop-blur-2xl border-b border-[#EAE6DF] shadow-[0_4px_24px_rgba(0,0,0,0.04)]' : 'bg-[#FDFBF7]/75 backdrop-blur-xl border-b border-[#EAE6DF]/60 shadow-none'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          
          {/* Brand Logo with warm orange accent */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] border border-neutral-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-5 h-5 text-[#FF5B00] stroke-[2.3]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-[#111827] tracking-tight">
                  Adhikar<span className="text-[#FF5B00]">.</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFF4EC] text-[#D9480F] px-2 py-0.5 rounded-full border border-[#FFE2D1]">
                  AI Gov
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-medium tracking-tight">
                {currentLang === 'hi' ? 'मेरी सरकार, मेरा अधिकार' : 'Citizen Welfare Platform'}
              </span>
            </div>
          </Link>

          {/* Centered Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5F1EA]/80 p-1 rounded-full border border-[#EAE6DF]">
            <Link 
              to="/" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-[#111827] hover:bg-white transition-all [&.active]:bg-white [&.active]:text-[#111827] [&.active]:shadow-xs"
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/schemes" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-[#111827] hover:bg-white transition-all [&.active]:bg-white [&.active]:text-[#111827] [&.active]:shadow-xs"
            >
              {t('nav.schemes')}
            </Link>
            <Link 
              to="/eligibility" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-[#111827] hover:bg-white transition-all [&.active]:bg-white [&.active]:text-[#111827] [&.active]:shadow-xs"
            >
              {t('nav.eligibility')}
            </Link>
            <Link 
              to="/assistant" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-[#111827] hover:bg-white transition-all [&.active]:bg-white [&.active]:text-[#111827] [&.active]:shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5B00]" />
              {t('nav.assistant')}
            </Link>
            <Link 
              to="/documents" 
              className="px-4 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-[#111827] hover:bg-white transition-all [&.active]:bg-white [&.active]:text-[#111827] [&.active]:shadow-xs"
            >
              {t('nav.documents')}
            </Link>

            {/* More Tools Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setToolsOpen(o => !o)}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-neutral-600 hover:text-[#111827] hover:bg-white transition-all flex items-center gap-1"
              >
                <span>{currentLang === 'hi' ? 'अन्य सेवाएं' : 'More'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {toolsOpen && (
                <div 
                  className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EAE6DF] py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setToolsOpen(false)}
                >
                  <Link 
                    to="/calculator" 
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF4EC] hover:text-[#FF5B00] transition"
                  >
                    <Calculator className="w-3.5 h-3.5 text-neutral-400" />
                    {t('nav.calculator')}
                  </Link>
                  <Link 
                    to="/state-schemes" 
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF4EC] hover:text-[#FF5B00] transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                    {t('nav.state_schemes')}
                  </Link>
                  <Link 
                    to="/grievance" 
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF4EC] hover:text-[#FF5B00] transition"
                  >
                    <MessageSquareWarning className="w-3.5 h-3.5 text-neutral-400" />
                    {t('nav.grievances')}
                  </Link>
                  <Link 
                    to="/family" 
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF4EC] hover:text-[#FF5B00] transition"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
                    {t('nav.family')}
                  </Link>
                  <Link 
                    to="/timeline" 
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#FFF4EC] hover:text-[#FF5B00] transition"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-neutral-400" />
                    {t('nav.timeline')}
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action / Auth */}
          <div className="flex items-center gap-2.5">
            {/* Search Spotlight */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F5F1EA] hover:bg-[#EAE5DE] text-neutral-700 border border-[#EAE6DF] transition group"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#FF5B00] transition" />
              <span className="hidden sm:inline text-neutral-600 font-medium">{currentLang === 'hi' ? 'खोजें' : 'Search'}</span>
              <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-neutral-400 bg-white px-1.5 py-0.5 rounded-md border border-[#EAE6DF]">⌘K</kbd>
            </button>

            {!user ? (
              <Link
                to="/login"
                className="btn-pill-dark text-xs px-5 py-2 flex items-center gap-1.5 shadow-sm"
              >
                <span>{t('nav.login')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2.5 bg-[#F5F1EA] p-1 pr-3.5 rounded-full border border-[#EAE6DF]">
                <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-neutral-900 leading-tight max-w-[110px] truncate">{user.name}</span>
                  <button onClick={logout} className="text-[10px] font-semibold text-[#FF5B00] hover:text-[#EA4C00] text-left transition">{t('nav.logout')}</button>
                </div>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden w-9 h-9 rounded-2xl bg-[#F5F1EA] hover:bg-[#EAE5DE] border border-[#EAE6DF] flex items-center justify-center text-neutral-700 transition"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#EAE6DF] bg-[#FDFBF7]/98 backdrop-blur-xl animate-fade-in">
            <nav className="px-4 py-4 grid grid-cols-2 gap-2">
              {[
                { to: '/', label: t('nav.home'), icon: <LayoutDashboard className="w-4 h-4" /> },
                { to: '/schemes', label: t('nav.schemes'), icon: <BookOpen className="w-4 h-4" /> },
                { to: '/eligibility', label: t('nav.eligibility'), icon: <TrendingUp className="w-4 h-4" /> },
                { to: '/assistant', label: t('nav.assistant'), icon: <Sparkles className="w-4 h-4 text-[#FF5B00]" /> },
                { to: '/documents', label: t('nav.documents'), icon: <FileText className="w-4 h-4" /> },
                { to: '/calculator', label: t('nav.calculator'), icon: <Calculator className="w-4 h-4" /> },
                { to: '/grievance', label: t('nav.grievances'), icon: <MessageSquareWarning className="w-4 h-4" /> },
                { to: '/contact', label: t('nav.contact'), icon: <Phone className="w-4 h-4" /> },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-neutral-700 hover:bg-[#FFF4EC] hover:text-[#FF5B00] transition [&.active]:bg-[#FFF4EC] [&.active]:text-[#FF5B00]"
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
    
      {/* 3. Warm Modern Footer */}
      <footer className="bg-[#FAF7F2] text-neutral-600 pt-16 pb-12 w-full border-t border-[#EAE6DF]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5 text-[#FF5B00]" />
                </div>
                <span className="text-xl font-black text-[#111827] tracking-tight">
                  Adhikar<span className="text-[#FF5B00]">.</span>
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                {t('footer.tagline')}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FFF4EC] text-[#D9480F] border border-[#FFE2D1]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF5B00] animate-pulse"></span>
                  {currentLang === 'hi' ? 'सभी सरकारी सेवाएं सक्रिय हैं' : 'All Welfare Systems Operational'}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">
                {t('footer.quick_links')}
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link to="/schemes" className="hover:text-[#FF5B00] transition">{t('nav.schemes')}</Link></li>
                <li><Link to="/eligibility" className="hover:text-[#FF5B00] transition">{t('nav.eligibility')}</Link></li>
                <li><Link to="/assistant" className="hover:text-[#FF5B00] transition">{t('nav.assistant')}</Link></li>
                <li><Link to="/documents" className="hover:text-[#FF5B00] transition">{t('nav.documents')}</Link></li>
                <li><Link to="/state-schemes" className="hover:text-[#FF5B00] transition">{t('nav.state_schemes')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">
                {t('footer.citizen_tools')}
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link to="/calculator" className="hover:text-[#FF5B00] transition">{t('nav.calculator')}</Link></li>
                <li><Link to="/family" className="hover:text-[#FF5B00] transition">{t('nav.family')}</Link></li>
                <li><Link to="/grievance" className="hover:text-[#FF5B00] transition">{t('nav.grievances')}</Link></li>
                <li><Link to="/timeline" className="hover:text-[#FF5B00] transition">{t('nav.timeline')}</Link></li>
                <li><Link to="/impact" className="hover:text-[#FF5B00] transition">{t('nav.impact')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">
                {t('footer.governance')}
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li className="text-neutral-700 font-semibold">{currentLang === 'hi' ? 'राष्ट्रीय टोल-फ्री हेल्पलाइन:' : 'National Toll-Free Helpline:'}</li>
                <li className="text-[#111827] font-mono text-sm font-bold">1800-11-0000</li>
                <li className="text-neutral-700 font-semibold pt-2">{currentLang === 'hi' ? 'नागरिक सहायता ईमेल:' : 'Official Citizen Email:'}</li>
                <li className="text-neutral-500 font-mono text-xs">support@adhikar-platform.in</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#EAE6DF] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
            <p>&copy; {new Date().getFullYear()} Adhikar. {t('footer.rights')}</p>
            <div className="flex gap-6 font-medium">
              <Link to="/about" className="hover:text-[#111827] transition">Privacy</Link>
              <Link to="/about" className="hover:text-[#111827] transition">Terms</Link>
              <Link to="/about" className="hover:text-[#111827] transition">Security</Link>
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
