import { Chart } from '../components/chart/Chart'
import { ControlPanel } from '../components/controls/ControlPanel'
import { PopulationProvider } from '../context/PopulationContext'

export const Home = () => {
  return (
    <PopulationProvider>
      <ControlPanel />
      <Chart />
    </PopulationProvider>
  )
}
