import { useCallback, useRef, useState } from 'react'

import { fetchPopulation } from '../api/client'
import type { PopulationComposition } from '../types'

export interface PrefPopulation {
  prefCode: number
  prefName: string
  data: PopulationComposition[]
}

export const usePopulation = () => {
  const [populations, setPopulations] = useState<PrefPopulation[]>([])
  const cache = useRef<Map<number, PopulationComposition[]>>(new Map())

  const addPrefecture = useCallback(
    async (prefCode: number, prefName: string) => {
      let data = cache.current.get(prefCode)
      if (!data) {
        data = await fetchPopulation(prefCode)
        cache.current.set(prefCode, data)
      }
      setPopulations((prev) => [...prev, { prefCode, prefName, data }])
    },
    []
  )

  const removePrefecture = useCallback((prefCode: number) => {
    setPopulations((prev) => prev.filter((p) => p.prefCode !== prefCode))
  }, [])

  return { populations, addPrefecture, removePrefecture }
}
