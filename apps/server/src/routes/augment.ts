import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { AugmentSchema, ErrorSchema, PaginationSchema } from '../openapi/schemas'
import { augmentService } from '../services'

const augmentRoutes = new OpenAPIHono()

const listAugmentsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Augments'],
  summary: '查询强化符文',
  description: '统一的强化符文查询接口，支持多条件筛选、排序和分页。',
  request: {
    query: z.object({
      page: z.number().int().default(-1),
      pageSize: z.number().int().default(-1),
      name: z.string().optional(),
      level: z.enum(['Silver', 'Gold', 'Prismatic']).optional(),
      tier: z.string().optional(),
      sortBy: z.enum(['rank', 'avgPlace', 'top4Rate', 'firstPlaceRate']).default('rank'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }),
  },
  responses: {
    200: {
      description: '成功返回强化符文列表',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(AugmentSchema),
            count: z.number(),
            total: z.number(),
            pagination: PaginationSchema.optional(),
          }),
        },
      },
    },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

augmentRoutes.openapi(listAugmentsRoute, async (c) => {
  const q = c.req.valid('query')
  const page = q.page
  const pageSize = q.pageSize
  const sortBy = q.sortBy
  const sortOrder = q.sortOrder

  const names = q.name ? q.name.split(',').map(s => s.trim()).filter(Boolean) : undefined
  const levels = q.level ? [q.level] : undefined
  const tiers = q.tier ? q.tier.split(',').map(s => s.trim()).filter(Boolean) : undefined

  if (Number.isNaN(page) || (page !== -1 && page < 1)) {
    throw new HTTPException(400, { message: 'Invalid page. Must be -1 or a positive number' })
  }
  if (Number.isNaN(pageSize) || (pageSize !== -1 && (pageSize < 1 || pageSize > 100))) {
    throw new HTTPException(400, { message: 'Invalid pageSize. Must be -1 or between 1 and 100' })
  }

  const result = await augmentService.queryAugments({
    page,
    pageSize,
    names,
    levels,
    tiers,
    sortBy,
    sortOrder,
  })

  const isPaginated = page !== -1 && pageSize !== -1
  return c.json({
    success: true,
    data: result.data,
    count: result.count,
    total: result.total,
    pagination: isPaginated
      ? { page, pageSize, totalPages: Math.ceil(result.total / pageSize) }
      : undefined,
  }) as unknown as RouteConfigToTypedResponse<typeof listAugmentsRoute>
})

export default augmentRoutes
