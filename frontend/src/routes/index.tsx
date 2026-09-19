import { Link, createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

import { ParticleNetwork } from "@designcodeio/threeui"
import "@designcodeio/threeui/style.css"

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { user } = useAuth()
  
  if (user) {
    // If already logged in, no need to see landing page
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* 3D Animated Background */}
      <div className="fixed inset-0 z-0">
        <ParticleNetwork />
      </div>
      
      {/* Light overlay to ensure text readability against the 3D background */}
      <div className="fixed inset-0 z-0 bg-white/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 grid gap-20 pb-20 pt-10">
        {/* HERO SECTION */}
      <section className="grid items-center gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/60 px-4 py-1.5 text-sm font-medium text-[var(--color-saffron-deep)] shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-saffron)] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-saffron)]"></span>
            </span>
            Live • Over 50+ central & state schemes
          </div>
          
          <h1 className="font-display text-5xl leading-[1.15] tracking-tight text-[var(--color-ink)] md:text-6xl lg:text-7xl">
            Claim your <span className="text-[var(--color-saffron)]">Adhikar.</span>
            <br />
            Without the red tape.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
            Adhikar reads your profile and life events, matches you against verified
            government schemes with a transparent rule engine, and catches paperwork
            mistakes before you even submit them.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary text-lg !px-8 !py-3.5 shadow-md hover:shadow-lg">
              Check my eligibility ↗
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md border-2 border-[var(--color-line)] bg-white/50 px-8 py-3.5 text-lg font-medium text-[var(--color-ink)] transition hover:border-[var(--color-saffron)] hover:bg-white"
            >
              Log in
            </Link>
          </div>
          
          <div className="mt-10 flex items-center gap-4 text-sm text-[var(--color-ink-soft)] font-medium">
            <span className="flex items-center gap-1">✅ 100% Deterministic Engine</span>
            <span className="flex items-center gap-1">✅ Family-level matching</span>
          </div>
        </div>

        {/* HERO IMAGE/CARD */}
        <div className="relative mx-auto w-full max-w-md lg:mx-0">
           <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-[var(--color-saffron-light)]/20 to-transparent blur-2xl"></div>
           <div className="card relative flex flex-col gap-5 border-2 border-[var(--color-line)] bg-white/90 shadow-xl p-8">
              <div className="flex items-center gap-4 border-b border-[var(--color-line)] pb-5">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
                    👨‍👩‍👧‍👦
                 </div>
                 <div>
                    <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">Family Evaluated</h3>
                    <p className="text-sm text-[var(--color-govgreen)] font-medium">4 members checked</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="text-xs font-bold text-[var(--color-govgreen)] uppercase tracking-wide">Match Found</p>
                    <p className="mt-1 font-medium text-[var(--color-ink)]">PM Awas Yojana (PMAY)</p>
                    <p className="text-sm text-green-700">Eligible based on Income & State.</p>
                 </div>
                 <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Missing Document</p>
                    <p className="mt-1 font-medium text-[var(--color-ink)]">Ayushman Bharat</p>
                    <p className="text-sm text-amber-700">Ration card copy required.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="mt-10">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-[var(--color-ink)] md:text-4xl">Why Adhikar is different</h2>
          <p className="mt-4 text-[var(--color-ink-soft)] max-w-2xl mx-auto">Traditional platforms just show you PDFs. Adhikar understands the rules and does the math for your entire family.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
           <div className="card hover:shadow-md transition bg-white">
              <div className="text-4xl mb-4">🧮</div>
              <h3 className="font-bold text-lg text-[var(--color-ink)] mb-2">Deterministic Engine</h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                 We never guess. Every scheme has strict mathematical rules (e.g. Income &lt; ₹3L). If you pass, we show you exactly why.
              </p>
           </div>
           
           <div className="card hover:shadow-md transition bg-white">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-bold text-lg text-[var(--color-ink)] mb-2">Family Optimizer</h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                 Add your spouse and kids. We find the best mutually exclusive benefits for the whole family, resolving conflicts automatically.
              </p>
           </div>
           
           <div className="card hover:shadow-md transition bg-white">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-lg text-[var(--color-ink)] mb-2">DBT Mistake Catcher</h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                 Using fuzzy name matching and document analysis, we catch application errors before they result in a painful rejection.
              </p>
           </div>
        </div>
      </section>
    </div>
    </div>
  )
}
