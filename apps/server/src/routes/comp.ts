import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { getQueueBySeason, getSeasonNames } from '../config/seasons'
import { CompDetailV2Schema, CompV2Schema, ErrorSchema } from '../openapi/schemas'
import { compService } from '../services'

const compRoutes = new OpenAPIHono()

const listCompsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Comps'],
  summary: '查询全部阵容',
  description: '返回全部阵容基础数据（无分页）。',
  request: {
    query: z.object({ season: z.enum(getSeasonNames()).optional().openapi({ description: '赛季' }) }),
  },
  responses: {
    200: {
      description: '成功返回阵容列表',
      content: {
        'application/json': {
          schema: z.object({ success: z.boolean(), data: z.array(CompV2Schema) }),
        },
      },
    },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

compRoutes.openapi(listCompsRoute, async (c) => {
  const { season } = c.req.valid('query')
  const queue = season ? getQueueBySeason(season) : null
  if (season && !queue) {
    throw new HTTPException(400, { message: `Invalid season: ${season}` })
  }
  const data = await compService.list(queue ?? undefined)
  return c.json({ success: true, data }) as RouteConfigToTypedResponse<typeof listCompsRoute>
})

const getCompRoute = createRoute({
  method: 'get',
  path: '/{compId}',
  tags: ['Comps'],
  summary: '阵容详情查询',
  description: '根据 compId 返回阵容详情（无分页）。',
  request: { params: z.object({ compId: z.string() }) },
  responses: {
    200: {
      description: '成功返回阵容详情',
      content: { 'application/json': { schema: z.object({ success: z.boolean(), data: CompDetailV2Schema }) } },
    },
    404: { description: '阵容不存在' },
  },
})

compRoutes.openapi(getCompRoute, async (c) => {
  const { compId } = c.req.valid('param')
  const details = await compService.getDetails(compId)
  if (!details) {
    throw new HTTPException(404, { message: `Details for comp '${compId}' not found` })
  }
  return c.json({ success: true, data: details }) as RouteConfigToTypedResponse<typeof getCompRoute>
})

export default compRoutes
