import { fireEvent, render, screen } from '@testing-library/react'

import { usePrefectures } from '../../hooks/usePrefectures'
import { PrefectureSelector } from './PrefectureSelector'

const mockTogglePrefecture = vi.fn()
let mockSelectedCodes = new Set<number>()

vi.mock('../../hooks/usePrefectures', () => ({
  usePrefectures: vi.fn(),
}))

vi.mock('../../hooks/usePopulationContext', () => ({
  usePopulationContext: () => ({
    populations: [],
    get selectedCodes() {
      return mockSelectedCodes
    },
    loadingCodes: new Set<number>(),
    error: null,
    togglePrefecture: mockTogglePrefecture,
  }),
}))

const mockPrefectures = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 13, prefName: '東京都' },
  { prefCode: 27, prefName: '大阪府' },
]

describe('PrefectureSelector', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mockSelectedCodes = new Set()
  })

  it('全都道府県がチェックボックスとして表示される', () => {
    vi.mocked(usePrefectures).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null,
    })

    render(<PrefectureSelector />)
    expect(screen.getByLabelText('北海道')).toBeInTheDocument()
    expect(screen.getByLabelText('東京都')).toBeInTheDocument()
    expect(screen.getByLabelText('大阪府')).toBeInTheDocument()
  })

  it('チェックボックスをクリックすると togglePrefecture が呼ばれる', () => {
    vi.mocked(usePrefectures).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null,
    })

    render(<PrefectureSelector />)
    fireEvent.click(screen.getByLabelText('東京都'))
    expect(mockTogglePrefecture).toHaveBeenCalledWith(13, '東京都')
  })

  it('チェック済みを外すと togglePrefecture が呼ばれる', () => {
    mockSelectedCodes = new Set([13])

    vi.mocked(usePrefectures).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null,
    })

    render(<PrefectureSelector />)
    fireEvent.click(screen.getByLabelText('東京都'))
    expect(mockTogglePrefecture).toHaveBeenCalledWith(13, '東京都')
  })

  it('loading 中は読み込み中と表示される', () => {
    vi.mocked(usePrefectures).mockReturnValue({
      prefectures: [],
      loading: true,
      error: null,
    })

    render(<PrefectureSelector />)
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('エラー時はエラーメッセージを表示する', () => {
    vi.mocked(usePrefectures).mockReturnValue({
      prefectures: [],
      loading: false,
      error: '取得に失敗しました',
    })

    render(<PrefectureSelector />)
    expect(screen.getByText('エラー: 取得に失敗しました')).toBeInTheDocument()
  })
})
