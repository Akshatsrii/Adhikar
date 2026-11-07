import { createFileRoute, Link } from '@tanstack/react-router'
import { SignIn } from '@clerk/react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-6 text-center space-y-2 flex flex-col items-center">
        <Link to="/" className="inline-block hover:scale-[1.02] transition-transform">
          <img src="/adhikar-logo.png" alt="Adhikar — Your Right, Delivered" className="h-14 sm:h-16 w-auto object-contain mx-auto" />
        </Link>
        <h1 className="text-2xl font-black text-black tracking-tight mt-2">Citizen Sign In</h1>
        <p className="text-xs text-[#52525B]">Access your verified welfare dashboard and tracked applications</p>
      </div>

      <SignIn
        routing="hash"
        signUpUrl="/register"
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
