import { z } from '@hono/zod-openapi'

export const ErrorSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string(),
  error: z.string().optional(),
})
  .openapi('Error')

export const ItemStatSchema = z.object({
  itemName: z.string(),
  avg: z.number(),
  firstRate: z.number(),
  pickRate: z.number(),
}).openapi('ItemStat')

export const UnitStatSchema = z.object({
  unit: z.string(),
  avg: z.number(),
  firstRate: z.number(),
  pickRate: z.number(),
}).openapi('UnitStat')

const ContentElementSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['augment']).optional(),
})

export const TierListSchema = z.object({
  content: z.array(ContentElementSchema).optional(),
  label: z.string().optional(),
  color: z.string().optional(),
}).openapi('TierList')

const BuildSchema = z.object({
  count: z.number().int().optional(),
  avg: z.number().optional(),
  unit: z.string().optional(),
  buildName: z.array(z.string()).optional(),
})

export const CompV2Schema = z.object({
  clusterId: z.number().int(),
  id: z.number().int(),
  units: z.array(z.string()).optional(),
  traits: z.array(z.string()).optional(),
  name: z.string().optional(),
  pickRate: z.number().optional(),
  avg: z.number().optional(),
  firstRate: z.number().optional(),
  top4Rate: z.number().optional(),
  stars: z.array(z.string()).optional(),
  stars_4: z.array(z.string()).optional(),
  builds: z.array(BuildSchema).optional(),
  levelling: z.enum(['Fast 8', 'Fast 9', 'lvl 5', 'lvl 6', 'lvl 7', 'Standard']).optional(),
  updatedAt: z.string().optional(),
}).openapi('CompV2')

const CounterSchema = z.object({
  against: z.number().optional(),
  place_change: z.number().optional(),
  similarity: z.number().optional(),
})

const FinalLevelSchema = z.object({
  level: z.string().optional(),
  count: z.number().int().optional(),
  avg: z.number().optional(),
})

const UnitDetailSchema = z.object({
  count: z.number().int().optional(),
  avg: z.number().optional(),
  units: z.string().optional(),
  place_change: z.number().optional(),
  unit_pick: z.number().optional(),
  item_pick: z.number().optional(),
})

const CompItemSchema = z.object({
  itemNames: z.string(),
  count: z.number().int().optional(),
  avg: z.number().optional(),
  pcnt: z.number().optional(),
  units: z.array(UnitDetailSchema).optional(),
})

const PositioningSchema = z.object({
  unit: z.string().optional(),
  position: z.number().int().optional(),
})

const OptionSchema = z.object({
  unit_list: z.string().optional(),
  count: z.number().int().optional(),
  avg: z.number().optional(),
  win: z.number().optional(),
})

export const CompDetailV2Schema = z.object({
  id: z.number().int().optional(),
  counters: z.array(CounterSchema).optional(),
  final_level: z.array(FinalLevelSchema).optional(),
  item: z.array(CompItemSchema).optional(),
  trends: z.enum(['up', 'down', 'steady']).optional(),
  positioning: z.array(PositioningSchema).optional(),
  early_options: z.record(z.string(), z.array(OptionSchema)).optional(),
  options: z.record(z.string(), z.array(OptionSchema)).optional(),
}).openapi('CompDetailV2')

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
