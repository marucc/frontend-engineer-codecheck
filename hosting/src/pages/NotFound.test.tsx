import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { NotFound } from './NotFound'

describe('NotFound', () => {
  it('見出しとトップへ戻るリンクを表示する', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: 'ページが見つかりません' })
    ).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'トップへ戻る' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
