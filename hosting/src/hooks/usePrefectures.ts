import { useEffect, useState } from 'react'

import { fetchPrefectures } from '../api/client'
import type { Prefecture } from '../types'

export const usePrefectures = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPrefectures()
      .then(setPrefectures)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : '不明なエラー')
      )
      .finally(() => setLoading(false))
  }, [])

  return { prefectures, loading, error }
}
