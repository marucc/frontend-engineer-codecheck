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
  const { populations, selectedCodes, loadingCodes, error, togglePrefecture } =
    usePopulation()

  return (
    <PopulationContext.Provider
      value={{
        populations,
        populationType: initialType,
        selectedCodes,
        loadingCodes,
        error,
        togglePrefecture,
      }}
    >
      {children}
    </PopulationContext.Provider>
  )
}
