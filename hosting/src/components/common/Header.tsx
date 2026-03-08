import styles from './Header.module.css'

interface HeaderProps {
  onMenuOpen: () => void
}

export const Header = ({ onMenuOpen }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuOpen}
        aria-label="メニューを開く"
      >
        {'\u2630'}
      </button>
      <h1>人口推移グラフ</h1>
      <div className={styles.spacer} aria-hidden="true" />
    </header>
  )
}
