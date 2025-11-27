import type { RouteConfigToTypedResponse } from '@hono/zod-openapi'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'

import { ErrorSchema } from '../openapi/schemas'
import { unitItemsService } from '../services'

const unitItemsRoutes = new OpenAPIHono()

const getRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['UnitItems'],
  summary: '单位物品数据',
  description: '返回当前版本的单位物品处理数据。',

  responses: {
    200: { description: '成功返回单位物品数据', content: { 'application/json': { schema: z.object({ success: z.boolean(), data: z.unknown() }) } } },
    400: { description: '参数错误', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

unitItemsRoutes.openapi(getRoute, async (c) => {
  const data = await unitItemsService.get()
  return c.json({ success: true, data }) as unknown as RouteConfigToTypedResponse<typeof getRoute>
})

export default unitItemsRoutes
