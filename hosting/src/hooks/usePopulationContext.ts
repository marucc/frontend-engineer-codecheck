import { useContext } from 'react'

import { PopulationContext } from '../context/populationContextValue'

export const usePopulationContext = () => {
  const context = useContext(PopulationContext)
  if (!context) {
    throw new Error(
      'usePopulationContext must be used within PopulationProvider'
    )
  }
  return context
}
