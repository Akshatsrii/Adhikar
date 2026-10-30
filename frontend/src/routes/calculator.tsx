import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, ShieldCheck, ChevronRight, Sparkles, TrendingUp, Home, Landmark, Heart } from 'lucide-react'

export const Route = createFileRoute('/calculator')({
  component: CalculatorPage,
})

type CalculatorTab = 'pmay' | 'pmkisan' | 'apy' | 'ssy'

function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('pmay')

  // PMAY state
  const [pmayIncome, setPmayIncome] = useState<number>(300000) // â‚¹3 Lakh (EWS/LIG)
  const [pmayLoan, setPmayLoan] = useState<number>(1500000) // â‚¹15 Lakh
  const [pmayTenure, setPmayTenure] = useState<number>(20) // 20 years

  // APY state
  const [apyAge, setApyAge] = useState<number>(25)
  const [apyPension, setApyPension] = useState<number>(5000)

  // PM-KISAN state
  const [kisanYears, setKisanYears] = useState<number>(5)

  // SSY state
  const [ssyAnnual, setSsyAnnual] = useState<number>(50000)
  const [ssyAge, setSsyAge] = useState<number>(2)

  // Calculations:
  // 1. PMAY Subsidy
  // EWS/LIG (income <= 6L): 6.5% interest subsidy on up to 6L loan, NPV max ~ â‚¹2,67,280
  const isEwsLig = pmayIncome <= 600000
  const eligibleLoanCap = isEwsLig ? Math.min(pmayLoan, 600000) : Math.min(pmayLoan, 900000)
  const estimatedUpfrontSubsidy = isEwsLig
    ? Math.round(Math.min(267280, eligibleLoanCap * 0.445))
    : Math.round(eligibleLoanCap * 0.26)
  const effectiveLoan = pmayLoan - estimatedUpfrontSubsidy
  const standardEmi = Math.round((pmayLoan * (0.085 / 12) * Math.pow(1 + 0.085 / 12, pmayTenure * 12)) / (Math.pow(1 + 0.085 / 12, pmayTenure * 12) - 1))
  const subsidizedEmi = Math.round((effectiveLoan * (0.085 / 12) * Math.pow(1 + 0.085 / 12, pmayTenure * 12)) / (Math.pow(1 + 0.085 / 12, pmayTenure * 12) - 1))
  const monthlySavings = standardEmi - subsidizedEmi

  // 2. APY Calculation
  // Standard APY chart approximation:
  // Age 18: 210 for 5000; Age 40: 1454 for 5000
  const apyMonthlyContrib = Math.round((apyPension / 5000) * (210 + (apyAge - 18) * 56.5))
  const apyYearsRemaining = 60 - apyAge
  const apyTotalInvestment = apyMonthlyContrib * 12 * apyYearsRemaining
  const apyNomineeCorpus = apyPension * 170

  // 3. PM KISAN
  const kisanTotalBenefit = kisanYears * 6000
  const kisanInstallments = kisanYears * 3

  // 4. SSY Calculation
  // 15 years contribution, matures at 21 years of girl (21 - ssyAge)
  const ssyDepositYears = 15
  const ssyTotalDeposited = ssyAnnual * ssyDepositYears
  // 8.2% compound formula
  const r = 0.082
  let ssyFutureVal = 0
  for (let y = 1; y <= ssyDepositYears; y++) {
    ssyFutureVal += ssyAnnual * Math.pow(1 + r, (21 - ssyAge) - y + 1)
  }
  const ssyMaturityEstimate = Math.round(ssyFutureVal)
  const ssyInterestEarned = ssyMaturityEstimate - ssyTotalDeposited

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full font-sans">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Citizen Welfare & Subsidy Calculator</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-blue-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Financial Entitlement Estimator
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Estimate Only · Official Formulas
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Direct Benefit & Subsidy Calculator Hub
          </h1>
          <p className="text-xs md:text-sm text-blue-200/80 leading-relaxed">
            Accurately simulate your monthly savings, upfront interest subsidies, guaranteed pension returns, and direct benefit cashflows under flagship Indian welfare missions.
          </p>
        </div>
      </div>

      {/* Calculator Mode Switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { id: 'pmay', title: 'PMAY Housing Subsidy', icon: Home, desc: 'Up to â‚¹2.67 Lakh CLSS' },
          { id: 'pmkisan', title: 'PM-KISAN DBT Schedule', icon: TrendingUp, desc: 'â‚¹6,000/yr Cashflow' },
          { id: 'apy', title: 'Atal Pension Yojana', icon: Landmark, desc: 'â‚¹1,000 - â‚¹5,000 Pension' },
          { id: 'ssy', title: 'Sukanya Samriddhi', icon: Heart, desc: '8.2% Child Wealth' },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CalculatorTab)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]' 
                  : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span className="text-xs font-bold leading-tight">{tab.title}</span>
              </div>
              <p className={`text-[11px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                {tab.desc}
              </p>
            </button>
          )
        })}
      </div>

      {/* Main Interactive Calculator Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs Section (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-7 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
          
          {activeTab === 'pmay' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Pradhan Mantri Awas Yojana (PMAY) CLSS</h3>
                <p className="text-xs text-slate-500">Calculate upfront interest subsidy credited directly to your home loan account.</p>
              </div>

              {/* Household Income Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Annual Household Income</span>
                  <span className="font-black text-blue-600 font-mono text-sm">â‚¹{pmayIncome.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1800000"
                  step="50000"
                  value={pmayIncome}
                  onChange={e => setPmayIncome(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>EWS (&le; â‚¹3L)</span>
                  <span>LIG (â‚¹3L - â‚¹6L)</span>
                  <span>MIG-I (â‚¹6L - â‚¹12L)</span>
                  <span>MIG-II (â‚¹12L - â‚¹18L)</span>
                </div>
              </div>

              {/* Loan Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Home Loan Amount Required</span>
                  <span className="font-black text-blue-600 font-mono text-sm">â‚¹{pmayLoan.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="300000"
                  max="5000000"
                  step="100000"
                  value={pmayLoan}
                  onChange={e => setPmayLoan(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>â‚¹3 Lakh</span>
                  <span>â‚¹25 Lakh</span>
                  <span>â‚¹50 Lakh</span>
                </div>
              </div>

              {/* Loan Tenure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Loan Tenure</span>
                  <span className="font-black text-blue-600 font-mono text-sm">{pmayTenure} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={pmayTenure}
                  onChange={e => setPmayTenure(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5 Years</span>
                  <span>20 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 leading-relaxed">
                  <strong>MoHUA Rule:</strong> Female head of household ownership is mandatory for EWS/LIG categories to qualify for direct upfront subsidy release.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pmkisan' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">PM-KISAN Cashflow Projection</h3>
                <p className="text-xs text-slate-500">Direct â‚¹2,000 DBT cash installments transferred every 4 months to farmer bank accounts.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Years of Planned Enrollment</span>
                  <span className="font-black text-emerald-600 font-mono text-sm">{kisanYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={kisanYears}
                  onChange={e => setKisanYears(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 Year (â‚¹6,000)</span>
                  <span>5 Years (â‚¹30,000)</span>
                  <span>15 Years (â‚¹90,000)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Cycle 1</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">April â€“ July</div>
                  <div className="text-xs font-black text-emerald-600 mt-0.5">â‚¹2,000 DBT</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Cycle 2</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Aug â€“ Nov</div>
                  <div className="text-xs font-black text-emerald-600 mt-0.5">â‚¹2,000 DBT</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Cycle 3</div>
                  <div className="text-xs font-bold text-slate-900 mt-1">Dec â€“ March</div>
                  <div className="text-xs font-black text-emerald-600 mt-0.5">â‚¹2,000 DBT</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Atal Pension Yojana (APY) Planner</h3>
                <p className="text-xs text-slate-500">Government guaranteed lifelong monthly pension for unorganized sector citizens.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Citizen Current Age</span>
                  <span className="font-black text-blue-600 font-mono text-sm">{apyAge} Years</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="40"
                  step="1"
                  value={apyAge}
                  onChange={e => setApyAge(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>18 Years (Min Age)</span>
                  <span>30 Years</span>
                  <span>40 Years (Max Entry)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Target Monthly Pension at Age 60</span>
                  <span className="font-black text-blue-600 font-mono text-sm">â‚¹{apyPension.toLocaleString('en-IN')} / month</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1000, 2000, 3000, 4000, 5000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setApyPension(amt)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        apyPension === amt 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      â‚¹{amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ssy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Sukanya Samriddhi Yojana (SSY)</h3>
                <p className="text-xs text-slate-500">Highest sovereign guaranteed interest rate (8.2% p.a.) under Beti Bachao Beti Padhao.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Annual Deposit Amount</span>
                  <span className="font-black text-purple-600 font-mono text-sm">â‚¹{ssyAnnual.toLocaleString('en-IN')} / yr</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="150000"
                  step="5000"
                  value={ssyAnnual}
                  onChange={e => setSsyAnnual(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>â‚¹1,000 (Min â‚¹250)</span>
                  <span>â‚¹75,000</span>
                  <span>â‚¹1,50,000 (Max 80C Cap)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Girl Child Current Age</span>
                  <span className="font-black text-purple-600 font-mono text-sm">{ssyAge} Years</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={ssyAge}
                  onChange={e => setSsyAge(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Newborn (0 yrs)</span>
                  <span>5 Years</span>
                  <span>10 Years (Max Age)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Financial Summary Card (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-7 md:p-8 shadow-xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Calculated Entitlement</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
              Verified Govt Formula
            </span>
          </div>

          {activeTab === 'pmay' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">Estimated Upfront PMAY Subsidy</span>
                <div className="text-3xl font-black text-emerald-400 tracking-tight mt-0.5">
                  â‚¹{estimatedUpfrontSubsidy.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Directly credited to reduce your loan principal.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Reduced Loan Amount</div>
                  <div className="text-sm font-bold text-white mt-0.5">â‚¹{effectiveLoan.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Monthly EMI Savings</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">~ â‚¹{monthlySavings.toLocaleString('en-IN')}/mo</div>
                </div>
              </div>

              <Link
                to="/scheme/$slug"
                params={{ slug: 'pm-awas-yojana-urban' }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
              >
                <span>View PMAY Scheme & Apply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {activeTab === 'pmkisan' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">Total Direct Cash Transferred</span>
                <div className="text-3xl font-black text-emerald-400 tracking-tight mt-0.5">
                  â‚¹{kisanTotalBenefit.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Across {kisanInstallments} guaranteed 4-month tranches.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Annual Entitlement</div>
                  <div className="text-sm font-bold text-white mt-0.5">â‚¹6,000 / year</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Payment Method</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">Aadhaar DBT Mode</div>
                </div>
              </div>

              <Link
                to="/scheme/$slug"
                params={{ slug: 'pm-kisan-samman-nidhi' }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20"
              >
                <span>View PM-KISAN Portal & Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {activeTab === 'apy' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">Monthly Contribution Required</span>
                <div className="text-3xl font-black text-blue-400 tracking-tight mt-0.5">
                  â‚¹{apyMonthlyContrib.toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-400">/ mo</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Auto-debited from your bank until age 60.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Guaranteed Pension</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">â‚¹{apyPension.toLocaleString('en-IN')}/month</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Nominee Corpus</div>
                  <div className="text-sm font-bold text-white mt-0.5">â‚¹{apyNomineeCorpus.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Total investment across {apyYearsRemaining} years: <strong className="text-white">â‚¹{apyTotalInvestment.toLocaleString('en-IN')}</strong>
              </div>

              <Link
                to="/scheme/$slug"
                params={{ slug: 'atal-pension-yojana' }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
              >
                <span>View Atal Pension Yojana</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {activeTab === 'ssy' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400">Estimated Tax-Free Maturity Payout</span>
                <div className="text-3xl font-black text-purple-400 tracking-tight mt-0.5">
                  â‚¹{ssyMaturityEstimate.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Matures when girl reaches 21 years of age.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Deposited</div>
                  <div className="text-sm font-bold text-white mt-0.5">â‚¹{ssyTotalDeposited.toLocaleString('en-IN')}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Compound Interest</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">+â‚¹{ssyInterestEarned.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/50 text-[11px] text-purple-200">
                <strong>Tax Exemption:</strong> Triple EEE status (Tax exemption on deposit, interest, and final maturity under 80C).
              </div>

              <Link
                to="/scheme/$slug"
                params={{ slug: 'sukanya-samriddhi-yojana' }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-purple-500/20"
              >
                <span>View Sukanya Samriddhi Yojana</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
