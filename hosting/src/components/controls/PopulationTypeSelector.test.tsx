import { fireEvent, render, screen } from '@testing-library/react'

import { usePopulationContext } from '../../hooks/usePopulationContext'
import { PopulationTypeSelector } from './PopulationTypeSelector'

const mockSetPopulationType = vi.fn()

vi.mock('../../hooks/usePopulationContext', () => ({
  usePopulationContext: vi.fn(),
}))

describe('PopulationTypeSelector', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('全人口種別が表示される', () => {
    vi.mocked(usePopulationContext).mockReturnValue({
      populations: [],
      populationType: '総人口',
      addPrefecture: vi.fn(),
      removePrefecture: vi.fn(),
      setPopulationType: mockSetPopulationType,
    })

    render(<PopulationTypeSelector />)
    expect(screen.getByLabelText('総人口')).toBeInTheDocument()
    expect(screen.getByLabelText('年少人口')).toBeInTheDocument()
    expect(screen.getByLabelText('生産年齢人口')).toBeInTheDocument()
    expect(screen.getByLabelText('老年人口')).toBeInTheDocument()
  })

  it('選択中の種別がチェック状態になる', () => {
    vi.mocked(usePopulationContext).mockReturnValue({
      populations: [],
      populationType: '生産年齢人口',
      addPrefecture: vi.fn(),
      removePrefecture: vi.fn(),
      setPopulationType: mockSetPopulationType,
    })

    render(<PopulationTypeSelector />)
    expect(screen.getByLabelText('生産年齢人口')).toBeChecked()
    expect(screen.getByLabelText('総人口')).not.toBeChecked()
  })

  it('種別を選択すると setPopulationType が呼ばれる', () => {
    vi.mocked(usePopulationContext).mockReturnValue({
      populations: [],
      populationType: '総人口',
      addPrefecture: vi.fn(),
      removePrefecture: vi.fn(),
      setPopulationType: mockSetPopulationType,
    })

    render(<PopulationTypeSelector />)
    fireEvent.click(screen.getByLabelText('年少人口'))
    expect(mockSetPopulationType).toHaveBeenCalledWith('年少人口')
  })
})
