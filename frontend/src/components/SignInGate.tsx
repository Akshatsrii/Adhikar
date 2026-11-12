import { Link } from '@tanstack/react-router'
import { Lock, ArrowRight, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SignInGateProps {
  title?: string
  subtitle?: string
}

export function SignInGate({ title, subtitle }: SignInGateProps) {
  const { i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <div className="rounded-[32px] bg-white border border-[#EAE6DF] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Top Dark Forest Green Header */}
        <div className="bg-gradient-to-r from-[#0B3B24] via-[#072416] to-[#0A0A0A] p-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#FF5500]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center mb-5 shadow-lg">
              <Lock className="w-8 h-8 text-[#FF7729]" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold uppercase tracking-wider text-emerald-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              {isHindi ? 'सत्यापित नागरिक पोर्टल' : 'Verified Citizen Access'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {title || (isHindi ? 'सभी योजनाएं देखने के लिए साइन इन करें' : 'Sign In to View All Welfare Schemes')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2.5 max-w-lg leading-relaxed">
              {subtitle ||
                (isHindi
                  ? 'अपनी व्यक्तिगत पात्रता के आधार पर सभी केंद्रीय और राज्य सरकारी योजनाओं, सीधे आवेदन लिंक और लाभों को अनलॉक करने के लिए कृपया साइन इन करें।'
                  : 'Sign in to unlock all verified Central & State government schemes, personalized eligibility matching, and direct .gov.in application portals.')}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-8 sm:p-10 bg-[#FAF8F5] flex flex-col items-center text-center space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
            {[
              {
                icon: <Sparkles className="w-4 h-4 text-[#FF5500]" />,
                label: isHindi ? 'व्यक्तिगत मिलान' : 'Personalized Matching',
                desc: isHindi ? 'आपकी प्रोफ़ाइल के अनुसार' : 'Tailored to your profile',
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-[#0B3B24]" />,
                label: isHindi ? '100% सत्यापित' : '100% Verified Links',
                desc: isHindi ? 'आधिकारिक .gov.in पोर्टल' : 'Official .gov.in portals',
              },
              {
                icon: <Lock className="w-4 h-4 text-[#FF5500]" />,
                label: isHindi ? 'सुरक्षित ट्रैकिंग' : 'Real-Time Tracking',
                desc: isHindi ? 'आवेदन और दस्तावेज़ सुरक्षित' : 'Track applications live',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-3.5 border border-[#EAE6DF] flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFF2E8] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-black">{item.label}</div>
                  <div className="text-[11px] text-neutral-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#EA4C00] text-white font-bold px-8 py-3.5 rounded-full text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:scale-[1.02] transition"
            >
              <span>{isHindi ? 'साइन इन करें' : 'Sign In to Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto bg-[#0B3B24] hover:bg-[#072718] text-white font-bold px-8 py-3.5 rounded-full text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
            >
              <UserPlus className="w-4 h-4 text-[#4ADE80]" />
              <span>{isHindi ? 'नया खाता बनाएं' : 'Create Free Account'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
