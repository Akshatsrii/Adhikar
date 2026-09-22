import { Link, createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Search, ChevronDown, Bot, ArrowRight, FileText, CheckCircle2, User, Phone, Home, Building2, Briefcase, Leaf, Users, HeartPulse, Accessibility, MoreHorizontal, Megaphone } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { user } = useAuth()
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans text-gray-800">
      
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
            <button className="hover:text-blue-600">हिंदी</button>
            <span>|</span>
            <button className="text-blue-700 font-bold">English</button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="bg-white py-3 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                <path d="M10,80 C30,30 60,10 90,20 C70,70 30,90 10,80 Z" fill="#FF9933" />
                <path d="M10,80 C40,40 70,30 90,50 C60,80 30,95 10,80 Z" fill="#FFFFFF" />
                <path d="M10,80 C50,60 80,50 90,80 C50,90 20,100 10,80 Z" fill="#138808" />
              </svg>
              <div>
                <h1 className="text-xl font-bold text-[#00428a] tracking-tight leading-none uppercase">Adhikar</h1>
                <p className="text-[10px] text-gray-500 font-medium leading-tight">आपका अधिकार, हमारी सहायता<br/>AI Government Scheme Navigator</p>
              </div>
            </div>
          </div>
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
          <Link to="/login" className="bg-[#00428a] text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-blue-800 transition flex items-center gap-2 shadow-sm">
            <User className="w-4 h-4" /> Login / Register
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* 3. NAVIGATION BAR (Blue) */}
      <nav className="bg-[#00428a] text-white px-4 md:px-8 text-sm font-medium">
        <ul className="flex items-center space-x-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <li><Link to="/" className="inline-block px-4 py-3 bg-[#003370]">Home</Link></li>
          <li><Link to="/about" className="inline-block px-4 py-3 hover:bg-[#003370] transition">About Adhikar</Link></li>
          <li className="relative group">
            <button className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] transition">Government Schemes <ChevronDown className="w-3 h-3"/></button>
          </li>
          <li><Link to="/eligibility" className="inline-block px-4 py-3 hover:bg-[#003370] transition">Check Eligibility</Link></li>
          <li><Link to="/apply" className="inline-block px-4 py-3 hover:bg-[#003370] transition">Apply Online</Link></li>
          <li><Link to="/assistant" className="inline-block px-4 py-3 hover:bg-[#003370] transition">AI Assistant</Link></li>
          <li className="relative group">
            <button className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] transition">Documents <ChevronDown className="w-3 h-3"/></button>
          </li>
          <li className="relative group">
            <button className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] transition">State Schemes <ChevronDown className="w-3 h-3"/></button>
          </li>
          <li className="relative group">
            <button className="inline-flex items-center gap-1 px-4 py-3 hover:bg-[#003370] transition">Help & Support <ChevronDown className="w-3 h-3"/></button>
          </li>
          <li><Link to="/contact" className="inline-block px-4 py-3 hover:bg-[#003370] transition">Contact Us</Link></li>
        </ul>
      </nav>

      {/* 4. HERO SECTION */}
      <div className="relative bg-[#e6f0fa] w-full h-[380px] overflow-hidden flex items-center">
        {/* Background Image of Parliament / Rashtrapati Bhavan */}
        <div className="absolute right-0 top-0 w-3/4 h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rashtrapati_Bhavan%2C_New_Delhi.jpg/1280px-Rashtrapati_Bhavan%2C_New_Delhi.jpg')] bg-cover bg-center">
           {/* Color overlay to fade into the left blue area */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#e6f0fa] via-[#e6f0fa]/80 to-transparent"></div>
           
           {/* Tricolor swoosh on the right */}
           <svg className="absolute right-0 top-0 h-full w-[400px] opacity-90 hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M100,0 C60,20 40,80 0,100 L100,100 Z" fill="#138808" opacity="0.6"/>
             <path d="M100,0 C70,20 50,80 15,100 L100,100 Z" fill="#FFFFFF" opacity="0.6"/>
             <path d="M100,0 C80,20 60,80 30,100 L100,100 Z" fill="#FF9933" opacity="0.6"/>
           </svg>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-xl">
            <h2 className="text-[2.2rem] font-bold text-[#00428a] leading-[1.1] mb-4">
              Find the Government Schemes<br/>You're Eligible For
            </h2>
            <p className="text-gray-700 mb-8 max-w-[400px] leading-snug font-medium">
              AI-powered guidance to help every citizen access the right schemes, benefits and services.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="bg-[#0056b3] text-white px-6 py-2.5 rounded font-medium hover:bg-blue-800 transition shadow-sm flex items-center gap-2">
                Check My Eligibility <ArrowRight className="w-4 h-4"/>
              </Link>
              <Link to="/assistant" className="bg-white/90 backdrop-blur border border-gray-200 text-[#0056b3] px-6 py-2.5 rounded font-medium hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                <Bot className="w-5 h-5"/> Ask Adhikar AI
              </Link>
            </div>
          </div>
          
          <div className="absolute top-4 right-8 text-right hidden lg:block bg-white/70 backdrop-blur px-3 py-2 rounded shadow-sm border border-white">
            <div className="text-xs font-semibold text-gray-800">"Empowered Citizens</div>
            <div className="text-xs font-semibold text-gray-800">Build a Stronger India"</div>
            <div className="text-[10px] text-green-700 mt-1">— Government of India</div>
          </div>
        </div>
      </div>

      {/* 5. CATEGORIES ROW */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex items-stretch overflow-hidden divide-x divide-gray-100">
          {[
            { icon: <Building2 className="w-6 h-6 text-blue-600"/>, title: 'Education', desc: 'Scholarships, Fee Support' },
            { icon: <Home className="w-6 h-6 text-green-600"/>, title: 'Housing', desc: 'Homes, Rental Support' },
            { icon: <Briefcase className="w-6 h-6 text-red-500"/>, title: 'Employment', desc: 'Jobs, Skill Development' },
            { icon: <Leaf className="w-6 h-6 text-green-700"/>, title: 'Agriculture', desc: 'Farmer Support, Subsidies' },
            { icon: <Users className="w-6 h-6 text-purple-600"/>, title: 'Women', desc: 'Welfare & Empowerment' },
            { icon: <HeartPulse className="w-6 h-6 text-orange-500"/>, title: 'Healthcare', desc: 'Health Insurance, Treatment' },
            { icon: <Users className="w-6 h-6 text-indigo-500"/>, title: 'Senior Citizens', desc: 'Pension, Care & Support' },
            { icon: <Accessibility className="w-6 h-6 text-blue-500"/>, title: 'Divyangjan', desc: 'Accessibility, Assistance' },
            { icon: <MoreHorizontal className="w-6 h-6 text-gray-600"/>, title: 'More Categories', desc: 'Explore All' },
          ].map((cat, i) => (
            <Link key={i} to="/eligibility" className="flex-1 flex flex-col items-center justify-center p-4 hover:bg-blue-50 transition text-center min-w-[120px]">
              <div className="mb-2">{cat.icon}</div>
              <h4 className="font-bold text-gray-900 text-[13px]">{cat.title}</h4>
              <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. LATEST ANNOUNCEMENTS TICKER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="bg-white border border-gray-200 rounded flex items-center overflow-hidden text-sm">
          <div className="bg-[#00428a] text-white px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap shrink-0">
            <Megaphone className="w-4 h-4"/> Latest Announcements
          </div>
          <div className="flex-1 px-4 overflow-hidden relative flex items-center text-gray-700 whitespace-nowrap text-[13px]">
            <span className="inline-flex items-center gap-2">Applications open for Post-Matric Scholarship 2025 <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">New</span></span>
            <span className="mx-4 text-gray-300">|</span>
            <span className="inline-flex items-center gap-2">PM Kisan 20th Installment Released <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">New</span></span>
            <span className="mx-4 text-gray-300">|</span>
            <span>Rajasthan Skill Development Scheme Updated</span>
            <span className="mx-4 text-gray-300">|</span>
            <span>New Housing Scheme Guidelines</span>
          </div>
          <Link to="/announcements" className="px-4 py-2 text-blue-600 font-medium text-xs whitespace-nowrap hover:underline flex items-center gap-1 shrink-0">
            <ArrowRight className="w-3 h-3"/> View All
          </Link>
        </div>
      </div>

      {/* 7. MAIN CONTENT SPLIT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid lg:grid-cols-3 gap-6 pb-16">
        
        {/* Left Side: Popular Schemes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded border border-gray-200 p-6">
            <div className="flex justify-between items-end border-b border-gray-200 pb-3 mb-5">
              <h3 className="text-xl font-bold text-gray-900">Popular Schemes</h3>
              <div className="flex items-center gap-6 text-sm">
                <button className="text-[#00428a] font-bold border-b-2 border-[#00428a] pb-3 -mb-[14px]">Central Schemes</button>
                <button className="text-gray-500 hover:text-gray-900 pb-3">State Schemes</button>
                <button className="text-gray-500 hover:text-gray-900 pb-3">Latest Schemes</button>
                <Link to="/eligibility" className="text-blue-600 font-bold hover:underline flex items-center gap-1 pb-3">View All <ArrowRight className="w-3 h-3"/></Link>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=400&auto=format&fit=crop', tag: 'Education', title: 'Post-Matric Scholarship for SC/ST/OBC Students', desc: 'Financial assistance for higher education of SC/ST/OBC students.', amt: 'Up to ₹25,000 per year', tg: 'Students' },
                { img: 'https://images.unsplash.com/photo-1592982537447-6f23342d2bf5?q=80&w=400&auto=format&fit=crop', tag: 'Agriculture', title: 'PM-KISAN Samman Nidhi', desc: 'Direct income support to small and marginal farmers.', amt: '₹6,000 per year', tg: 'Farmers' },
                { img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop', tag: 'Housing', title: 'Pradhan Mantri Awas Yojana (Gramin/Urban)', desc: 'Financial assistance for construction of pucca houses.', amt: '₹1.5 - 2.5 Lakh', tg: 'Rural/Urban Families' }
              ].map((s, i) => (
                <div key={i} className="border border-gray-200 rounded flex flex-col overflow-hidden hover:shadow-md transition">
                  <div className="h-32 relative bg-gray-100">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-700 flex items-center gap-1">
                      <span className={i === 0 ? 'text-blue-500' : i === 1 ? 'text-green-500' : 'text-red-500'}>⚲</span> {s.tag}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 h-10">{s.title}</h4>
                    <p className="text-[11px] text-gray-500 mb-4 line-clamp-2">{s.desc}</p>
                    <div className="mt-auto space-y-2 mb-4">
                      <div className="flex items-center text-[11px] text-gray-600 gap-1"><span className="text-[#00428a]">₹</span> {s.amt}</div>
                      <div className="flex items-center text-[11px] text-gray-600 gap-1"><Users className="w-3 h-3 text-[#00428a]"/> {s.tg}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <button className="border border-gray-300 text-gray-700 text-xs font-semibold py-1.5 rounded hover:bg-gray-50 transition">View Details</button>
                      <button className="bg-[#00428a] text-white text-xs font-semibold py-1.5 rounded hover:bg-blue-800 transition">Apply Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* How Adhikar Works */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-5">How Adhikar Works</h3>
            <div className="flex items-center justify-between gap-2">
               {[
                 { num: 1, title: 'Create Profile', desc: 'Tell us a few details about yourself', color: 'bg-blue-600' },
                 { num: 2, title: 'Check Eligibility', desc: 'Our system finds the best matching schemes', color: 'bg-emerald-500' },
                 { num: 3, title: 'Get Guidance', desc: 'Step-by-step application process', color: 'bg-amber-500' },
                 { num: 4, title: 'Apply & Track', desc: 'Submit and track your application', color: 'bg-purple-600' },
               ].map((step, i) => (
                 <div key={i} className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                          {step.num}
                        </div>
                        <h4 className="font-bold text-gray-900 text-[13px] leading-tight">{step.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 pl-11">{step.desc}</p>
                    </div>
                    {i < 3 && <ChevronDown className="w-4 h-4 text-gray-300 shrink-0 -rotate-90 hidden md:block" />}
                 </div>
               ))}
            </div>
          </div>
        </div>
        
        {/* Right Side: Check Eligibility Form */}
        <div className="space-y-6">
          <div className="bg-white rounded border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#00428a]"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Check Your Eligibility</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                  <option>Select State</option>
                  <option>Rajasthan</option>
                  <option>Delhi</option>
                  <option>Maharashtra</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                  <option>Select Category</option>
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC/ST</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                <input type="number" placeholder="Enter your age" className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Occupation</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#00428a]">
                  <option>Select Occupation</option>
                  <option>Student</option>
                  <option>Farmer</option>
                  <option>Unemployed</option>
                </select>
              </div>
              
              <button type="button" className="w-full bg-[#00428a] text-white font-bold py-2.5 rounded mt-4 hover:bg-blue-800 transition flex items-center justify-center gap-2">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="bg-white rounded border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[15px] font-bold text-gray-900">Important Links</h3>
              <Link to="/" className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3"/></Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/MyGov_logo.png" className="h-6 object-contain" alt="MyGov" />
                <span className="text-[9px] font-medium text-gray-600 leading-tight">मेरी सरकार</span>
              </div>
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/UMANG_App_Logo.png" className="h-6 object-contain" alt="UMANG" />
                <span className="text-[9px] font-medium text-gray-600 leading-tight">UMANG</span>
              </div>
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <div className="h-6 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-[#00428a]"><circle cx="50" cy="50" r="45" fill="currentColor"/></svg>
                </div>
                <span className="text-[9px] font-medium text-gray-600 leading-tight">National Scholarship Portal</span>
              </div>
              <div className="border border-gray-100 p-2 flex flex-col items-center justify-center text-center gap-1 hover:border-blue-200 transition">
                <div className="h-6 flex items-center justify-center">
                   <svg viewBox="0 0 100 100" className="h-full w-full text-green-700"><rect width="80" height="80" x="10" y="10" fill="currentColor"/></svg>
                </div>
                <span className="text-[9px] font-medium text-gray-600 leading-tight">Rajasthan State Portal</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
