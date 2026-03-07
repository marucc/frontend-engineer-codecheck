import { renderHook } from '@testing-library/react'

import { usePopulationContext } from './usePopulationContext'

describe('usePopulationContext', () => {
  it('Provider なしで使うとエラーになる', () => {
    expect(() => {
      renderHook(() => usePopulationContext())
    }).toThrow('usePopulationContext must be used within PopulationProvider')
  })
})
