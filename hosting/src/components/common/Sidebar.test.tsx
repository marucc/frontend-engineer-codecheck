import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Sidebar } from './Sidebar'

const renderSidebar = (open = true, onClose = vi.fn()) => {
  return {
    onClose,
    ...render(
      <MemoryRouter initialEntries={['/total']}>
        <Sidebar open={open} onClose={onClose} />
      </MemoryRouter>
    ),
  }
}

describe('Sidebar', () => {
  it('人口種別のリンクを4つ表示する', () => {
    renderSidebar()

    expect(screen.getByRole('link', { name: '総人口' })).toHaveAttribute(
      'href',
      '/total'
    )
    expect(screen.getByRole('link', { name: '年少人口' })).toHaveAttribute(
      'href',
      '/young'
    )
    expect(screen.getByRole('link', { name: '生産年齢人口' })).toHaveAttribute(
      'href',
      '/working-age'
    )
    expect(screen.getByRole('link', { name: '老年人口' })).toHaveAttribute(
      'href',
      '/elderly'
    )
  })

  it('リンクをクリックすると onClose が呼ばれる', () => {
    const { onClose } = renderSidebar()

    fireEvent.click(screen.getByRole('link', { name: '年少人口' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('閉じるボタンをクリックすると onClose が呼ばれる', () => {
    const { onClose } = renderSidebar()

    fireEvent.click(screen.getByRole('button', { name: 'メニューを閉じる' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('オーバーレイをクリックすると onClose が呼ばれる', () => {
    const { onClose } = renderSidebar()

    fireEvent.click(screen.getByRole('presentation'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('open が false のときオーバーレイが表示されない', () => {
    renderSidebar(false)

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
  })
})
