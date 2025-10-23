import type { Context, Next } from 'hono'
import { LRUCache } from 'lru-cache'

interface CacheOptions {
  /** 缓存过期时间（毫秒），默认 300000 毫秒（5 分钟） */
  ttl?: number
  /** 自定义缓存键生成函数 */
  keyGenerator?: (c: Context) => string
  /** 缓存条件判断（返回 false 则不缓存） */
  condition?: (c: Context) => boolean
  /** 是否在响应头中添加缓存状态 */
  addHeaders?: boolean
}

interface CacheEntry {
  body: any
  status: number
  headers: Record<string, string>
  timestamp: number
}

/** 全局 LRU 缓存实例 */
const cache = new LRUCache<string, CacheEntry>({
  max: 50, // 最多缓存 50 个条目
  ttl: 1000 * 60 * 10, // 默认 10 分钟
  updateAgeOnGet: true, // 获取时更新年龄，实现真正的 LRU
  updateAgeOnHas: false, // has() 操作不更新年龄
})

/** 默认缓存键生成器 */
function defaultKeyGenerator(c: Context): string {
  const url = new URL(c.req.url)
  const params = new URLSearchParams(url.search)
  params.sort() // 排序确保一致性
  return `${c.req.method}:${url.pathname}?${params.toString()}`
}

/**
 * LRU 智能缓存中间件
 */
export function cacheMiddleware(options: CacheOptions = {}) {
  const {
    ttl = 1000 * 60 * 10,
    keyGenerator = defaultKeyGenerator,
    condition = () => true,
    addHeaders = true,
  } = options

  return async (c: Context, next: Next) => {
    // 仅缓存 GET 请求
    if (c.req.method !== 'GET') {
      return next()
    }

    // 检查缓存条件
    if (!condition(c)) {
      return next()
    }

    const cacheKey = keyGenerator(c)

    // 检查缓存
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      // 返回缓存数据
      if (addHeaders) {
        c.header('X-Cache', 'HIT')
        c.header('X-Cache-Time', new Date(cachedData.timestamp).toISOString())
      }

      // 恢复缓存的响应头
      Object.entries(cachedData.headers).forEach(([key, value]) => {
        c.header(key, value)
      })

      return c.json(cachedData.body, cachedData.status as any)
    }

    // 执行请求
    await next()

    // 仅缓存成功响应（2xx）
    if (c.res.status >= 200 && c.res.status < 300) {
      try {
        const responseClone = c.res.clone()
        const body = await responseClone.json()

        // 提取响应头
        const headers: Record<string, string> = {}
        c.res.headers.forEach((value, key) => {
          headers[key] = value
        })

        if (addHeaders) {
          c.header('X-Cache', 'MISS')
        }

        // 存入 LRU 缓存
        cache.set(cacheKey, {
          body,
          status: c.res.status,
          headers,
          timestamp: Date.now(),
        }, { ttl })
      }
      catch (error) {
        // 缓存失败不影响正常响应
        console.warn('Cache storage failed:', error)
      }
    }
  }
}

/** 获取缓存统计信息 */
export function getCacheStats() {
  return {
    size: cache.size, // 当前缓存条目数
    max: cache.max, // 最大缓存容量
    calculatedSize: cache.calculatedSize, // 计算的大小（如果使用了 sizeCalculation）
  }
}

/** 清除指定模式的缓存 */
export function clearCache(pattern?: string): number {
  if (!pattern) {
    const count = cache.size
    cache.clear()
    return count
  }

  const regex = new RegExp(pattern)
  const keys = [...cache.keys()]
  let cleared = 0

  keys.forEach((key) => {
    if (regex.test(key)) {
      cache.delete(key)
      cleared++
    }
  })

  return cleared
}

/** 导出缓存实例供外部使用 */
export { cache as cacheInstance }
