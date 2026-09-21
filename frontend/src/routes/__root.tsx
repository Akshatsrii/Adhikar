import { Outlet, Link, useNavigate, useRouterState, createRootRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  if (!user) {
    // PUBLIC LAYOUT (Landing, Login, Register)
    return (
      <div className="flex min-h-screen flex-col bg-[var(--color-parchment)] font-sans">
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-line)] bg-white/40 dark:bg-black/20 backdrop-blur-md px-6 sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2">
            <ShieldMark className="w-8 h-8" />
            <span className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)] hidden sm:block">
              Adhikar
            </span>
          </Link>
          
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">🔍</span>
              </div>
              <input 
                type="text" 
                placeholder="Search schemes, ask questions or describe your need..." 
                className="w-full pl-10 pr-12 py-2 rounded-full border border-[var(--color-line)] bg-[var(--color-parchment)] text-sm text-[var(--color-ink)] placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">⌘ K</kbd>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <select 
              onChange={(e) => changeLanguage(e.target.value)} 
              value={i18n.language}
              className="text-sm bg-[var(--color-surface)] border border-[var(--color-line)] rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मारवाड़ी</option>
            </select>
            <nav className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 shadow-sm hover:shadow">
                Get started
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-12">
          <Outlet />
        </main>
      </div>
    )
  }

  // APP LAYOUT (Logged In)
  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: '📊' },
    { label: 'Alerts', to: '/notifications', icon: '🔔' },
    { label: 'Ask Adhikar', to: '/assistant', icon: '✨' },
    { label: 'Eligibility', to: '/eligibility', icon: '✓' },
    { label: 'Documents', to: '/documents', icon: '📄' },
    { label: 'Family', to: '/family', icon: '👨‍👩‍👧‍👦' },
    { label: 'Life Events', to: '/life-events', icon: '🎂' },
  ]

  const toolItems = [
    { label: 'Debugger', to: '/debugger', icon: '🔍' },
    { label: 'Simulator', to: '/simulator', icon: '🔮' },
  ]

  return (
    <div className="flex min-h-screen bg-[var(--color-parchment)] font-sans">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden w-64 flex-col border-r border-[var(--color-line)] bg-white/40 md:flex">
        <div className="flex h-16 items-center px-6 border-b border-[var(--color-line)]">
          <Link to="/" className="flex items-center gap-2">
            <ShieldMark className="w-6 h-6" />
            <span className="font-display text-xl font-bold text-[var(--color-ink)]">Adhikar</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)]/60 mb-2">
            Main Menu
          </p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-[var(--color-surface)] [&.active]:text-[var(--color-saffron-deep)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="px-2 text-xs font-bold uppercase tracking-wider text-[var(--color-ink-soft)]/60 mt-8 mb-2">
            Advanced Tools
          </p>
          <nav className="flex flex-col gap-1">
            {toolItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-[var(--color-surface)] [&.active]:text-[var(--color-saffron-deep)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {user.role === 'admin' && (
              <>
                <Link
                  to="/admin/regulatory"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-[var(--color-surface)] [&.active]:text-[var(--color-govgreen)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
                >
                  <span>⚖️</span>
                  Regulatory Admin
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-[var(--color-surface)] [&.active]:text-[var(--color-govgreen)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
                >
                  <span>⚙️</span>
                  Admin Dashboard
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Floating Help Widget */}
        <div className="mx-4 mb-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/50 p-4 text-center">
             <div className="absolute top-0 right-0 -mt-2 -mr-2 text-6xl opacity-10">🤖</div>
             <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-1">Need Help?</h4>
             <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 mb-3">Ask Adhikar AI</p>
             <Link to="/assistant" className="block w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition">
               Start Chat
             </Link>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-line)] flex gap-2">
          <ThemeToggle />
          <select 
            onChange={(e) => changeLanguage(e.target.value)} 
            value={i18n.language}
            className="flex-1 text-sm bg-[var(--color-surface)] border border-[var(--color-line)] rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मारवाड़ी</option>
          </select>
        </div>

        <div className="border-t border-[var(--color-line)] p-4">
          <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 border border-[var(--color-line)]">
            <div className="truncate">
              <p className="truncate text-sm font-semibold text-[var(--color-ink)]">{user.name}</p>
              <p className="truncate text-xs text-[var(--color-ink-soft)]">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="ml-2 text-lg text-[var(--color-ink-soft)] hover:text-[var(--color-saffron-deep)]"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-line)] bg-white/40 dark:bg-black/20 backdrop-blur-md px-6 sticky top-0 z-10">
          
          <div className="flex items-center gap-2 md:hidden">
            <ShieldMark className="w-6 h-6" />
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">🔍</span>
              </div>
              <input 
                type="text" 
                placeholder="Search schemes, ask questions or describe your need..." 
                className="w-full pl-10 pr-12 py-2 rounded-full border border-[var(--color-line)] bg-[var(--color-parchment)] text-sm text-[var(--color-ink)] placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">⌘ K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ThemeToggle />
            
            {/* Notification Bell */}
            <button className="relative p-2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition hidden sm:block">
              <span>🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--color-surface)]"></span>
            </button>
            
            {/* User Dropdown Profile Placeholder */}
            <div className="hidden md:flex items-center gap-2 px-2 py-1 bg-[var(--color-parchment)] rounded-full border border-[var(--color-line)] cursor-pointer hover:bg-[var(--color-parchment-dim)] transition">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                {user.name[0]}
              </div>
              <span className="text-sm font-medium text-[var(--color-ink)] pr-1">{user.name.split(' ')[0]}</span>
              <span className="text-xs text-[var(--color-ink-soft)] pr-1">▼</span>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-md border border-[var(--color-line)] p-2 text-[var(--color-ink-soft)] bg-[var(--color-surface)]"
              >
                {isMobileMenuOpen ? '✖' : '☰'}
              </button>
            </div>
          </div>
        </header>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-20 border-b border-[var(--color-line)] bg-white p-4 shadow-lg md:hidden h-[calc(100vh-4rem)] overflow-y-auto">
             <nav className="flex flex-col gap-2">
                {[...navItems, ...toolItems].map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md p-3 text-base font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-parchment-dim)] [&.active]:bg-[var(--color-parchment)] [&.active]:text-[var(--color-saffron-deep)]"
                  >
                    <span>{item.icon}</span> {item.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-[var(--color-line)] pt-4">
                  <button onClick={logout} className="w-full rounded-md border border-red-200 bg-red-50 p-3 text-left font-medium text-red-700">
                    Log out ({user.name})
                  </button>
                </div>
             </nav>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl p-6 md:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function ShieldMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M120 14 L206 46 V116 C206 172 170 208 120 226 C70 208 34 172 34 116 V46 Z"
        fill="var(--color-saffron)"
        stroke="var(--color-saffron-deep)"
        strokeWidth="6"
      />
      <path
        d="M55 76 L98 122 L165 58"
        fill="none"
        stroke="white"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0, 20) scale(0.85) translate(21, 5)"
      />
    </svg>
  )
}
