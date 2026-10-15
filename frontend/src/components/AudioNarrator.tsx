import { useState, useEffect, useRef } from 'react'
import { Volume2, Pause, Play, RotateCcw } from 'lucide-react'

interface AudioNarratorProps {
  schemeName: string
  benefitText: string
  descriptionText: string
}

export function AudioNarrator({ schemeName, benefitText, descriptionText }: AudioNarratorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [lang, setLang] = useState<'hi-IN' | 'en-IN'>('hi-IN')
  const [isSupported, setIsSupported] = useState(true)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    } else {
      setIsSupported(false)
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  if (!isSupported) return null

  const getNarrationText = () => {
    if (lang === 'hi-IN') {
      return `यह योजना है ${schemeName}। मुख्य लाभ: ${benefitText}। योजना का विवरण: ${descriptionText}। आधिकारिक पोर्टल पर आवेदन करने के लिए आधार कार्ड और बैंक खाता आवश्यक है।`
    }
    return `Scheme name: ${schemeName}. Main benefit: ${benefitText}. Overview: ${descriptionText}. To apply, please ensure you have an active Aadhaar card and bank account linked with DBT.`
  }

  const handlePlay = () => {
    if (!synthRef.current) return

    if (isPaused) {
      synthRef.current.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    synthRef.current.cancel()

    const text = getNarrationText()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = lang === 'hi-IN' ? 0.95 : 1.0

    // Attempt to pick a suitable voice
    const voices = synthRef.current.getVoices()
    const targetVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)))
    if (targetVoice) {
      utterance.voice = targetVoice
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    synthRef.current.speak(utterance)
    setIsPlaying(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    if (!synthRef.current) return
    synthRef.current.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const handleStop = () => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  const handleLangToggle = (newLang: 'hi-IN' | 'en-IN') => {
    handleStop()
    setLang(newLang)
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
      
      {/* Left indicator & audio wave */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          isPlaying ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-blue-100 text-blue-700'
        }`}>
          {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              {lang === 'hi-IN' ? 'योजना का विवरण बोलकर सुनिए' : 'Listen to Scheme Audio'}
            </span>
            {isPlaying && (
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-1 bg-blue-600 h-2 animate-bounce rounded-full"></span>
                <span className="w-1 bg-blue-600 h-3 animate-bounce [animation-delay:0.2s] rounded-full"></span>
                <span className="w-1 bg-blue-600 h-1.5 animate-bounce [animation-delay:0.4s] rounded-full"></span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {lang === 'hi-IN' ? 'ग्रामीण एवं बुजुर्ग नागरिकों के लिए वॉइस गाइड' : 'Accessibility text-to-speech narration'}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Language switch */}
        <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 text-[11px] font-bold">
          <button
            onClick={() => handleLangToggle('hi-IN')}
            className={`px-2 py-1 rounded transition ${lang === 'hi-IN' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => handleLangToggle('en-IN')}
            className={`px-2 py-1 rounded transition ${lang === 'en-IN' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            English
          </button>
        </div>

        {/* Audio buttons */}
        <div className="flex items-center gap-1.5">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume' : 'Play'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Stop audio"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
