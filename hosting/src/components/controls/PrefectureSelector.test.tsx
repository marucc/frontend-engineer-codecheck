import { fireEvent, render, screen } from '@testing-library/react'

import { usePrefectures } from '../../hooks/usePrefectures'
import { PrefectureSelector } from './PrefectureSelector'

const mockAddPrefecture = vi.fn()
const mockRemovePrefecture = vi.fn()

vi.mock('../../hooks/usePrefectures', () => ({
  usePrefectures: vi.fn(),
}))

vi.mock('../../context/PopulationContext', () => ({
  usePopulationContext: () => ({
    addPrefecture: mockAddPrefecture,
    removePrefecture: mockRemovePrefecture,
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

  it('チェックボックスをクリックすると addPrefecture が呼ばれる', () => {
    vi.mocked(usePrefectures).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null,
    })

    render(<PrefectureSelector />)
    fireEvent.click(screen.getByLabelText('東京都'))
    expect(mockAddPrefecture).toHaveBeenCalledWith(13, '東京都')
  })

  it('チェック済みを外すと removePrefecture が呼ばれる', () => {
    vi.mocked(usePrefectures).mockReturnValue({
      prefectures: mockPrefectures,
      loading: false,
      error: null,
    })

    render(<PrefectureSelector />)
    fireEvent.click(screen.getByLabelText('東京都'))
    fireEvent.click(screen.getByLabelText('東京都'))
    expect(mockRemovePrefecture).toHaveBeenCalledWith(13)
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
