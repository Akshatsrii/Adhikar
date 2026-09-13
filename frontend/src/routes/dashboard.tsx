import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Citizen Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p className="text-gray-600 mb-4">Complete your profile to discover schemes.</p>
          <button className="bg-[var(--color-navy)] text-white px-4 py-2 rounded font-bold hover:bg-slate-800 transition">Edit Profile</button>
        </div>
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Eligible Schemes (0)</h2>
          <p className="text-gray-600 mb-4">No schemes found yet. Complete your profile.</p>
          <button className="bg-[var(--color-amber)] text-white px-4 py-2 rounded font-bold hover:bg-yellow-600 transition">Find Schemes</button>
        </div>
      </div>
    </div>
  )
}
