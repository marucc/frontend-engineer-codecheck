import { z } from 'zod'

export const prefectureSchema = z.object({
  prefCode: z.number(),
  prefName: z.string(),
})

export const prefecturesResponseSchema = z.object({
  result: z.array(prefectureSchema),
})

export const populationEntrySchema = z.object({
  year: z.number(),
  value: z.number(),
})

export const populationCompositionSchema = z.object({
  label: z.string(),
  data: z.array(populationEntrySchema),
})

export const populationResponseSchema = z.object({
  result: z.object({
    data: z.array(populationCompositionSchema),
  }),
})

export type Prefecture = z.infer<typeof prefectureSchema>
export type PopulationEntry = z.infer<typeof populationEntrySchema>
export type PopulationComposition = z.infer<typeof populationCompositionSchema>
