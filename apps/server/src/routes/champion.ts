import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { getQueueBySeason, getSeasonNames } from '../config/seasons'
import { ErrorSchema, UnitStatSchema } from '../openapi/schemas'
import { championService } from '../services'

const championRoutes = new OpenAPIHono()

const listUnitsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Units'],
  summary: '英雄单位统计',
  description: '返回全部单位统计（无分页）。',
  request: {
    query: z.object({ season: z.enum(getSeasonNames()).optional().openapi({ description: '赛季' }) }),
  },
  responses: {
    200: {
      description: '成功返回单位统计',
      content: {
        'application/json': {
          schema: z.object({ success: z.boolean(), data: z.array(UnitStatSchema) }),
        },
      },
    },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

championRoutes.openapi(listUnitsRoute, async (c) => {
  const { season } = c.req.valid('query')
  const queue = season ? getQueueBySeason(season) : null
  if (season && !queue) {
    throw new HTTPException(400, { message: `Invalid season: ${season}` })
  }
  const data = await championService.list(queue ?? undefined)
  return c.json({ success: true, data }) as RouteConfigToTypedResponse<typeof listUnitsRoute>
})

export default championRoutes
