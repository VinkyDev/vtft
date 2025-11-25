import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { ErrorSchema, ItemSchema, PaginationSchema } from '../openapi/schemas'
import { itemService } from '../services'

const itemRoutes = new OpenAPIHono()

const listItemsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Items'],
  summary: '查询装备',
  description: '统一的装备查询接口，支持多条件筛选、排序和分页。',
  request: {
    query: z.object({
      page: z.number().int().default(-1).openapi({ description: '页码（从1开始），-1表示不分页' }),
      pageSize: z.number().int().default(-1).openapi({ description: '每页数量，-1表示不分页' }),
      name: z.string().optional().openapi({ description: '名称筛选，支持逗号分隔' }),
      champion: z.string().optional().openapi({ description: '推荐英雄筛选' }),
      sortBy: z.enum(['rank', 'avgPlace', 'top4Rate', 'firstPlaceRate']).default('rank'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }),
  },
  responses: {
    200: {
      description: '成功返回装备列表',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(ItemSchema),
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

itemRoutes.openapi(listItemsRoute, async (c) => {
  const q = c.req.valid('query')
  const page = q.page
  const pageSize = q.pageSize
  const sortBy = q.sortBy
  const sortOrder = q.sortOrder
  const champion = q.champion

  const names = q.name
    ? q.name.split(',').map(s => s.trim()).filter(Boolean)
    : undefined

  if (Number.isNaN(page) || (page !== -1 && page < 1)) {
    throw new HTTPException(400, { message: 'Invalid page. Must be -1 or a positive number' })
  }
  if (Number.isNaN(pageSize) || (pageSize !== -1 && (pageSize < 1 || pageSize > 100))) {
    throw new HTTPException(400, { message: 'Invalid pageSize. Must be -1 or between 1 and 100' })
  }

  const result = await itemService.queryItems({
    page,
    pageSize,
    names,
    champion,
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
  }) as unknown as RouteConfigToTypedResponse<typeof listItemsRoute>
})

export default itemRoutes
