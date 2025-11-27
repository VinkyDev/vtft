import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { getQueueBySeason, getSeasonNames } from '../config/seasons'
import { ErrorSchema } from '../openapi/schemas'
import { lookupsService } from '../services'

const lookupsRoutes = new OpenAPIHono()

const getRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Lookups'],
  summary: '基础数据字典',
  description: '返回指定赛季的基础数据字典（物品、单位、羁绊、强化等）。',
  request: {
    query: z.object({ season: z.enum(getSeasonNames()).optional().openapi({ description: '赛季' }) }),
  },
  responses: {
    200: {
      description: '成功返回 Lookups 数据',
      content: { 'application/json': { schema: z.object({ success: z.boolean(), data: z.unknown() }) } },
    },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

lookupsRoutes.openapi(getRoute, async (c) => {
  const { season } = c.req.valid('query')
  if (season && !getQueueBySeason(season)) {
    throw new HTTPException(400, { message: `Invalid season: ${season}` })
  }
  const data = await lookupsService.get(season)
  return c.json({ success: true, data }) as unknown as RouteConfigToTypedResponse<typeof getRoute>
})

export default lookupsRoutes
