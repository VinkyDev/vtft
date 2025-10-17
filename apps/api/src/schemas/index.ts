import { z } from 'zod'

// 响应包装 schemas
export function SuccessResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  })
}

export function SuccessListResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    count: z.number(),
  })
}

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
  stack: z.string().optional(),
})

// 英雄 schemas
export const ChampionSchema = z.object({
  rank: z.number(),
  name: z.string(),
  icon: z.string(),
  traits: z.array(z.string()).optional(),
  cost: z.number().optional(),
  avgPlace: z.number().optional(),
  top4Rate: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  matches: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// 装备 schemas
export const ItemSchema = z.object({
  rank: z.number(),
  name: z.string(),
  icon: z.string(),
  components: z.array(z.string()).optional(),
  avgPlace: z.number().optional(),
  top4Rate: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  matches: z.number().optional(),
  recommendedFor: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// 强化符文 schemas
export const AugmentSchema = z.object({
  rank: z.number(),
  name: z.string(),
  icon: z.string(),
  level: z.enum(['Silver', 'Gold', 'Prismatic']).optional(),
  tier: z.string().optional(),
  avgPlace: z.number().optional(),
  top4Rate: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  matches: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// 阵容 schemas
export const TraitSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  activeLevel: z.number().optional(),
  maxLevel: z.number().optional(),
})

export const ChampionInCompSchema = z.object({
  name: z.string(),
  icon: z.string().optional(),
  cost: z.number().optional(),
  level: z.number().optional(),
  items: z.array(z.string()).optional(),
})

export const CompSchema = z.object({
  compId: z.string().optional(),
  rank: z.number(),
  name: z.string(),
  tier: z.string().optional(),
  level: z.number().optional(),
  levelType: z.string().optional(),
  avgPlace: z.number().optional(),
  firstPlaceRate: z.number().optional(),
  top4Rate: z.number().optional(),
  pickRate: z.number().optional(),
  traits: z.array(TraitSchema),
  champions: z.array(ChampionInCompSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const CompDetailsSchema = z.any()

// 分页响应
export const PaginationSchema = z.object({
  skip: z.number(),
  limit: z.number(),
})

export const CompListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(CompSchema),
  count: z.number(),
  pagination: PaginationSchema,
})
