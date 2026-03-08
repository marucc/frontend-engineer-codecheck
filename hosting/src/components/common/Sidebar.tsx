import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { POPULATION_TYPE_SLUGS } from '../../types'
import styles from './Sidebar.module.css'

const NAV_ITEMS = Object.entries(POPULATION_TYPE_SLUGS).map(
  ([label, slug]) => ({ label, to: `/${slug}` })
)

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  useEffect(() => {
    if (!open) return

    const scrollY = window.scrollY
    document.body.style.top = `-${scrollY}px`
    document.body.classList.add('menu-open')

    return () => {
      document.body.classList.remove('menu-open')
      document.body.style.top = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={onClose} role="presentation" />
      )}
      <nav className={`${styles.nav} ${open ? styles.open : ''}`}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="メニューを閉じる"
        >
          {'\u2715'}
        </button>
        <ul className={styles.list}>
          {NAV_ITEMS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.link
                }
                onClick={onClose}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
