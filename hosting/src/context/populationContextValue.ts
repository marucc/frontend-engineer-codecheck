import { createContext } from 'react'

import type { PrefPopulation } from '../hooks/usePopulation'
import type { PopulationType } from '../types'

export interface PopulationContextValue {
  populations: PrefPopulation[]
  populationType: PopulationType
  selectedCodes: Set<number>
  loadingCodes: Set<number>
  error: string | null
  addPrefecture: (prefCode: number, prefName: string) => Promise<void>
  removePrefecture: (prefCode: number) => void
}

export const PopulationContext = createContext<PopulationContextValue | null>(
  null
)
