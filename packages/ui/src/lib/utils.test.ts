import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins class strings', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional values via clsx', () => {
    const show = true
    const hide = false
    expect(cn('base', hide && 'no', show && 'yes', null)).toBe('base yes')
  })

  it('resolves conflicting tailwind classes via tailwind-merge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('merges conditional + conflicting classes together', () => {
    expect(cn('text-sm', { 'text-lg': true, hidden: false }, 'font-bold')).toBe(
      'text-lg font-bold',
    )
  })
})
