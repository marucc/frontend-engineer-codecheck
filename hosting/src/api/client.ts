import {
  populationResponseSchema,
  prefecturesResponseSchema,
} from '@fec/shared'

import type { PopulationComposition, Prefecture } from '../types'

export async function fetchPrefectures(): Promise<Prefecture[]> {
  const response = await fetch('/api/v1/prefectures')
  if (!response.ok) {
    throw new Error('都道府県の読み込みができませんでした')
  }
  try {
    const json: unknown = await response.json()
    return prefecturesResponseSchema.parse(json).result
  } catch {
    throw new Error('都道府県の読み込みができませんでした')
  }
}

export async function fetchPopulation(
  prefCode: number
): Promise<PopulationComposition[]> {
  const response = await fetch(`/api/v1/population/${prefCode}`)
  if (!response.ok) {
    throw new Error('グラフデータの読み込みができませんでした')
  }
  try {
    const json: unknown = await response.json()
    return populationResponseSchema.parse(json).result.data
  } catch {
    throw new Error('グラフデータの読み込みができませんでした')
  }
}
