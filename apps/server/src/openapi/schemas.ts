import { z } from '@hono/zod-openapi'

export const PaginationSchema = z.object({
  page: z.number().int().openapi({ description: '当前页码' }),
  pageSize: z.number().int().openapi({ description: '每页数量' }),
  totalPages: z.number().int().openapi({ description: '总页数' }),
}).openapi('Pagination')

export const ErrorSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string(),
  error: z.string().optional(),
})
  .openapi('Error')

export const ChampionSchema = z.object({
  rank: z.number().int(),
  name: z.string(),
  icon: z.string(),
  traits: z.array(z.any()).optional(),
  cost: z.number().int().optional(),
  avgPlace: z.number().optional(),
  top4Rate: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  matches: z.number().int().optional(),
}).openapi('Champion')

export const ItemSchema = z.object({
  rank: z.number().int(),
  name: z.string(),
  icon: z.string(),
  components: z.array(z.string()).optional(),
  avgPlace: z.number().optional(),
  top4Rate: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  matches: z.number().int().optional(),
  recommendedFor: z.array(z.string()).optional(),
}).openapi('Item')

export const AugmentSchema = z.object({
  rank: z.number().int(),
  name: z.string(),
  icon: z.string(),
  level: z.enum(['Silver', 'Gold', 'Prismatic']),
  tier: z.string().optional(),
  avgPlace: z.number().optional(),
  top4Rate: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  matches: z.number().int().optional(),
}).openapi('Augment')

const CompTraitSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  activeLevel: z.number().int().optional(),
  maxLevel: z.number().int().optional(),
})

const CompChampionSchema = z.object({
  name: z.string(),
  icon: z.string(),
  cost: z.number().int().optional(),
  level: z.number().int().optional(),
  items: z.array(z.string()).optional(),
})

export const CompSchema = z.object({
  compId: z.string(),
  rank: z.number().int(),
  name: z.string(),
  tier: z.string().optional(),
  level: z.number().int().optional(),
  levelType: z.string().optional(),
  avgPlace: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  top4Rate: z.number().optional(),
  pickRate: z.number().optional(),
  traits: z.array(CompTraitSchema),
  champions: z.array(CompChampionSchema),
}).openapi('Comp')

export const CompWithDetailsSchema = z.object({
  compId: z.string(),
  rank: z.number().int().optional(),
  name: z.string().optional(),
  tier: z.string().optional(),
  level: z.number().int().optional(),
  levelType: z.string().optional(),
  avgPlace: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  top4Rate: z.number().optional(),
  pickRate: z.number().optional(),
  traits: z.array(CompTraitSchema).optional(),
  champions: z.array(CompChampionSchema).optional(),
  details: z.object({}).loose().optional(),
}).openapi('CompWithDetails')

const SchedulerTaskSchema = z.object({
  name: z.string(),
  running: z.boolean(),
  schedule: z.string().optional(),
  enabled: z.boolean(),
}).openapi('SchedulerTask')

export const SchedulerStatusResponseSchema = z.object({
  success: z.boolean(),
  tasks: z.array(SchedulerTaskSchema),
}).openapi('SchedulerStatusResponse')

export const TriggerTaskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
}).openapi('TriggerTaskResponse')
