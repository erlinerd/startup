import { createBrowserRouter, createHashRouter, Link } from 'react-router'
import { lazy } from 'react'
import { RootLayout } from '../App'

const HomePage = lazy(() => import('../routes/home'))
const AboutPage = lazy(() => import('../routes/about'))
const ChatPage = lazy(() => import('../routes/chat'))

function RouteError() {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-3 py-20">
      <p>Something went wrong loading this page.</p>
      <Link to="/" className="text-primary text-sm underline">
        ← Back home
      </Link>
    </div>
  )
}

const routes = {
  path: '/',
  element: <RootLayout />,
  // Catches route render errors AND lazy chunk load failures so the app never
  // shows a blank screen in production.
  errorElement: <RouteError />,
  children: [
    { index: true, element: <HomePage /> },
    { path: 'chat', element: <ChatPage /> },
    { path: 'about', element: <AboutPage /> },
  ],
}

// In the Electron production build the renderer is loaded from file://, where
// BrowserRouter's history API breaks. Fall back to HashRouter there. On the web
// target (and in dev) BrowserRouter gives clean URLs.
const isElectron = typeof window !== 'undefined' && 'electron' in window

export const router = isElectron
  ? createHashRouter([routes])
  : createBrowserRouter([routes], {
      // Respect Vite's `base` so the web build works under a sub-path.
      basename: import.meta.env.BASE_URL,
    })
