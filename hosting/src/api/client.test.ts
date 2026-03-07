import { fetchPopulation, fetchPrefectures } from './client'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('fetchPrefectures', () => {
  it('都道府県一覧を返す', async () => {
    const mockResult = [
      { prefCode: 1, prefName: '北海道' },
      { prefCode: 13, prefName: '東京都' },
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: mockResult }),
    } as Response)

    const result = await fetchPrefectures()

    expect(fetch).toHaveBeenCalledWith('/api/v1/prefectures')
    expect(result).toEqual(mockResult)
  })

  it('レスポンスが ok でない場合にエラーを投げる', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchPrefectures()).rejects.toThrow(
      '都道府県の読み込みができませんでした'
    )
  })
})

describe('fetchPopulation', () => {
  it('指定した都道府県の人口データを返す', async () => {
    const mockData = [
      {
        label: '総人口',
        data: [
          { year: 1960, value: 5039206 },
          { year: 1965, value: 5171800 },
        ],
      },
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: { data: mockData } }),
    } as Response)

    const result = await fetchPopulation(1)

    expect(fetch).toHaveBeenCalledWith('/api/v1/population/1')
    expect(result).toEqual(mockData)
  })

  it('レスポンスが ok でない場合にエラーを投げる', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchPopulation(1)).rejects.toThrow(
      'グラフデータの読み込みができませんでした'
    )
  })
})
