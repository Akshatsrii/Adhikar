import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Adhikar",
      "profile": "Your Profile"
    }
  },
  hi: {
    translation: {
      "welcome": "अधिकार में आपका स्वागत है",
      "profile": "आपकी प्रोफाइल"
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
