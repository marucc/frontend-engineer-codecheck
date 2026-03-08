import type { ReactNode } from 'react'

import { usePopulation } from '../hooks/usePopulation'
import type { PopulationType } from '../types'
import { PopulationContext } from './populationContextValue'

interface PopulationProviderProps {
  children: ReactNode
  initialType: PopulationType
}

export const PopulationProvider = ({
  children,
  initialType,
}: PopulationProviderProps) => {
  const { populations, addPrefecture, removePrefecture } = usePopulation()

  return (
    <PopulationContext.Provider
      value={{
        populations,
        populationType: initialType,
        addPrefecture,
        removePrefecture,
      }}
    >
      {children}
    </PopulationContext.Provider>
  )
}
