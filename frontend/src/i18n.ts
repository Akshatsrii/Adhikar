import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      "announcement": "Next-Gen Welfare AI: Real-time discovery & 1-click official applications",
      "nav": {
        "home": "Home",
        "about": "About Adhikar",
        "schemes": "Schemes",
        "eligibility": "Eligibility",
        "apply": "Apply Online",
        "assistant": "AI Copilot",
        "documents": "Documents",
        "state_schemes": "State Schemes",
        "calculator": "Benefit Calculator",
        "family": "Family Optimizer",
        "life_events": "Life Events",
        "grievances": "Grievances",
        "readiness": "Doc Readiness",
        "timeline": "Timeline",
        "impact": "Impact",
        "dashboard": "Dashboard",
        "contact": "Contact",
        "login": "Sign In",
        "register": "Register",
        "logout": "Logout"
      },
      "header": {
        "title": "ADHIKAR",
        "subtitle": "Meri Sarkar, Mera Adhikar",
        "desc": "Official Citizen Welfare Intelligence Gateway",
        "search_placeholder": "Quick search schemes or press ⌘K...",
        "admin": "Admin Console",
        "profile": "Profile"
      },
      "hero": {
        "badge": "Meri Sarkar, Mera Adhikar",
        "badge_sub": "Official Welfare Intelligence",
        "title1": "Your Welfare Rights.",
        "title2": "Every Benefit.",
        "desc": "A beautifully crafted, high-trust environment to explore, check eligibility with AI, and access official government welfare schemes directly.",
        "cta_primary": "Check Eligibility",
        "cta_secondary": "Ask AI Copilot ✨",
        "search_placeholder": "Search schemes — PM-KISAN, Ayushman, Housing, Scholarships...",
        "search_btn": "Explore",
        "stat_accuracy": "100% Deterministic",
        "stat_accuracy_desc": "Zero AI hallucinations in eligibility engine",
        "stat_schemes": "500+ Official Portals",
        "stat_schemes_desc": "Direct application to verified .gov.in endpoints",
        "stat_benefits": "₹50,000+ Cr Unlocked",
        "stat_benefits_desc": "Citizen welfare delivered across India"
      },
      "categories": {
        "heading": "Explore by Welfare Category",
        "subheading": "Browse verified Central and State programs tailored to your profile",
        "agriculture": "Agriculture",
        "employment": "Employment",
        "education": "Education",
        "healthcare": "Healthcare",
        "disability": "Disability",
        "women": "Women Welfare",
        "housing": "Housing",
        "social": "Social Welfare"
      },
      "assistant": {
        "title": "Adhikar AI Copilot",
        "subtitle": "Instant answers grounded in verified government gazettes and rules",
        "placeholder": "Ask in English, Hindi or Hinglish (e.g. Kisan yojana me kitna paisa milta hai?)...",
        "send": "Ask",
        "server_warming": "Server is waking up, this might take ~20 seconds on first run...",
        "sample1": "Am I eligible for PM-KISAN?",
        "sample2": "Scholarships for college students in Rajasthan",
        "sample3": "What documents are required for Ayushman card?",
        "sample4": "Palanhar Yojana benefits for children"
      },
      "footer": {
        "tagline": "Empowering every Indian citizen through transparent, accessible welfare intelligence.",
        "rights": "All rights reserved. Government data synchronized with official .gov.in portals.",
        "quick_links": "Quick Links",
        "citizen_tools": "Citizen Tools",
        "governance": "Governance & Security"
      }
    }
  },
  hi: {
    translation: {
      "announcement": "अधिकार एआई: योजनाओं की खोज एवं सीधे 1-क्लिक आधिकारिक सरकारी आवेदन",
      "nav": {
        "home": "होम",
        "about": "अधिकार के बारे में",
        "schemes": "सरकारी योजनाएं",
        "eligibility": "पात्रता जांचें",
        "apply": "ऑनलाइन आवेदन",
        "assistant": "एआई सहायक",
        "documents": "दस्तावेज़ लॉकर",
        "state_schemes": "राज्य योजनाएं",
        "calculator": "लाभ कैलकुलेटर",
        "family": "परिवार ऑप्टिमाइज़र",
        "life_events": "जीवन की घटनाएं",
        "grievances": "शिकायत निवारण",
        "readiness": "दस्तावेज़ तत्परता",
        "timeline": "आवेदन समयरेखा",
        "impact": "प्रभाव रिपोर्ट",
        "dashboard": "डैशबोर्ड",
        "contact": "संपर्क करें",
        "login": "साइन इन",
        "register": "पंजीकरण करें",
        "logout": "लॉगआउट"
      },
      "header": {
        "title": "अधिकार",
        "subtitle": "मेरी सरकार, मेरा अधिकार",
        "desc": "आधिकारिक नागरिक कल्याण सूचना प्रणाली",
        "search_placeholder": "योजना खोजें या ⌘K दबाएं...",
        "admin": "एडमिन कंसोल",
        "profile": "प्रोफ़ाइल"
      },
      "hero": {
        "badge": "मेरी सरकार, मेरा अधिकार",
        "badge_sub": "आधिकारिक नागरिक कल्याण केंद्र",
        "title1": "आपका अधिकार।",
        "title2": "हर सरकारी लाभ।",
        "desc": "सरकारी योजनाओं को खोजने, एआई से सटीक पात्रता जांचने और सीधे आधिकारिक सरकारी पोर्टलों पर आवेदन करने का सबसे आधुनिक एवं विश्वसनीय मंच।",
        "cta_primary": "पात्रता जांचें",
        "cta_secondary": "एआई से पूछें ✨",
        "search_placeholder": "योजना खोजें — पीएम किसान, आयुष्मान, आवास योजना, छात्रवृत्ति...",
        "search_btn": "खोजें",
        "stat_accuracy": "100% सटीक नियम",
        "stat_accuracy_desc": "पात्रता निर्णय में बिना किसी गलत अनुमान के",
        "stat_schemes": "500+ सरकारी पोर्टल",
        "stat_schemes_desc": "सत्यापित .gov.in पोर्टल्स पर सीधा आवेदन",
        "stat_benefits": "₹50,000+ करोड़ लाभ",
        "stat_benefits_desc": "पूरे भारत में नागरिकों तक सीधे पहुंच"
      },
      "categories": {
        "heading": "श्रेणी अनुसार योजनाएं देखें",
        "subheading": "आपकी प्रोफाइल के अनुसार केंद्र एवं राज्य सरकार की सत्यापित योजनाएं",
        "agriculture": "कृषि एवं किसान",
        "employment": "रोजगार एवं स्वरोजगार",
        "education": "शिक्षा एवं छात्रवृत्ति",
        "healthcare": "स्वास्थ्य एवं बीमा",
        "disability": "दिव्यांग कल्याण",
        "women": "महिला एवं बाल कल्याण",
        "housing": "आवास योजनाएं",
        "social": "सामाजिक सुरक्षा एवं पेंशन"
      },
      "assistant": {
        "title": "अधिकार एआई सहायक",
        "subtitle": "सरकारी नियमों एवं राजपत्रों पर आधारित तत्काल एवं विश्वसनीय उत्तर",
        "placeholder": "हिंदी, अंग्रेजी या हिंग्लिश में पूछें (उदा. किसान योजना में कितना पैसा मिलता है?)...",
        "send": "पूछें",
        "server_warming": "सर्वर तैयार हो रहा है, पहली बार में 20 सेकंड लग सकते हैं...",
        "sample1": "क्या मैं पीएम किसान योजना के लिए पात्र हूँ?",
        "sample2": "राजस्थान में कॉलेज छात्रों के लिए छात्रवृत्ति",
        "sample3": "आयुष्मान कार्ड के लिए कौन से दस्तावेज़ चाहिए?",
        "sample4": "पालनहार योजना में बच्चों को क्या लाभ मिलता है?"
      },
      "footer": {
        "tagline": "पारदर्शी और सुलभ कल्याणकारी सूचना के माध्यम से हर भारतीय नागरिक का सशक्तिकरण।",
        "rights": "सर्वाधिकार सुरक्षित। आधिकारिक .gov.in पोर्टल्स के साथ डेटा सिंक्रनाइज़्ड।",
        "quick_links": "मुख्य लिंक",
        "citizen_tools": "नागरिक उपकरण",
        "governance": "सुरक्षा एवं नीतियां"
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'adhikar_lang',
    },
    interpolation: {
      escapeValue: false 
    }
  })

export default i18n
