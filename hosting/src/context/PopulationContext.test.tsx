import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'

import { PopulationProvider } from './PopulationContext'
import { usePopulationContext } from '../hooks/usePopulationContext'

vi.mock('../api/client', () => ({
  fetchPopulation: vi
    .fn()
    .mockResolvedValue([
      { label: '総人口', data: [{ year: 2020, value: 1000 }] },
    ]),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <PopulationProvider>{children}</PopulationProvider>
)

describe('PopulationContext', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Provider なしで使うとエラーになる', () => {
    expect(() => {
      renderHook(() => usePopulationContext())
    }).toThrow('usePopulationContext must be used within PopulationProvider')
  })

  it('初期値が正しい', () => {
    const { result } = renderHook(() => usePopulationContext(), { wrapper })

    expect(result.current.populations).toEqual([])
    expect(result.current.populationType).toBe('総人口')
  })

  it('populationType を変更できる', () => {
    const { result } = renderHook(() => usePopulationContext(), { wrapper })

    act(() => {
      result.current.setPopulationType('年少人口')
    })

    expect(result.current.populationType).toBe('年少人口')
  })

  it('都道府県を追加・削除できる', async () => {
    const { result } = renderHook(() => usePopulationContext(), { wrapper })

    await act(async () => {
      await result.current.addPrefecture(1, '北海道')
    })

    expect(result.current.populations).toHaveLength(1)
    expect(result.current.populations[0].prefName).toBe('北海道')

    act(() => {
      result.current.removePrefecture(1)
    })

    expect(result.current.populations).toHaveLength(0)
  })
})
