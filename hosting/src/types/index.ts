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
