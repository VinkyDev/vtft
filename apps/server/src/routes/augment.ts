import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { TierListSchema } from '../openapi/schemas'
import { augmentService } from '../services'

const augmentRoutes = new OpenAPIHono()

const listAugmentsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Augments'],
  summary: '强化符文统计',
  description: '返回全部强化符文 TierList（无分页）。',
  responses: {
    200: {
      description: '成功返回强化符文列表',
      content: {
        'application/json': {
          schema: z.object({ success: z.boolean(), data: z.array(TierListSchema) }),
        },
      },
    },
  },
})

augmentRoutes.openapi(listAugmentsRoute, async (c) => {
  const data = await augmentService.list()
  return c.json({ success: true, data }) as unknown as RouteConfigToTypedResponse<typeof listAugmentsRoute>
})

export default augmentRoutes
