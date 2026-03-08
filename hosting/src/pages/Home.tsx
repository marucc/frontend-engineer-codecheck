import { useLocation } from 'react-router-dom'

import { Chart } from '../components/chart/Chart'
import { ControlPanel } from '../components/controls/ControlPanel'
import { PopulationProvider } from '../context/PopulationContext'
import { type PopulationTypeSlug, SLUG_TO_POPULATION_TYPE } from '../types'
import styles from './Home.module.css'

export const Home = () => {
  const slug = useLocation().pathname.slice(1) as PopulationTypeSlug
  const populationType = SLUG_TO_POPULATION_TYPE[slug]

  return (
    <PopulationProvider initialType={populationType}>
      <div className={styles.container}>
        <ControlPanel />
        <Chart />
      </div>
    </PopulationProvider>
  )
}
