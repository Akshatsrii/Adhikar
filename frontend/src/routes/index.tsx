import { Link, createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { ParticleNetwork } from "@designcodeio/threeui"
import "@designcodeio/threeui/style.css"

export const Route = createFileRoute('/')({
  component: LandingPage,
})

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

function LandingPage() {
  const { user } = useAuth()
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative min-h-screen w-full font-sans">
      {/* 3D Animated Background */}
      <div className="fixed inset-0 z-0">
        <ParticleNetwork />
      </div>
      
      {/* Light overlay to ensure text readability against the 3D background */}
      <div className="fixed inset-0 z-0 bg-black/70"></div>

      <div className="relative z-10">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2">
              <ShieldMark className="w-8 h-8" />
              <span className="font-display text-2xl font-bold text-white tracking-tight">Adhikar</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
              <a href="#about-us" className="hover:text-white transition">About Us</a>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-white hover:text-gray-300 transition">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm !px-5 !py-2 shadow-md hover:shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6">
          {/* HERO SECTION */}
          <section className="grid min-h-[calc(100vh-80px)] items-center gap-12 py-20 lg:grid-cols-[1fr_400px]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-[var(--color-saffron-light)] shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-saffron)] opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-saffron)]"></span>
                </span>
                Live • Over 50+ central & state schemes
              </div>
              
              <h1 className="font-display text-5xl leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl">
                Claim your <span className="text-[var(--color-saffron)]">Adhikar.</span>
                <br />
                Without the red tape.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                Adhikar reads your profile and life events, matches you against verified
                government schemes with a transparent rule engine, and catches paperwork
                mistakes before you even submit them.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary text-lg !px-8 !py-3.5 shadow-md hover:shadow-lg">
                  Check my eligibility ➔
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-8 py-3.5 text-lg font-medium text-white transition hover:bg-white/20 backdrop-blur-md"
                >
                  Log in
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-gray-300 font-medium">
                <span className="flex items-center gap-1">✓ 100% Deterministic Engine</span>
                <span className="flex items-center gap-1">✓ Family-level matching</span>
              </div>
            </div>

            {/* HERO IMAGE/CARD */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0">
               <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-[var(--color-saffron-light)]/20 to-transparent blur-2xl"></div>
               <div className="relative flex flex-col gap-5 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl p-8">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-5">
                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900/50 text-2xl">
                        👨‍👩‍👧‍👦
                     </div>
                     <div>
                        <h3 className="font-display text-lg font-bold text-white">Family Evaluated</h3>
                        <p className="text-sm text-green-400 font-medium">4 members checked</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="rounded-lg border border-green-200/20 bg-green-900/30 p-3">
                        <p className="text-xs font-bold text-green-400 uppercase tracking-wide">Match Found</p>
                        <p className="mt-1 font-medium text-white">PM Awas Yojana (PMAY)</p>
                        <p className="text-sm text-green-300">Eligible based on Income & State.</p>
                     </div>
                     <div className="rounded-lg border border-amber-200/20 bg-amber-900/30 p-3">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">Missing Document</p>
                        <p className="mt-1 font-medium text-white">Ayushman Bharat</p>
                        <p className="text-sm text-amber-400">Ration card copy required.</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* FEATURE GRID */}
          <section id="features" className="py-24 border-t border-white/10">
            <div className="mb-16 text-center">
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">Why Adhikar is different</h2>
              <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">Traditional platforms just show you PDFs. Adhikar understands the rules and does the math for your entire family.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
               <div className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-md p-8 hover:bg-white/5 transition shadow-lg">
                  <div className="text-5xl mb-6">🧮</div>
                  <h3 className="font-bold text-xl text-white mb-3">Deterministic Engine</h3>
                  <p className="text-base leading-relaxed text-gray-300">
                     We never guess. Every scheme has strict mathematical rules (e.g. Income &lt; ,13L). If you pass, we show you exactly why. No hallucinations.
                  </p>
               </div>
               
               <div className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-md p-8 hover:bg-white/5 transition shadow-lg">
                  <div className="text-5xl mb-6">🏠</div>
                  <h3 className="font-bold text-xl text-white mb-3">Family Optimizer</h3>
                  <p className="text-base leading-relaxed text-gray-300">
                     Add your spouse and kids. We find the best mutually exclusive benefits for the whole family, resolving conflicts automatically.
                  </p>
               </div>
               
               <div className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-md p-8 hover:bg-white/5 transition shadow-lg">
                  <div className="text-5xl mb-6">🛡️</div>
                  <h3 className="font-bold text-xl text-white mb-3">DBT Mistake Catcher</h3>
                  <p className="text-base leading-relaxed text-gray-300">
                     Using fuzzy name matching and document analysis, we catch application errors before they result in a painful rejection from the government.
                  </p>
               </div>
            </div>
          </section>

          {/* ABOUT US SECTION */}
          <section id="how-it-works" className="py-24 border-t border-white/10">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <div className="order-2 md:order-1 relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl"></div>
                <div className="relative rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md p-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-saffron)] text-white font-bold">1</div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Create your profile</h4>
                        <p className="text-gray-400 mt-1">Enter your basic details, income, and education.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-saffron)] text-white font-bold">2</div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Instant Evaluation</h4>
                        <p className="text-gray-400 mt-1">Our deterministic engine checks 50+ schemes instantly.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-saffron)] text-white font-bold">3</div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Apply with Confidence</h4>
                        <p className="text-gray-400 mt-1">Get a step-by-step checklist of documents needed to guarantee approval.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="about-us" className="order-1 md:order-2">
                <h2 className="font-display text-4xl font-bold text-white md:text-5xl">Our Mission</h2>
                <p className="mt-6 text-lg leading-relaxed text-gray-300">
                  Millions of citizens miss out on life-changing government benefits because they simply don't know they are eligible, or because the paperwork is too complex. 
                </p>
                <p className="mt-4 text-lg leading-relaxed text-gray-300">
                  Adhikar was built to bridge this gap. By combining the precision of deterministic rule engines with the accessibility of modern AI, we ensure that every citizen can claim their rights without relying on middlemen.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-black/60 backdrop-blur-md py-12 mt-12">
          <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <ShieldMark className="w-6 h-6" />
                <span className="font-display text-xl font-bold text-white">Adhikar</span>
              </div>
              <p className="mt-4 text-sm text-gray-400 max-w-sm">
                Empowering the citizens of India by making government schemes transparent, accessible, and deterministic.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/register" className="hover:text-[var(--color-saffron-light)]">Eligibility Check</Link></li>
                <li><Link to="/register" className="hover:text-[var(--color-saffron-light)]">Scheme Directory</Link></li>
                <li><Link to="/register" className="hover:text-[var(--color-saffron-light)]">Family Optimizer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[var(--color-saffron-light)]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[var(--color-saffron-light)]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-6 mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Adhikar. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}
