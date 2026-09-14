import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--color-parchment)]">
      <header className="border-b border-[var(--color-line)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <ShieldMark />
            <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-ink)]">
              Adhikar
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-[var(--color-ink-soft)]">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/assistant"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Ask Adhikar
                </Link>
                <Link
                  to="/eligibility"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Eligibility Check
                </Link>
                <Link
                  to="/family"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Family
                </Link>
                <Link
                  to="/life-events"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Life Events
                </Link>
                <Link
                  to="/documents"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Documents
                </Link>
                <Link
                  to="/apply"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Apply
                </Link>
                <Link
                  to="/debugger"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Debugger
                </Link>
                <Link
                  to="/simulator"
                  className="hover:text-[var(--color-ink)]"
                  activeProps={{ className: 'text-[var(--color-ink)] font-medium' }}
                >
                  Simulator
                </Link>
                <span className="text-[var(--color-ink)]">{user.name}</span>
                <button
                  onClick={logout}
                  className="rounded-md border border-[var(--color-line)] px-3 py-1.5 hover:border-[var(--color-saffron)] hover:text-[var(--color-saffron-deep)]"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-[var(--color-ink)]">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary !py-2">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

function ShieldMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
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
