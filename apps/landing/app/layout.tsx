import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
// oxlint-disable-next-line import/no-unassigned-import -- CSS side-effect import
import './globals.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz', 'SOFT'],
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Startup — a batteries-included monorepo starter',
  description:
    'One repo, every surface. Startup ships a Next.js site, a Vite + Electron desktop app, a Hono backend, and a shared design system.',
  metadataBase: new URL('https://erlinerd.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="landing font-body">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
