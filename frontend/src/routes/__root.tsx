import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen bg-[var(--color-white)] text-[var(--color-navy)]">
      <header className="p-4 border-b border-gray-200 flex justify-between items-center bg-[var(--color-white)] sticky top-0 z-10 shadow-sm">
        <Link to="/" className="text-xl font-bold text-[var(--color-amber)]">Adhikar</Link>
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-[var(--color-amber)]">Home</Link>
          <Link to="/login" className="hover:text-[var(--color-amber)]">Login</Link>
          <Link to="/register" className="hover:text-[var(--color-amber)]">Register</Link>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>
      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
        &copy; {new Date().getFullYear()} Adhikar - Your Right, Delivered.
      </footer>
    </div>
  ),
})
