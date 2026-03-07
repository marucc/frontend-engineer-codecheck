import { render, screen } from '@testing-library/react'

import { usePopulationContext } from '../../context/PopulationContext'
import { Chart } from './Chart'

vi.mock('highcharts', () => ({ default: {} }))
vi.mock('highcharts-react-official', () => ({
  default: ({ options }: { options: { series: unknown[] } }) => (
    <div data-testid="highcharts-mock">{options.series.length} series</div>
  ),
}))

vi.mock('../../context/PopulationContext', () => ({
  usePopulationContext: vi.fn(),
}))

describe('Chart', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('都道府県未選択時はプレースホルダーを表示', () => {
    vi.mocked(usePopulationContext).mockReturnValue({
      populations: [],
      populationType: '総人口',
      addPrefecture: vi.fn(),
      removePrefecture: vi.fn(),
      setPopulationType: vi.fn(),
    })

    render(<Chart />)
    expect(screen.getByText('都道府県を選択してください')).toBeInTheDocument()
  })

  it('都道府県が選択されているとグラフを表示', () => {
    vi.mocked(usePopulationContext).mockReturnValue({
      populations: [
        {
          prefCode: 1,
          prefName: '北海道',
          data: [
            {
              label: '総人口',
              data: [
                { year: 1960, value: 5039206 },
                { year: 1965, value: 5171800 },
              ],
            },
          ],
        },
      ],
      populationType: '総人口',
      addPrefecture: vi.fn(),
      removePrefecture: vi.fn(),
      setPopulationType: vi.fn(),
    })

    render(<Chart />)
    expect(
      screen.queryByText('都道府県を選択してください')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('highcharts-mock')).toHaveTextContent('1 series')
  })
})
