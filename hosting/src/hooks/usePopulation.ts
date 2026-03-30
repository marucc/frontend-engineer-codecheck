import { useCallback, useRef, useState } from 'react'

import { fetchPopulation } from '../api/client'
import type { PopulationComposition } from '../types'

export interface PrefPopulation {
  prefCode: number
  prefName: string
  styleIndex: number
  data: PopulationComposition[]
}

const LOADING_DELAY_MS = 300

export const usePopulation = () => {
  const [populations, setPopulations] = useState<PrefPopulation[]>([])
  const [selectedCodes, setSelectedCodes] = useState<Set<number>>(new Set())
  const [loadingCodes, setLoadingCodes] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const cache = useRef<Map<number, PopulationComposition[]>>(new Map())
  const styleCounter = useRef(0)
  const fetchingRef = useRef<Set<number>>(new Set())
  const cancelledRef = useRef<Set<number>>(new Set())
  const selectedRef = useRef<Set<number>>(new Set())

  const togglePrefecture = useCallback(
    async (prefCode: number, prefName: string) => {
      if (selectedRef.current.has(prefCode)) {
        // OFF
        selectedRef.current.delete(prefCode)
        cancelledRef.current.add(prefCode)
        setSelectedCodes((prev) => {
          const next = new Set(prev)
          next.delete(prefCode)
          return next
        })
        setPopulations((prev) => prev.filter((p) => p.prefCode !== prefCode))
        return
      }

      // ON
      if (fetchingRef.current.has(prefCode)) {
        // Re-check during fetch: cancel the cancellation
        selectedRef.current.add(prefCode)
        cancelledRef.current.delete(prefCode)
        setSelectedCodes((prev) => new Set(prev).add(prefCode))
        return
      }

      selectedRef.current.add(prefCode)
      fetchingRef.current.add(prefCode)
      setError(null)
      setSelectedCodes((prev) => new Set(prev).add(prefCode))

      const cached = cache.current.get(prefCode)
      if (cached) {
        const styleIndex = styleCounter.current++
        setPopulations((prev) => {
          if (prev.some((p) => p.prefCode === prefCode)) return prev
          return [...prev, { prefCode, prefName, styleIndex, data: cached }]
        })
        fetchingRef.current.delete(prefCode)
        return
      }

      const timer = setTimeout(() => {
        if (fetchingRef.current.has(prefCode)) {
          setLoadingCodes((prev) => new Set(prev).add(prefCode))
        }
      }, LOADING_DELAY_MS)

      try {
        const fetched = await fetchPopulation(prefCode)
        cache.current.set(prefCode, fetched)

        if (cancelledRef.current.has(prefCode)) return
        const styleIndex = styleCounter.current++
        setPopulations((prev) => {
          if (prev.some((p) => p.prefCode === prefCode)) return prev
          return [...prev, { prefCode, prefName, styleIndex, data: fetched }]
        })
      } catch {
        selectedRef.current.delete(prefCode)
        setSelectedCodes((prev) => {
          const next = new Set(prev)
          next.delete(prefCode)
          return next
        })
        setError('グラフデータの読み込みに失敗しました')
      } finally {
        clearTimeout(timer)
        fetchingRef.current.delete(prefCode)
        cancelledRef.current.delete(prefCode)
        setLoadingCodes((prev) => {
          const next = new Set(prev)
          next.delete(prefCode)
          return next
        })
      }
    },
    []
  )

  return {
    populations,
    selectedCodes,
    loadingCodes,
    error,
    togglePrefecture,
  }
}
