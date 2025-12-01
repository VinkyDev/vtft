import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { getQueueBySeason, getSeasonNames } from '../config/seasons'
import { ErrorSchema, ItemStatSchema } from '../openapi/schemas'
import { itemService } from '../services'

const itemRoutes = new OpenAPIHono()

const listItemsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Items'],
  summary: '装备统计',
  description: '返回全部装备统计（无分页）。',
  request: {
    query: z.object({ season: z.enum(getSeasonNames()).optional().openapi({ description: '赛季' }) }),
  },
  responses: {
    200: {
      description: '成功返回装备统计',
      content: {
        'application/json': {
          schema: z.object({ success: z.boolean(), data: z.array(ItemStatSchema) }),
        },
      },
    },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

itemRoutes.openapi(listItemsRoute, async (c) => {
  const { season } = c.req.valid('query')
  const queue = season ? getQueueBySeason(season) : null
  if (season && !queue) {
    throw new HTTPException(400, { message: `Invalid season: ${season}` })
  }
  const data = await itemService.list(queue ?? undefined)
  return c.json({ success: true, data }) as RouteConfigToTypedResponse<typeof listItemsRoute>
})

export default itemRoutes
