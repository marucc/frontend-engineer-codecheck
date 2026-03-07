import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'

import { PopulationProvider } from '../../context/PopulationContext'
import { Header } from './Header'

vi.mock('../../api/client', () => ({
  fetchPopulation: vi.fn().mockResolvedValue([]),
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <PopulationProvider>{children}</PopulationProvider>
)

describe('Header', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('初期状態で総人口の見出しを表示する', () => {
    render(<Header />, { wrapper })

    expect(
      screen.getByRole('heading', { name: '都道府県別の総人口推移グラフ' })
    ).toBeInTheDocument()
  })
})
