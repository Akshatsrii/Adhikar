import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Newspaper,
  ExternalLink,
  BookmarkPlus,
  BookmarkCheck,
  TrendingUp,
  Clock,
  Tag,
  Globe,
  ChevronRight,
  Rss,
  Filter,
  Search,
  Bell,
  AlertCircle,
} from 'lucide-react'

export const Route = createFileRoute('/news')({
  component: WelfareNewsFeed,
})

type Sentiment = 'positive' | 'neutral' | 'urgent'

interface NewsItem {
  id: number
  title: string
  summary: string
  category: string
  source: string
  date: string
  sentiment: Sentiment
  url: string
  isBreaking?: boolean
  readTime?: string
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: 'PM-KISAN 18th Installment: ₹20,000 Crore Released to 9.8 Crore Farmers',
    summary:
      'Prime Minister Modi directly transferred the 18th installment of PM-KISAN Samman Nidhi to 9.8 crore farmers via DBT on Oct 5, 2026. Each eligible farmer received ₹2,000 directly in their Aadhaar-seeded bank accounts. Farmers with pending e-KYC are urged to complete verification at pmkisan.gov.in or nearest CSC center.',
    category: 'Agriculture',
    source: 'Ministry of Agriculture & Farmers Welfare',
    date: 'Oct 5, 2026',
    sentiment: 'positive',
    url: 'https://pmkisan.gov.in',
    isBreaking: true,
    readTime: '3 min',
  },
  {
    id: 2,
    title: 'Ayushman Bharat 2.0: Coverage Extended to 10 Crore Additional Families',
    summary:
      'The Union Cabinet approved an expansion of Ayushman Bharat PMJAY to include all families with annual income below ₹5 lakh. The new phase targets migrant workers, urban poor, and gram panchayat employees previously excluded. Cards can be generated instantly at Common Service Centers using Aadhaar OTP.',
    category: 'Healthcare',
    source: 'National Health Authority',
    date: 'Oct 10, 2026',
    sentiment: 'positive',
    url: 'https://pmjay.gov.in',
    readTime: '4 min',
  },
  {
    id: 3,
    title: 'MGNREGA FY 2026–27: Wages Hiked 8% — Highest in Five States Including UP & Bihar',
    summary:
      'The Ministry of Rural Development notified revised MGNREGA daily wage rates for FY 2026–27 effective October 1, 2026. Uttar Pradesh sees highest absolute wage at ₹281/day (+8.9%), Bihar at ₹272/day (+8.4%). Workers must update their Aadhaar-bank linkage through NPCI mapper to receive revised wages without delay.',
    category: 'Employment',
    source: 'Ministry of Rural Development',
    date: 'Oct 3, 2026',
    sentiment: 'positive',
    url: 'https://nrega.nic.in',
    readTime: '3 min',
  },
  {
    id: 4,
    title: 'PMAY-U 2.0 Final Deadline: Nov 30, 2026 — 22 Lakh Applications Still Incomplete',
    summary:
      'MoHUA has issued a final notice that 22 lakh incomplete PMAY Urban 2.0 applications will be rejected if not completed by November 30, 2026. Applicants must upload income certificate, Aadhaar card, and land ownership proof. State-wise status can be checked at pmaymis.gov.in.',
    category: 'Housing',
    source: 'Ministry of Housing & Urban Affairs',
    date: 'Oct 12, 2026',
    sentiment: 'urgent',
    url: 'https://pmaymis.gov.in',
    readTime: '2 min',
  },
  {
    id: 5,
    title: 'National Scholarship Portal 2026–27 Opens — ₹3,200 Crore for 2.1 Crore Students',
    summary:
      'The National Scholarship Portal has opened applications for AY 2026–27 across 50+ central scholarship schemes. Pre-Matric, Post-Matric, Merit-cum-Means, and top class scholarships are included. The deadline is December 31, 2026, with no extensions expected. Bank accounts must be Aadhaar-seeded for DBT.',
    category: 'Education',
    source: 'Department of School Education & Literacy',
    date: 'Oct 8, 2026',
    sentiment: 'positive',
    url: 'https://scholarships.gov.in',
    readTime: '4 min',
  },
  {
    id: 6,
    title: 'e-Shram: 33 Crore Unorganised Workers Registered — Free Insurance Now Active',
    summary:
      'The e-Shram portal has crossed 33 crore registered workers, providing ₹2 lakh accidental death cover and ₹1 lakh partial disability cover free of cost. Registered workers also get priority access to MGNREGA, PMAY, and food security schemes. Workers who haven\'t registered can do so at eshram.gov.in or any CSC.',
    category: 'Employment',
    source: 'Ministry of Labour & Employment',
    date: 'Oct 1, 2026',
    sentiment: 'positive',
    url: 'https://eshram.gov.in',
    readTime: '3 min',
  },
  {
    id: 7,
    title: 'Sukanya Samriddhi Yojana Rate Maintained at 8.2% — Q3 FY27 Notification',
    summary:
      'Ministry of Finance has maintained the Sukanya Samriddhi Yojana interest rate at 8.2% for Q3 FY27 (Oct–Dec 2026). This makes SSY the highest interest-bearing small savings instrument. Parents of girl children below 10 years can open accounts at post offices and authorised bank branches. Minimum deposit: ₹250 per year.',
    category: 'Women & Child',
    source: 'Ministry of Finance',
    date: 'Sep 30, 2026',
    sentiment: 'neutral',
    url: 'https://nsiindia.gov.in',
    readTime: '2 min',
  },
  {
    id: 8,
    title: 'Digital Ration Card: 94% Aadhaar Seeding — One Nation One Ration Card Expands',
    summary:
      'DFPD reports 94% Aadhaar seeding under NFSA, enabling full One Nation One Ration Card portability across 36 states and UTs. Migrant workers can now access their monthly food grain quota at any PDS shop nationwide. Remaining 6% beneficiaries must link urgently to avoid ration card deactivation.',
    category: 'Food Security',
    source: 'Department of Food & Public Distribution',
    date: 'Sep 27, 2026',
    sentiment: 'neutral',
    url: 'https://dfpd.gov.in',
    readTime: '3 min',
  },
  {
    id: 9,
    title: 'PM Vishwakarma Yojana: 50 Lakh Artisans Get Tool Kits and ₹15,000 Credit',
    summary:
      'The PM Vishwakarma Yojana marks its first anniversary with 50 lakh artisans across 18 traditional trades enrolled. Each beneficiary receives a ₹15,000 advanced toolkit, free skill training, and collateral-free credit at 5% interest up to ₹3 lakh. Applications open at pmvishwakarma.gov.in.',
    category: 'Employment',
    source: 'Ministry of MSME',
    date: 'Sep 17, 2026',
    sentiment: 'positive',
    url: 'https://pmvishwakarma.gov.in',
    readTime: '3 min',
  },
  {
    id: 10,
    title: 'Atal Pension Yojana: Enrolment Deadline Alert — Only December 2026 Remaining',
    summary:
      'Citizens below 40 years working in the unorganised sector can join Atal Pension Yojana (APY) to get guaranteed monthly pension of ₹1,000–₹5,000. Government contributes 50% of contribution for new enrollees from Jan Dhan accounts. The scheme is co-administered by PFRDA via all nationalised banks.',
    category: 'Social Welfare',
    source: 'Pension Fund Regulatory and Development Authority',
    date: 'Sep 14, 2026',
    sentiment: 'urgent',
    url: 'https://npscra.nsdl.co.in',
    readTime: '2 min',
  },
  {
    id: 11,
    title: 'PM PVTG Development Mission: ₹24,000 Crore Approved for 75 Tribal Groups',
    summary:
      'Cabinet approves ₹24,000 crore over 3 years under the PM PVTG (Particularly Vulnerable Tribal Groups) Development Mission. Benefits include housing, clean drinking water, electricity, education, and healthcare for 75 most marginalized tribal communities across 18 states.',
    category: 'Social Welfare',
    source: 'Ministry of Tribal Affairs',
    date: 'Sep 10, 2026',
    sentiment: 'positive',
    url: 'https://tribal.nic.in',
    readTime: '4 min',
  },
  {
    id: 12,
    title: 'Jan Dhan Accounts Cross 54 Crore — ₹2.37 Lakh Crore in Deposits',
    summary:
      'PMJDY has achieved a new milestone with 54 crore accounts, including 30.5 crore held by women. Total deposits stand at ₹2.37 lakh crore. All Jan Dhan accounts have a RuPay debit card and ₹2 lakh accident insurance. Zero-balance accounts can still be opened at any nationalized or regional rural bank.',
    category: 'Social Welfare',
    source: 'Department of Financial Services',
    date: 'Sep 7, 2026',
    sentiment: 'positive',
    url: 'https://pmjdy.gov.in',
    readTime: '3 min',
  },
]

