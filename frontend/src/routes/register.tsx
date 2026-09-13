import { createFileRoute } from '@tanstack/react-router'
import { AuthCard } from '../components/AuthCard'

export const Route = createFileRoute('/register')({
  component: Register,
})

function Register() {
  return (
    <AuthCard title="Register for Adhikar">
      <form className="flex flex-col gap-4">
        <input className="p-2 border rounded" type="text" placeholder="Full Name" />
        <input className="p-2 border rounded" type="email" placeholder="Email" />
        <input className="p-2 border rounded" type="password" placeholder="Password" />
        <button className="bg-[var(--color-navy)] text-white p-2 rounded font-bold hover:bg-slate-800 transition" type="button">Register</button>
      </form>
    </AuthCard>
  )
}
