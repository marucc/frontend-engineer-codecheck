import { act, renderHook } from '@testing-library/react'

import { usePopulation } from './usePopulation'

const mockPopulationData = [
  {
    label: '総人口',
    data: [
      { year: 1960, value: 5039206 },
      { year: 1965, value: 5171800 },
    ],
  },
]

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('usePopulation', () => {
  it('都道府県の人口データを追加・削除できる', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: { data: mockPopulationData } }),
    } as Response)

    const { result } = renderHook(() => usePopulation())

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

  it('同じ都道府県の再取得時はキャッシュを使う', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: { data: mockPopulationData } }),
    } as Response)

    const { result } = renderHook(() => usePopulation())

    await act(async () => {
      await result.current.addPrefecture(1, '北海道')
    })

    act(() => {
      result.current.removePrefecture(1)
    })

    await act(async () => {
      await result.current.addPrefecture(1, '北海道')
    })

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})
