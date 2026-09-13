import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to Adhikar</h1>
      <p className="text-xl max-w-2xl text-gray-600">
        An AI system that understands a citizen's life, family, documents and life events — so government benefits find them, instead of the other way around.
      </p>
    </div>
  )
}
