import { Hono } from 'hono'
import { clearCache, getCacheStats } from '../middleware'

const cacheRoutes = new Hono()

// GET /api/cache/stats - 获取缓存统计信息
cacheRoutes.get('/stats', (c) => {
  const stats = getCacheStats()
  return c.json({
    success: true,
    data: stats,
  })
})

// POST /api/cache/clear - 清除缓存
// 支持查询参数: pattern (正则表达式模式)
cacheRoutes.post('/clear', (c) => {
  const pattern = c.req.query('pattern')
  const cleared = clearCache(pattern)

  return c.json({
    success: true,
    message: `Cleared ${cleared} cache entries`,
    cleared,
    pattern: pattern || 'all',
  })
})

export default cacheRoutes
