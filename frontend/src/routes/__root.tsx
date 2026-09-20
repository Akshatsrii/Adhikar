import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user) {
    // PUBLIC LAYOUT (Landing, Login, Register)
    return (
      <div className="min-h-screen bg-[var(--color-parchment)] font-sans">
        <header className="border-b border-[var(--color-line)] bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-3">
              <ShieldMark />
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                Adhikar
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-saffron-deep)] transition">
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
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-white [&.active]:text-[var(--color-saffron-deep)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
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
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-white [&.active]:text-[var(--color-saffron-deep)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {user.role === 'admin' && (
              <>
                <Link
                  to="/admin/regulatory"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-white [&.active]:text-[var(--color-govgreen)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
                >
                  <span>⚖️</span>
                  Regulatory Admin
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-parchment-dim)] hover:text-[var(--color-ink)] [&.active]:bg-white [&.active]:text-[var(--color-govgreen)] [&.active]:shadow-sm [&.active]:border [&.active]:border-[var(--color-line)]"
                >
                  <span>⚙️</span>
                  Admin Dashboard
                </Link>
              </>
            )}
          </nav>
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

      {/* MOBILE HEADER */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-line)] bg-white/40 px-4 md:hidden">
          <div className="flex items-center gap-2">
            <ShieldMark className="w-6 h-6" />
            <span className="font-display text-lg font-bold text-[var(--color-ink)]">Adhikar</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md border border-[var(--color-line)] p-2 text-[var(--color-ink-soft)]"
          >
            {isMobileMenuOpen ? '✖' : '☰'}
          </button>
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
