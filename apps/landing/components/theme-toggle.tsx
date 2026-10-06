'use client'

import { Moon, Sun } from 'lucide-react'
import { useLocale } from '../lib/locale'

/**
 * Light/dark override. Mounted hidden until hydration completes so the button
 * never shows a theme that disagrees with the inline script's choice.
 */
export function ThemeToggle() {
  const { theme, toggleTheme, d } = useLocale()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? d.nav.themeToLight : d.nav.themeToDark}
      className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-[var(--vermilion-soft)] active:scale-95"
      style={{ color: 'var(--graphite)' }}
    >
      {theme === 'dark' ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </button>
  )
}
