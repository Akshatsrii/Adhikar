import { Outlet, Link, createRootRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Search, ChevronDown, User } from 'lucide-react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { user, logout } = useAuth()
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans text-gray-800 flex flex-col">
      {/* 1. TOP BAR (Thin) */}
      <div className="bg-[#f1f1f1] border-b border-gray-200 text-[11px] font-medium py-1.5 px-4 md:px-8 flex justify-between items-center text-gray-700">
        <div className="flex items-center gap-2">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png" className="h-4" alt="Emblem" />
          <span>भारत सरकार | Government of India</span>
        </div>
        <div className="flex items-center gap-4 divide-x divide-gray-300">
          <a href="#main" className="hover:text-blue-600 transition">Skip to main content</a>
          <a href="#" className="pl-4 hover:text-blue-600 transition">Screen Reader Access</a>
          <div className="pl-4 flex gap-2">
            <button className="hover:text-blue-600">A-</button>
            <button className="hover:text-blue-600">A</button>
            <button className="hover:text-blue-600">A+</button>
          </div>
          <div className="pl-4 flex gap-2">
            <button onClick={() => changeLanguage('hi')} className={i18n.language === 'hi' ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>हिंदी</button>
            <span className="px-1">|</span>
            <button onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'text-blue-700 font-bold' : 'hover:text-blue-600'}>English</button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="bg-white py-3 px-4 md:px-8 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-10 h-10">
              <path d="M10,80 C30,30 60,10 90,20 C70,70 30,90 10,80 Z" fill="#FF9933" />
              <path d="M10,80 C40,40 70,30 90,50 C60,80 30,95 10,80 Z" fill="#FFFFFF" />
              <path d="M10,80 C50,60 80,50 90,80 C50,90 20,100 10,80 Z" fill="#138808" />
            </svg>
            <div>
              <h1 className="text-xl font-bold text-[#00428a] tracking-tight leading-none uppercase">Adhikar</h1>
              <p className="text-[10px] text-gray-500 font-medium leading-tight">आपका अधिकार, हमारी सहायता<br/>AI Government Scheme Navigator</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="flex w-full shadow-sm rounded-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search schemes, services, or ask a question..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-[#00428a] text-sm" />
            </div>
            <button className="bg-[#00428a] text-white px-5 rounded-r-md hover:bg-blue-800 transition">
               <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 border-r border-gray-200 pr-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Digital_India_logo.svg" alt="Digital India" className="h-8 opacity-90" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/4/43/G20_India_2023_logo.svg" alt="G20" className="h-8 opacity-90" />
          </div>
          {!user ? (
            <Link to="/login" className="bg-[#00428a] text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-blue-800 transition flex items-center gap-2 shadow-sm">
              <User className="w-4 h-4" /> Login / Register
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col text-right">
                 <span className="text-sm font-bold text-[#00428a] leading-none">{user.name}</span>
                 <button onClick={logout} className="text-xs text-red-500 hover:underline">Logout</button>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#00428a] font-bold">
                 {user.name[0]}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 3. NAVIGATION BAR (Blue) */}
      <nav className="bg-[#00428a] text-white px-4 md:px-8 text-sm font-medium relative z-10 shadow-md">
        <ul className="flex items-center space-x-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <li><Link to="/" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">Home</Link></li>
          <li><Link to="/about" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">About Adhikar</Link></li>
          <li><Link to="/schemes" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">Government Schemes <ChevronDown className="w-3 h-3"/></Link></li>
          <li><Link to="/eligibility" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">Check Eligibility</Link></li>
          <li><Link to="/apply" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">Apply Online</Link></li>
          <li><Link to="/assistant" className="inline-block px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">AI Assistant</Link></li>
          <li><Link to="/documents" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">Documents <ChevronDown className="w-3 h-3"/></Link></li>
          <li><Link to="/state-schemes" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">State Schemes <ChevronDown className="w-3 h-3"/></Link></li>
          <li><Link to="/contact" className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] [&.active]:bg-[#003370] transition">Help & Support <ChevronDown className="w-3 h-3"/></Link></li>
        </ul>
      </nav>

      <main id="main" className="flex-1 flex flex-col relative w-full pb-12">
        <Outlet />
      </main>
    </div>
  )
}
