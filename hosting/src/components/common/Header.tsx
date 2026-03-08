import styles from './Header.module.css'

interface HeaderProps {
  menuOpen: boolean
  onMenuToggle: () => void
}

export const Header = ({ menuOpen, onMenuToggle }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuToggle}
        aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? '\u2715' : '\u2630'}
      </button>
      <h1>人口推移グラフ</h1>
      <div className={styles.spacer} aria-hidden="true" />
    </header>
  )
}
