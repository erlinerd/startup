'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { en, zh, type Copy, type Locale } from './copy'

export type Theme = 'light' | 'dark'

export const LOCALE_STORAGE_KEY = 'landing-locale'
export const THEME_STORAGE_KEY = 'landing-theme'

interface LocaleCtx {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Active dictionary. Nested access keeps every string type-checked. */
  d: Copy
  theme: Theme
  toggleTheme: () => void
}

const Ctx = createContext<LocaleCtx | null>(null)

/**
 * Locale + theme for the landing page. Server HTML always renders en with the
 * system theme (the inline script in app/layout.tsx applies a stored theme
 * choice before paint); stored preferences are read in an effect, so the
 * first client render matches the server and nothing hydrates differently.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    let storedLocale: string | null = null
    try {
      storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY)
    } catch {
      // storage blocked: fall through to navigator
    }
    if (storedLocale === 'en' || storedLocale === 'zh') {
      setLocaleState(storedLocale)
    } else if (navigator.language.startsWith('zh')) {
      setLocaleState('zh')
    }

    const explicit = document.documentElement.dataset.theme
    if (explicit === 'dark' || explicit === 'light') {
      setTheme(explicit)
    } else {
      setTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
      )
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // persistence is best-effort
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // persistence is best-effort
    }
    setTheme(next)
  }, [theme])

  const value = useMemo<LocaleCtx>(
    () => ({
      locale,
      setLocale,
      d: locale === 'zh' ? zh : en,
      theme,
      toggleTheme,
    }),
    [locale, setLocale, theme, toggleTheme],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLocale(): LocaleCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
