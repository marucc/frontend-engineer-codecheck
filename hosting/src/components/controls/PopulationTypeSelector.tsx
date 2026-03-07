import { usePopulationContext } from '../../context/PopulationContext'
import type { PopulationType } from '../../types'
import styles from './PopulationTypeSelector.module.css'

const POPULATION_TYPES: PopulationType[] = [
  '総人口',
  '年少人口',
  '生産年齢人口',
  '老年人口',
]

export const PopulationTypeSelector = () => {
  const { populationType, setPopulationType } = usePopulationContext()
  return (
    <div className={styles.container}>
      {POPULATION_TYPES.map((type) => (
        <label key={type} className={styles.label}>
          <input
            type="radio"
            name="populationType"
            value={type}
            checked={populationType === type}
            onChange={() => setPopulationType(type)}
          />
          {type}
        </label>
      ))}
    </div>
  )
}
