import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { AuthCard } from '../components/AuthCard'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

function Login() {
  return (
    <AuthCard title="Login to Adhikar">
      <form className="flex flex-col gap-4">
        <input className="p-2 border border-gray-300 rounded" type="email" placeholder="Email" />
        <input className="p-2 border border-gray-300 rounded" type="password" placeholder="Password" />
        <button className="bg-[var(--color-amber)] text-white p-2 rounded font-bold hover:bg-yellow-600 transition" type="button">Login</button>
      </form>
    </AuthCard>
  )
}
