import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-6 text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-md border border-neutral-800">
          <img src="/adhikar-badge-dark.png" alt="Adhikar Official Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-black text-black tracking-tight">Create Citizen Account</h1>
        <p className="text-xs text-[#52525B]">Direct benefit transfer, eligibility verification, and application tracking</p>
      </div>

      <SignUp
        routing="hash"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE6DF] rounded-[32px] p-6 sm:p-8 bg-white',
            formButtonPrimary: 'bg-black hover:bg-neutral-800 text-white font-bold rounded-full text-xs shadow-xs transition hover:scale-[1.02]',
            footerActionLink: 'text-[#FF5500] font-bold hover:underline',
          },
        }}
      />
    </div>
  )
}
