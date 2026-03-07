import styles from './ControlPanel.module.css'
import { PopulationTypeSelector } from './PopulationTypeSelector'
import { PrefectureSelector } from './PrefectureSelector'

export const ControlPanel = () => {
  return (
    <section>
      <h2 className={styles.sectionTitle}>都道府県</h2>
      <PrefectureSelector />
      <div className={styles.populationType}>
        <h3 className={styles.sectionTitle}>人口種別</h3>
        <PopulationTypeSelector />
      </div>
    </section>
  )
}
