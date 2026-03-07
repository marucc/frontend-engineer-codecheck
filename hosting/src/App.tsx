import styles from './App.module.css'
import { Chart } from './components/chart/Chart'
import { Footer } from './components/common/Footer'
import { Header } from './components/common/Header'
import { ControlPanel } from './components/controls/ControlPanel'
import { PopulationProvider } from './context/PopulationContext'

export const App = () => {
  return (
    <PopulationProvider>
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <ControlPanel />
          <Chart />
        </main>
        <Footer />
      </div>
    </PopulationProvider>
  )
}
