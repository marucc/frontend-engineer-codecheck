import { usePopulationContext } from '../../context/PopulationContext'
import styles from './Header.module.css'

export const Header = () => {
  const { populationType } = usePopulationContext()

  return (
    <header className={styles.header}>
      <h1>都道府県別の{populationType}推移グラフ</h1>
    </header>
  )
}
