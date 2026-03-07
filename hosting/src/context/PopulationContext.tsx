import { type ReactNode, useState } from 'react'

import { usePopulation } from '../hooks/usePopulation'
import type { PopulationType } from '../types'
import { PopulationContext } from './populationContextValue'

export const PopulationProvider = ({ children }: { children: ReactNode }) => {
  const { populations, addPrefecture, removePrefecture } = usePopulation()
  const [populationType, setPopulationType] = useState<PopulationType>('総人口')

  return (
    <PopulationContext.Provider
      value={{
        populations,
        populationType,
        addPrefecture,
        removePrefecture,
        setPopulationType,
      }}
    >
      {children}
    </PopulationContext.Provider>
  )
}
