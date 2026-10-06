import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { LocaleProvider } from '../lib/locale'
import { THEME_STORAGE_KEY } from '../lib/locale'
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

const SITE_URL = 'https://starter.erlinerd.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f6' },
    { media: '(prefers-color-scheme: dark)', color: '#221f1c' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Startup: one repo ships the site, the desktop app, and the API',
  description:
    'A batteries-included full-stack monorepo starter: Next.js landing site, Vite + Electron desktop app, Hono backend, shared design system, CI gates, and Cloudflare Workers deploys.',
  keywords: [
    'monorepo starter',
    'full-stack template',
    'Next.js starter',
    'Electron boilerplate',
    'Hono API',
    'Turborepo',
    'pnpm workspace',
    'shadcn/ui',
    'Drizzle ORM',
    'Cloudflare Workers',
    'TypeScript boilerplate',
  ],
  authors: [{ name: 'erlinerd', url: 'https://erlinerd.com' }],
  creator: 'erlinerd',
  alternates: {
    canonical: '/',
    // The page renders English by default; Chinese is a client-side switch of
    // the same URL, so it is declared as an alternate language, not a path.
    languages: { 'en-US': '/', 'zh-CN': '/' },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Startup',
    title: 'Startup: one repo ships every surface',
    description:
      'Next.js site, Electron desktop app, Hono API, shared design system. One install, CI-gated, deploy-ready.',
    locale: 'en_US',
    alternateLocale: ['zh_CN'],
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Startup monorepo starter: landing, desktop and server in one repo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup: one repo ships every surface',
    description:
      'Next.js site, Electron desktop app, Hono API, shared design system. One install, CI-gated, deploy-ready.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/** Applies a stored theme choice before first paint so there is no flash. */
const themeInit = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Startup',
      inLanguage: ['en', 'zh'],
      publisher: { '@id': 'https://erlinerd.com/#person' },
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': `${SITE_URL}/#code`,
      name: 'startup',
      url: 'https://github.com/erlinerd/startup',
      codeRepository: 'https://github.com/erlinerd/startup',
      programmingLanguage: 'TypeScript',
      license: 'https://opensource.org/licenses/MIT',
      description:
        'A batteries-included full-stack monorepo starter: Next.js landing site, Vite + Electron desktop app, Hono API server, and a shared design system.',
      applicationCategory: 'DeveloperApplication',
      runtime: ['Node.js', 'Deno', 'Bun'],
      softwareRequirements: ['Node.js >= 22.22', 'pnpm 9'],
      author: {
        '@type': 'Person',
        name: 'erlinerd',
        url: 'https://erlinerd.com',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#app`,
      name: 'Startup landing',
      url: SITE_URL,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="landing font-body">
        <LocaleProvider>
          {children}
          <Toaster richColors position="top-center" />
        </LocaleProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
