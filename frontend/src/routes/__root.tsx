import { createRootRoute, Outlet, Link, useNavigate, useLocation } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { user, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="min-h-screen bg-[var(--color-parchment)] font-sans">
      
      {/* 1. THIN TOP BAR (Gray) */}
      <div className="bg-[#f1f1f1] border-b border-gray-200 text-[11px] font-medium text-gray-700 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/images/emblem.svg" className="h-4" alt="Emblem" />
            <span>{t('header.govt')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline hover:underline cursor-pointer">{t('header.skip')}</span>
            <span className="hidden sm:inline hover:underline cursor-pointer border-r border-gray-300 pr-4">{t('header.screen_reader')}</span>
            <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
              <button className="hover:bg-gray-200 px-1 rounded">A-</button>
              <button className="hover:bg-gray-200 px-1 rounded">A</button>
              <button className="hover:bg-gray-200 px-1 rounded">A+</button>
            </div>
            <div className="flex items-center gap-2 font-bold">
              <button onClick={() => changeLanguage('hi')} className={i18n.language === 'hi' ? 'text-blue-800' : 'hover:text-blue-600'}>हिन्दी</button>
              <span className="text-gray-400">|</span>
              <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'text-blue-800' : 'hover:text-blue-600'}>English</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (White) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-1 rounded-full shadow-sm flex items-center justify-center shrink-0">
               <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                 <div className="w-6 h-6 border-2 border-[#000080] rounded-full flex items-center justify-center">
                   <div className="w-1 h-4 bg-[#000080] transform rotate-45"></div>
                   <div className="w-1 h-4 bg-[#000080] transform -rotate-45 absolute"></div>
                 </div>
               </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#00428a] tracking-tight leading-none group-hover:text-blue-800 transition">{t('header.title')}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{t('header.subtitle')}</span>
              <span className="text-[10px] text-gray-400">{t('header.desc')}</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 border-r border-gray-200 pr-4">
               <img src="/images/digital-india.svg" alt="Digital India" className="h-8 opacity-90" />
            </div>
            {!user ? (
              <Link to="/login" className="bg-[#00428a] text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-blue-800 transition flex items-center gap-2 shadow-sm">
                {t('header.login')}
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right">
                   <span className="text-sm font-bold text-[#00428a] leading-none">{user.name}</span>
                   <button onClick={logout} className="text-xs text-red-500 hover:underline">{t('header.logout')}</button>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#00428a] font-bold">
                   {user.name[0]}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. NAVIGATION (Blue) */}
      <div className="bg-[#00428a] text-white text-sm font-bold shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ul className="flex items-center overflow-x-auto scrollbar-hide -mx-4 md:mx-0">
            <li><Link to="/" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.home')}</Link></li>
            <li><Link to="/about" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.about')}</Link></li>
            <li><Link to="/schemes" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.schemes')} <ChevronDown className="w-3 h-3"/></Link></li>
            <li><Link to="/eligibility" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.eligibility')}</Link></li>
            <li><Link to="/apply/$slug" params={{ slug: 'post-matric-scholarship' }} className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.apply')}</Link></li>
            <li><Link to="/assistant" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.assistant')}</Link></li>
            <li><Link to="/documents" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.documents')} <ChevronDown className="w-3 h-3"/></Link></li>
            <li><Link to="/state-schemes" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.state_schemes')} <ChevronDown className="w-3 h-3"/></Link></li>
            <li><Link to="/contact" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">{t('nav.help')} <ChevronDown className="w-3 h-3"/></Link></li>
          </ul>
        </div>
      </div>

      <main id="main" className="flex-1 flex flex-col relative w-full pb-12">
        <Outlet />
      </main>
    
      <footer className="bg-[#1e293b] text-white pt-12 pb-8 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white p-1 rounded-full flex items-center justify-center shrink-0">
                   <img src="/images/emblem.svg" className="h-full object-contain" alt="Emblem" />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight leading-none">Adhikar</span>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Govt of India</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Adhikar is a centralized AI-powered platform for citizens to discover, understand, and apply for government schemes effortlessly.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/schemes" className="hover:text-white transition">All Schemes</Link></li>
                <li><Link to="/eligibility" className="hover:text-white transition">Check Eligibility</Link></li>
                <li><Link to="/assistant" className="hover:text-white transition">Adhikar AI Chat</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Terms & Conditions</Link></li>
                <li><Link to="/" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition">Copyright Policy</Link></li>
                <li><Link to="/" className="hover:text-white transition">Disclaimer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Helpline: 1800-11-0000</li>
                <li>Email: support@adhikar.gov.in</li>
                <li className="mt-4">
                  <img src="/images/digital-india.svg" alt="Digital India" className="h-8 opacity-80" />
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Adhikar. Designed and Developed by NIC.</p>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
