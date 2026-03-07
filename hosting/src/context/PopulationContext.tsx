import { type ReactNode, createContext, useContext, useState } from 'react'

import { PrefPopulation, usePopulation } from '../hooks/usePopulation'
import type { PopulationType } from '../types'

interface PopulationContextValue {
  populations: PrefPopulation[]
  populationType: PopulationType
  addPrefecture: (prefCode: number, prefName: string) => Promise<void>
  removePrefecture: (prefCode: number) => void
  setPopulationType: (type: PopulationType) => void
}

const PopulationContext = createContext<PopulationContextValue | null>(null)

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

export const usePopulationContext = () => {
  const context = useContext(PopulationContext)
  if (!context) {
    throw new Error(
      'usePopulationContext must be used within PopulationProvider'
    )
  }
  return context
}
