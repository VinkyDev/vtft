import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { getSeasons } from '../config/seasons'

const seasonsRoutes = new OpenAPIHono()

const listSeasonsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Meta'],
  summary: '赛季与 Queue 映射',
  description: '返回当前所有赛季及其对应的 Queue 值（写死）。',
  responses: {
    200: {
      description: '成功返回赛季映射',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(z.object({ season: z.string(), queue: z.string() })),
          }),
        },
      },
    },
  },
})

seasonsRoutes.openapi(listSeasonsRoute, (c) => {
  const data = getSeasons()
  return c.json({ success: true, data })
})

export default seasonsRoutes
