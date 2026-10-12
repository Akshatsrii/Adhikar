import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, Megaphone, Laptop, Users, Sparkles, ShieldCheck, Cpu, Database, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const [activeTab, setActiveTab] = useState<'mission' | 'architecture' | 'impact'>('mission')

  const tabs = [
    { id: 'mission', label: 'Platform Mission' },
    { id: 'architecture', label: 'Microservices Architecture' },
    { id: 'impact', label: 'National Impact' },
  ]

  return (
    <div className="w-full bg-slate-50/50 flex-1 flex flex-col font-sans pb-16">
      {/* Top Banner section */}
      <section className="relative bg-slate-950 text-white w-full py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Open Civic Technology for Bharat</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">About Adhikar</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
            Adhikar is a next-generation AI-powered welfare navigation platform bridging the information barrier between 1.4 billion
            Indian citizens and public benefits. Powered by deterministic rule engines and Gemini AI.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex-1 flex flex-col -mt-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-1.5 flex overflow-x-auto scrollbar-hide mb-8 gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[150px] py-2.5 px-4 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/80 p-8 md:p-12 min-h-[400px]">
          {/* TAB 1: MISSION */}
          {activeTab === 'mission' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  Democratizing Access to Government Entitlements
                </h3>
                <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  Every year, thousands of crores in budgeted DBT welfare funds remain unclaimed because citizens don't know they are
                  eligible or get trapped in bureaucratic paperwork. Adhikar removes these hurdles through verified deterministic
                  matching, encrypted DigiLocker storage, and 1-click links to authentic portals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Link
                  to="/schemes"
                  className="bg-slate-50/60 rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-blue-200 transition group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 mb-1">Centralized Catalog</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Real-time indexed repository of 25+ flagship schemes across central and state departments.
                  </p>
                </Link>

                <Link
                  to="/eligibility"
                  className="bg-slate-50/60 rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-emerald-200 transition group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 mb-1">Deterministic Rules</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Strict, audited rule algorithms ensure 0% hallucination on age, income, and state eligibility.
                  </p>
                </Link>

                <Link
                  to="/assistant"
                  className="bg-slate-50/60 rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-violet-200 transition group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 mb-1">Gemini Copilot</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Bilingual natural language assistant guiding citizens step-by-step through required gazettes.
                  </p>
                </Link>

                <Link
                  to="/contact"
                  className="bg-slate-50/60 rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-amber-200 transition group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 mb-1">Direct Redressal</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Integrated grievance logging and escalation to national CPGRAMS channels.
                  </p>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  Modern Polyglot Microservices Stack
                </h3>
                <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  Adhikar is designed for high concurrency, low latency, and zero-downtime scalability utilizing containerized
                  Node.js and Python services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Frontend Layer</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    React 19, TypeScript, TanStack Router with code splitting, Tailwind CSS v4, and Vite PWA architecture.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Backend Core</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Node.js 20 LTS, Express, MongoDB Atlas for profile and scheme catalogs, JWT sessions, and LRU cache.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">AI & Vector Service</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Python FastAPI, Supabase PostgreSQL with pgvector, and Google Gemini 3.8 Flash LLM with fast fallback.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPACT */}
          {activeTab === 'impact' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">Key Civic Metrics</h3>
                <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
                  Real impact realized through transparent discovery and direct application routing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 space-y-1">
                  <div className="text-3xl font-black text-blue-700">₹50,000+ Cr</div>
                  <h4 className="font-bold text-xs text-slate-800">Total Benefits Indexed</h4>
                  <p className="text-[11px] text-slate-500">Across DBT, scholarships, and housing subsides.</p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 space-y-1">
                  <div className="text-3xl font-black text-emerald-700">25+ Flagship</div>
                  <h4 className="font-bold text-xs text-slate-800">Verified Schemes Active</h4>
                  <p className="text-[11px] text-slate-500">From Central Ministries and State Secretariats.</p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 space-y-1">
                  <div className="text-3xl font-black text-violet-700">100% Direct</div>
                  <h4 className="font-bold text-xs text-slate-800">Zero Middlemen Routing</h4>
                  <p className="text-[11px] text-slate-500">Applications route directly to authentic .gov.in domains.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
