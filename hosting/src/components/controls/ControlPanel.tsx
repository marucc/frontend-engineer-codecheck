import { usePopulationContext } from '../../hooks/usePopulationContext'
import styles from './ControlPanel.module.css'
import { PrefectureSelector } from './PrefectureSelector'

export const ControlPanel = () => {
  const { populationType } = usePopulationContext()

  return (
    <section>
      <h2 className={styles.sectionTitle}>
        都道府県別の{populationType}推移グラフ
      </h2>
      <PrefectureSelector />
    </section>
  )
}