const sentimentConfig: Record<Sentiment, { label: string; className: string; dot: string }> = {
  positive: { label: 'Positive', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  neutral: { label: 'Update', className: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  urgent: { label: 'Urgent', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
}

const categoryColors: Record<string, string> = {
  Agriculture: 'bg-emerald-100 text-emerald-800',
  Healthcare: 'bg-rose-100 text-rose-800',
  Employment: 'bg-blue-100 text-blue-800',
  Housing: 'bg-amber-100 text-amber-800',
  Education: 'bg-indigo-100 text-indigo-800',
  'Women & Child': 'bg-pink-100 text-pink-800',
  'Food Security': 'bg-orange-100 text-orange-800',
  'Social Welfare': 'bg-violet-100 text-violet-800',
}

export default function WelfareNewsFeed() {
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set())
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [activeSentiment, setActiveSentiment] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = ['All', ...Array.from(new Set(mockNews.map(n => n.category)))]
  const sentiments = ['All', 'positive', 'neutral', 'urgent']

  const filtered = mockNews.filter(n => {
    const catMatch = activeFilter === 'All' || n.category === activeFilter
    const sentMatch = activeSentiment === 'All' || n.sentiment === activeSentiment
    const searchMatch =
      searchQuery.trim() === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.source.toLowerCase().includes(searchQuery.toLowerCase())
    return catMatch && sentMatch && searchMatch
  })

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const breakingNews = mockNews.find(n => n.isBreaking)
  const urgentCount = mockNews.filter(n => n.sentiment === 'urgent').length

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
            <Rss className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400">LIVE FEED</span>
            <span>·</span>
            <span>Updated daily from official government portals</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Welfare Scheme News</h1>
          <p className="text-slate-400 text-base max-w-2xl mb-6">
            Latest updates, policy announcements, deadline alerts, and new scheme launches — curated from official government portals.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search news (e.g. PM-KISAN, Ayushman, Housing...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-white/40 focus:ring-4 focus:ring-white/10 transition font-medium"
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-6 flex flex-wrap gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Newspaper className="w-3.5 h-3.5" /> {mockNews.length} articles this month</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><TrendingUp className="w-3.5 h-3.5" /> {mockNews.filter(n => n.sentiment === 'positive').length} positive scheme updates</span>
            <span className="flex items-center gap-1.5 text-amber-400"><AlertCircle className="w-3.5 h-3.5" /> {urgentCount} urgent deadlines</span>
            <span className="flex items-center gap-1.5 text-blue-400"><Bell className="w-3.5 h-3.5" /> {bookmarked.size} bookmarked</span>
          </div>
        </div>
      </section>

      {/* Breaking News Banner */}
      {breakingNews && (
        <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm font-semibold">
            <span className="bg-white text-rose-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0">
              BREAKING
            </span>
            <span className="truncate">{breakingNews.title}</span>
            <a href={breakingNews.url} target="_blank" rel="noreferrer" className="ml-auto flex-shrink-0 flex items-center gap-1 text-white/80 hover:text-white">
              Read <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:ml-auto">
            {sentiments.map(s => {
              const cfg = s === 'All' ? null : sentimentConfig[s as Sentiment]
              return (
                <button
                  key={s}
                  onClick={() => setActiveSentiment(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                    activeSentiment === s
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                  {s === 'All' ? 'All Types' : cfg?.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" />
            <span>
              {filtered.length} of {mockNews.length} articles
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>{bookmarked.size} bookmarked</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Feature Article — first card spans 2 columns on large screen */}
          {filtered.length > 0 && (
            <article className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col overflow-hidden">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 h-40 flex items-end p-5 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,white,transparent)]" />
                <div className="relative z-10 flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${categoryColors[filtered[0].category] || 'bg-slate-100 text-slate-700'}`}>
                    <Tag className="w-3 h-3 inline mr-1" />{filtered[0].category}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${sentimentConfig[filtered[0].sentiment].className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sentimentConfig[filtered[0].sentiment].dot}`} />
                    {sentimentConfig[filtered[0].sentiment].label}
                  </span>
                  {filtered[0].isBreaking && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">Breaking</span>
                  )}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-base font-black text-slate-900 leading-snug mb-3 group-hover:text-blue-700 transition-colors">
                  {filtered[0].title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-3">{filtered[0].summary}</p>
                <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1"><Globe className="w-3 h-3" /><span>{filtered[0].source}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{filtered[0].date}</span></div>
                    {filtered[0].readTime && <span>{filtered[0].readTime} read</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmark(filtered[0].id)}
                      className={`p-1.5 rounded-lg transition ${bookmarked.has(filtered[0].id) ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`}
                    >
                      {bookmarked.has(filtered[0].id) ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    </button>
                    <a href={filtered[0].url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition">
                      Official Source <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Remaining Cards */}
          {filtered.slice(1).map(article => {
            const sentCfg = sentimentConfig[article.sentiment]
            const catColor = categoryColors[article.category] || 'bg-slate-100 text-slate-700'
            const isBookmarked = bookmarked.has(article.id)
            return (
              <article
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${catColor}`}>
                        <Tag className="w-3 h-3 inline mr-1" />
                        {article.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${sentCfg.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sentCfg.dot}`} />
                        {sentCfg.label}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      className={`p-1.5 rounded-lg transition ${isBookmarked ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{article.summary}</p>
                </div>

                <div className="px-5 pb-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span className="max-w-[100px] truncate">{article.source}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    Official <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-semibold text-slate-700 mb-1">No articles match your filters</p>
            <p className="text-sm">Try adjusting the category filter, sentiment type, or your search query.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 rounded-3xl p-8 text-white text-center shadow-xl">
          <Bell className="w-8 h-8 mx-auto mb-3 opacity-80" />
          <h2 className="text-xl font-black mb-2">Never Miss a Welfare Update</h2>
          <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
            Get instant alerts when new schemes launch or existing benefits are revised — directly to your phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="tel"
              placeholder="Your mobile number"
              className="flex-1 bg-white/15 border border-white/25 text-white placeholder:text-blue-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/50 font-medium"
            />
            <button className="bg-white text-blue-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition shadow-sm whitespace-nowrap">
              Get Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
