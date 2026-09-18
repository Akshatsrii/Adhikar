import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { KageLandingPage } from "@designcodeio/threeui"
import "@designcodeio/threeui/style.css"

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { user } = useAuth()
  
  if (user) {
    window.location.href = '/dashboard'
    return null
  }

  return (
    <div className="shader-frame" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 50 }}>
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
      {/* Overlay a simple enter button so users can still login */}
      <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
        <a href="/login" className="btn-primary" style={{ padding: '12px 24px', fontSize: '18px', backgroundColor: '#e0231c', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          Enter Adhikar
        </a>
      </div>
    </div>
  )
}
