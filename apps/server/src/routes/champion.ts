import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { ChampionSchema, ErrorSchema, PaginationSchema } from '../openapi/schemas'
import { championService } from '../services'

const championRoutes = new OpenAPIHono()

const listChampionsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Champions'],
  summary: '查询英雄',
  description: '统一的英雄查询接口，支持多条件筛选、排序和分页。',
  request: {
    query: z.object({
      page: z
        .number()
        .int()
        .default(-1)
        .openapi({ description: '页码（从1开始），-1表示不分页', example: -1 }),
      pageSize: z
        .number()
        .int()
        .default(-1)
        .openapi({ description: '每页数量，-1表示不分页', example: -1 }),
      cost: z.string().optional().openapi({ description: '费用筛选，逗号分隔' }),
      name: z.string().optional().openapi({ description: '名称筛选，逗号分隔' }),
      sortBy: z
        .enum(['rank', 'cost', 'avgPlace', 'top4Rate', 'firstPlaceRate'])
        .default('rank'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }),
  },
  responses: {
    200: {
      description: '成功返回英雄列表',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            data: z.array(ChampionSchema),
            count: z.number(),
            total: z.number(),
            pagination: PaginationSchema.optional(),
          }),
        },
      },
    },
    400: {
      description: '参数错误',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

championRoutes.openapi(listChampionsRoute, async (c) => {
  const q = c.req.valid('query')

  const page = q.page
  const pageSize = q.pageSize
  const sortBy = q.sortBy
  const sortOrder = q.sortOrder

  const costs = q.cost
    ? q.cost.split(',').map(Number).filter(n => !Number.isNaN(n))
    : undefined
  const names = q.name
    ? q.name.split(',').map(s => s.trim()).filter(Boolean)
    : undefined

  if (Number.isNaN(page) || (page !== -1 && page < 1)) {
    throw new HTTPException(400, { message: 'Invalid page. Must be -1 or a positive number' })
  }
  if (Number.isNaN(pageSize) || (pageSize !== -1 && (pageSize < 1 || pageSize > 100))) {
    throw new HTTPException(400, { message: 'Invalid pageSize. Must be -1 or between 1 and 100' })
  }
  if (costs && costs.some(v => v < 1 || v > 5)) {
    throw new HTTPException(400, { message: 'Invalid cost values. Must be between 1 and 5' })
  }

  const result = await championService.queryChampions({
    page,
    pageSize,
    costs,
    names,
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
  }) as unknown as RouteConfigToTypedResponse<typeof listChampionsRoute>
})

export default championRoutes
