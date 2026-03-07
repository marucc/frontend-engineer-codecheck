import type { PopulationComposition, Prefecture } from '../types'

interface PrefecturesResponse {
  result: Prefecture[]
}

interface PopulationResponse {
  result: {
    data: PopulationComposition[]
  }
}

export async function fetchPrefectures(): Promise<Prefecture[]> {
  const response = await fetch('/api/v1/prefectures')
  if (!response.ok) {
    throw new Error('都道府県の読み込みができませんでした')
  }
  const json: PrefecturesResponse = await response.json()
  return json.result
}

export async function fetchPopulation(
  prefCode: number
): Promise<PopulationComposition[]> {
  const response = await fetch(`/api/v1/population/${prefCode}`)
  if (!response.ok) {
    throw new Error('グラフデータの読み込みができませんでした')
  }
  const json: PopulationResponse = await response.json()
  return json.result.data
}
