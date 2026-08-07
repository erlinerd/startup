import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCounter } from './store'

describe('useCounter store', () => {
  beforeEach(() => {
    // Reset to a known state before each test so order doesn't matter.
    const { result } = renderHook(() => useCounter())
    act(() => result.current.reset())
  })

  it('starts at zero', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('increments by one', () => {
    const { result } = renderHook(() => useCounter())
    act(() => result.current.increment())
    expect(result.current.count).toBe(1)
  })

  it('increments cumulatively', () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.increment()
    })
    expect(result.current.count).toBe(3)
  })

  it('resets back to zero', () => {
    const { result } = renderHook(() => useCounter())
    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.reset()
    })
    expect(result.current.count).toBe(0)
  })
})
