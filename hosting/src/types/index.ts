export interface Prefecture {
  prefCode: number
  prefName: string
}

export interface PopulationEntry {
  year: number
  value: number
}

export interface PopulationComposition {
  label: string
  data: PopulationEntry[]
}

export type PopulationType = '総人口' | '年少人口' | '生産年齢人口' | '老年人口'

export const POPULATION_TYPE_SLUGS = {
  総人口: 'total',
  年少人口: 'young',
  生産年齢人口: 'working-age',
  老年人口: 'elderly',
} as const

export type PopulationTypeSlug = (typeof POPULATION_TYPE_SLUGS)[PopulationType]

export const SLUG_TO_POPULATION_TYPE = Object.fromEntries(
  Object.entries(POPULATION_TYPE_SLUGS).map(([k, v]) => [v, k])
) as Record<PopulationTypeSlug, PopulationType>
