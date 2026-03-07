import { renderHook, waitFor } from '@testing-library/react'

import { usePrefectures } from './usePrefectures'

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
]

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('usePrefectures', () => {
  it('都道府県一覧を取得して返す', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: mockPrefectures }),
    } as Response)

    const { result } = renderHook(() => usePrefectures())

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.prefectures).toEqual(mockPrefectures)
    expect(result.current.error).toBeNull()
  })

  it('取得失敗時にエラーを返す', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    const { result } = renderHook(() => usePrefectures())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeTruthy()
    expect(result.current.prefectures).toEqual([])
  })
})
