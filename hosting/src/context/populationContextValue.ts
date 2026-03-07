import { createContext } from 'react'

import type { PrefPopulation } from '../hooks/usePopulation'
import type { PopulationType } from '../types'

export interface PopulationContextValue {
  populations: PrefPopulation[]
  populationType: PopulationType
  addPrefecture: (prefCode: number, prefName: string) => Promise<void>
  removePrefecture: (prefCode: number) => void
  setPopulationType: (type: PopulationType) => void
}

export const PopulationContext = createContext<PopulationContextValue | null>(
  null
)
