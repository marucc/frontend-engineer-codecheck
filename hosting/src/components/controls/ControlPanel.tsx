import { usePopulationContext } from '../../hooks/usePopulationContext'
import styles from './ControlPanel.module.css'
import { PopulationTypeSelector } from './PopulationTypeSelector'
import { PrefectureSelector } from './PrefectureSelector'

export const ControlPanel = () => {
  const { populationType } = usePopulationContext()

  return (
    <section>
      <h2 className={styles.sectionTitle}>
        都道府県別の{populationType}推移グラフ
      </h2>
      <PrefectureSelector />
      <div className={styles.populationType}>
        <h3 className={styles.sectionTitle}>人口種別</h3>
        <PopulationTypeSelector />
      </div>
    </section>
  )
}
