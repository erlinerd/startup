import { Suspense } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { Loader2 } from 'lucide-react'

export function RootLayout() {
  return (
    <div className="editorial flex min-h-svh flex-col">
      <header style={{ borderBottom: '1px solid var(--rule)' }}>
        <nav className="mx-auto flex w-full max-w-3xl items-center gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/favicon.png"
              alt=""
              aria-hidden
              width="24"
              height="24"
              className="size-6 rounded"
            />
            <span className="font-display text-base font-medium tracking-tight">
              Startup
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-5 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'font-medium'
                  : 'opacity-60 transition-opacity hover:opacity-100'
              }
              style={({ isActive }) =>
                isActive ? { color: 'var(--vermilion)' } : undefined
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                isActive
                  ? 'font-medium'
                  : 'opacity-60 transition-opacity hover:opacity-100'
              }
              style={({ isActive }) =>
                isActive ? { color: 'var(--vermilion)' } : undefined
              }
            >
              Chat
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? 'font-medium'
                  : 'opacity-60 transition-opacity hover:opacity-100'
              }
              style={({ isActive }) =>
                isActive ? { color: 'var(--vermilion)' } : undefined
              }
            >
              About
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Suspense
          fallback={
            <div
              className="flex items-center justify-center gap-2 py-20 text-sm"
              style={{ color: 'var(--graphite)' }}
            >
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default RootLayout
