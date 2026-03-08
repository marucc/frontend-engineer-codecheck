import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'

import { usePopulationContext } from '../hooks/usePopulationContext'
import { PopulationProvider } from './PopulationContext'

vi.mock('../api/client', () => ({
  fetchPopulation: vi
    .fn()
    .mockResolvedValue([
      { label: '総人口', data: [{ year: 2020, value: 1000 }] },
    ]),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <PopulationProvider initialType="総人口">{children}</PopulationProvider>
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

  it('initialType で人口種別を指定できる', () => {
    const youngWrapper = ({ children }: { children: ReactNode }) => (
      <PopulationProvider initialType="年少人口">{children}</PopulationProvider>
    )

    const { result } = renderHook(() => usePopulationContext(), {
      wrapper: youngWrapper,
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
