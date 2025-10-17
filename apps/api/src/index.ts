import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { openapiConfig } from './config/openapi'
import { errorHandler, requestLogger } from './middleware'
import apiRoutes from './routes'
import { databaseService } from './services'

const app = new Hono()

// 全局中间件
app.use('*', requestLogger)
app.use('*', cors())
app.use('*', errorHandler)

// 根路由
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'TFT API Server',
    version: '1.0.0',
    docs: '/docs',
    openapi: '/openapi.json',
    description: '云顶之弈数据 API - 统一查询接口',
    features: [
      '统一的查询端点',
      '灵活的多条件筛选',
      '可选的分页支持',
      '自定义排序',
    ],
    endpoints: {
      champions: {
        url: '/api/champions',
        description: '查询英雄数据',
        params: 'page, pageSize, cost, name, sortBy, sortOrder',
      },
      items: {
        url: '/api/items',
        description: '查询装备数据',
        params: 'page, pageSize, name, champion, sortBy, sortOrder',
      },
      augments: {
        url: '/api/augments',
        description: '查询强化符文数据',
        params: 'page, pageSize, name, level, tier, sortBy, sortOrder',
      },
      comps: {
        url: '/api/comps',
        description: '查询阵容数据',
        params: 'page, pageSize, name, tier, levelType, sortBy, sortOrder',
      },
      compById: {
        url: '/api/comps/:compId',
        description: '获取单个阵容',
        params: 'includeDetails',
      },
    },
  })
})

// 健康检查
app.get('/health', (c) => {
  const dbConnected = databaseService.isConnected()
  return c.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
  })
})

// 挂载 API 路由
app.route('/api', apiRoutes)

// OpenAPI JSON 文档
app.get('/openapi.json', (c) => {
  return c.json(openapiConfig)
})

// Swagger UI
app.get(
  '/docs',
  swaggerUI({
    url: '/openapi.json',
  }),
)

// 404 处理
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found',
    path: c.req.path,
  }, 404)
})

const port = Number(process.env.PORT) || 3000

// 启动服务器
async function start() {
  try {
    // 连接数据库
    await databaseService.connect()

    // 启动 HTTP 服务器
    serve({
      fetch: app.fetch,
      port,
    })

    console.log(`✓ Server is running on http://localhost:${port}`)
    console.log(`✓ API base URL: http://localhost:${port}/api`)
    console.log(`✓ Swagger UI: http://localhost:${port}/docs`)
  }
  catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...')
  await databaseService.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...')
  await databaseService.disconnect()
  process.exit(0)
})

start()
