import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { AuthCard } from '../components/AuthCard'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})

function Register() {
  return (
    <AuthCard title="Register for Adhikar">
      <form className="flex flex-col gap-4">
        <input className="p-2 border border-gray-300 rounded" type="text" placeholder="Full Name" />
        <input className="p-2 border border-gray-300 rounded" type="email" placeholder="Email" />
        <input className="p-2 border border-gray-300 rounded" type="password" placeholder="Password" />
        <button className="bg-[var(--color-navy)] text-white p-2 rounded font-bold hover:bg-slate-800 transition" type="button">Register</button>
      </form>
    </AuthCard>
  )
}
