import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "about": "About Adhikar",
        "schemes": "Government Schemes",
        "eligibility": "Check Eligibility",
        "apply": "Apply Online",
        "assistant": "AI Assistant",
        "documents": "Documents",
        "state_schemes": "State Schemes",
        "help": "Help & Support"
      },
      "header": {
        "title": "ADHIKAR",
        "subtitle": "Meri Sarkar, Mera Adhikar",
        "desc": "AI Government Scheme Navigator",
        "login": "Login / Register",
        "logout": "Logout",
        "skip": "Skip to main content",
        "screen_reader": "Screen Reader Access",
        "govt": "Government of India"
      },
      "hero": {
        "title1": "Find Government Schemes",
        "title2": "You Deserve",
        "desc": "An AI-powered platform to discover, check eligibility, and apply for government schemes seamlessly.",
        "search_placeholder": "Ask AI: e.g. What schemes are for single mothers?",
        "search_btn": "Search",
        "action_check": "Check Eligibility",
        "action_find": "Find Schemes",
        "action_apply": "Apply Online",
        "action_track": "Track Application"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "home": "होम",
        "about": "अधिकार के बारे में",
        "schemes": "सरकारी योजनाएं",
        "eligibility": "पात्रता जांचें",
        "apply": "ऑनलाइन आवेदन",
        "assistant": "एआई सहायक",
        "documents": "दस्तावेज़",
        "state_schemes": "राज्य योजनाएं",
        "help": "सहायता एवं समर्थन"
      },
      "header": {
        "title": "अधिकार",
        "subtitle": "मेरी सरकार, मेरा अधिकार",
        "desc": "एआई सरकारी योजना नेविगेटर",
        "login": "लॉगिन / रजिस्टर",
        "logout": "लॉगआउट",
        "skip": "मुख्य विषयवस्तु में जाएं",
        "screen_reader": "स्क्रीन रीडर एक्सेस",
        "govt": "भारत सरकार"
      },
      "hero": {
        "title1": "खोजें सरकारी योजनाएं",
        "title2": "जिनके आप हकदार हैं",
        "desc": "सरकारी योजनाओं को खोजने, पात्रता जांचने और सहजता से आवेदन करने के लिए एक एआई-संचालित प्लेटफॉर्म।",
        "search_placeholder": "एआई से पूछें: उदा. महिलाओं के लिए कौन सी योजनाएं हैं?",
        "search_btn": "खोजें",
        "action_check": "पात्रता जांचें",
        "action_find": "योजनाएं खोजें",
        "action_apply": "ऑनलाइन आवेदन",
        "action_track": "आवेदन ट्रैक करें"
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
    interpolation: {
      escapeValue: false 
    }
  })

export default i18n
