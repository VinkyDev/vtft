import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { CompSchema, CompWithDetailsSchema, ErrorSchema, PaginationSchema } from '../openapi/schemas'
import { compService } from '../services'

const compRoutes = new OpenAPIHono()

const listCompsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Comps'],
  summary: '查询阵容',
  description: '统一的阵容查询接口，支持多条件筛选、排序和分页。',
  request: {
    query: z.object({
      page: z.number().int().default(-1),
      pageSize: z.number().int().default(-1),
      name: z.string().optional().openapi({ description: '名称筛选（模糊匹配）' }),
      tier: z.string().optional(),
      levelType: z.string().optional(),
      sortBy: z.enum(['rank', 'pickRate', 'firstPlaceRate', 'avgPlace', 'top4Rate']).default('rank'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
    }),
  },
  responses: {
    200: {
      description: '成功返回阵容列表',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(CompSchema),
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

compRoutes.openapi(listCompsRoute, async (c) => {
  const q = c.req.valid('query')
  const page = q.page
  const pageSize = q.pageSize

  if (Number.isNaN(page) || (page !== -1 && page < 1)) {
    throw new HTTPException(400, { message: 'Invalid page. Must be -1 or a positive number' })
  }
  if (Number.isNaN(pageSize) || (pageSize !== -1 && (pageSize < 1 || pageSize > 100))) {
    throw new HTTPException(400, { message: 'Invalid pageSize. Must be -1 or between 1 and 100' })
  }

  const result = await compService.queryComps({
    page,
    pageSize,
    name: q.name,
    tier: q.tier,
    levelType: q.levelType,
    sortBy: q.sortBy,
    sortOrder: q.sortOrder,
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
  }) as unknown as RouteConfigToTypedResponse<typeof listCompsRoute>
})

const getCompRoute = createRoute({
  method: 'get',
  path: '/{compId}',
  tags: ['Comps'],
  summary: '获取单个阵容',
  description: '根据 compId 获取阵容信息。',
  request: {
    params: z.object({ compId: z.string().openapi({ description: '阵容ID' }) }),
    query: z.object({ includeDetails: z.boolean().default(false) }).partial(),
  },
  responses: {
    200: {
      description: '成功返回阵容信息',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.union([CompSchema, CompWithDetailsSchema]),
          }),
        },
      },
    },
    404: { description: '阵容不存在', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

compRoutes.openapi(getCompRoute, async (c) => {
  const { compId } = c.req.valid('param')
  const includeDetails = c.req.valid('query').includeDetails ?? false

  if (includeDetails) {
    const details = await compService.getCompDetails(compId)
    if (!details) {
      throw new HTTPException(404, { message: `Details for comp '${compId}' not found` })
    }
    return c.json({ success: true, data: details }) as unknown as RouteConfigToTypedResponse<typeof getCompRoute>
  }
  const comp = await compService.getCompByCompId(compId)
  if (!comp) {
    throw new HTTPException(404, { message: `Comp '${compId}' not found` })
  }
  return c.json({ success: true, data: comp }) as unknown as RouteConfigToTypedResponse<typeof getCompRoute>
})

export default compRoutes
