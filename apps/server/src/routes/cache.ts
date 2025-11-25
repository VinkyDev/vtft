import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { clearCache, getCacheStats } from '../middleware'

const cacheRoutes = new OpenAPIHono()

const statsRoute = createRoute({
  method: 'get',
  path: '/stats',
  tags: ['Cache'],
  summary: '获取缓存统计信息',
  responses: {
    200: {
      description: '成功返回缓存统计信息',
      content: {
        'application/json': {
          schema: z.object({ success: z.boolean(), data: z.object({ size: z.number().int(), max: z.number().int(), calculatedSize: z.number().int().optional() }) }),
        },
      },
    },
  },
})

cacheRoutes.openapi(statsRoute, (c) => {
  const stats = getCacheStats()
  return c.json({ success: true, data: stats })
})

const clearRoute = createRoute({
  method: 'post',
  path: '/clear',
  tags: ['Cache'],
  summary: '清除缓存',
  request: {
    query: z.object({ pattern: z.string().optional().openapi({ description: '正则表达式模式' }) }),
  },
  responses: {
    200: {
      description: '清除结果',
      content: {
        'application/json': {
          schema: z.object({ success: z.boolean(), message: z.string(), cleared: z.number().int(), pattern: z.string() }),
        },
      },
    },
  },
})

cacheRoutes.openapi(clearRoute, (c) => {
  const { pattern } = c.req.valid('query')
  const cleared = clearCache(pattern)
  return c.json({ success: true, message: `Cleared ${cleared} cache entries`, cleared, pattern: pattern || 'all' })
})

export default cacheRoutes
