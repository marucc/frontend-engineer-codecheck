import { useCallback, useRef, useState } from 'react'

import { fetchPopulation } from '../api/client'
import type { PopulationComposition } from '../types'

export interface PrefPopulation {
  prefCode: number
  prefName: string
  styleIndex: number
  data: PopulationComposition[]
}

export const usePopulation = () => {
  const [populations, setPopulations] = useState<PrefPopulation[]>([])
  const cache = useRef<Map<number, PopulationComposition[]>>(new Map())
  const styleCounter = useRef(0)
  const selectedRef = useRef<Set<number>>(new Set())

  const addPrefecture = useCallback(
    async (prefCode: number, prefName: string) => {
      selectedRef.current.add(prefCode)
      let data = cache.current.get(prefCode)
      if (!data) {
        data = await fetchPopulation(prefCode)
        cache.current.set(prefCode, data)
      }
      if (!selectedRef.current.has(prefCode)) return
      const styleIndex = styleCounter.current++
      setPopulations((prev) => {
        if (prev.some((p) => p.prefCode === prefCode)) return prev
        return [...prev, { prefCode, prefName, styleIndex, data }]
      })
    },
    []
  )

  const removePrefecture = useCallback((prefCode: number) => {
    selectedRef.current.delete(prefCode)
    setPopulations((prev) => prev.filter((p) => p.prefCode !== prefCode))
  }, [])

  return { populations, addPrefecture, removePrefecture }
}
