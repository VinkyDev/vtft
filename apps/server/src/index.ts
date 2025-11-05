import { join } from 'node:path'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import dotenv from 'dotenv'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { logger as honoLogger } from 'hono/logger'
import { timing } from 'hono/timing'
import { Logger } from 'logger'
import { openapiConfig } from './config/openapi'
import { errorHandler } from './middleware'
import apiRoutes from './routes'
import { taskScheduler } from './scheduler'
import { createCrawlerTasks } from './scheduler/crawler-tasks'
import { databaseService } from './services'

const logger = new Logger({ namespace: 'server', withTime: true })

const projectRoot = join(__dirname, '../')
dotenv.config({ path: join(projectRoot, '.env') })

const app = new Hono()

// 1. 请求日志和性能追踪
app.use('*', timing())
app.use('*', honoLogger())

// 2. CORS 配置
app.use('*', cors())

// 3. 响应压缩
app.use(
  '*',
  compress({
    threshold: 1024,
  }),
)

// 4. ETag 支持
app.use('*', etag())

// 5. 错误处理
app.use('*', errorHandler)

// 健康检查
app.get('/health', (c) => {
  const dbConnected = databaseService.isConnected()
  const schedulerStatus = taskScheduler.getStatus()

  return c.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    scheduler: {
      tasks: schedulerStatus,
    },
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
  return c.json(
    {
      success: false,
      message: 'Endpoint not found',
      path: c.req.path,
    },
    404,
  )
})

const port = Number(process.env.PORT) || 3000

// 启动服务器
async function start() {
  try {
    // 连接数据库
    await databaseService.connect()

    // 注册爬虫定时任务
    const crawlerTasks = createCrawlerTasks()
    crawlerTasks.forEach(task => taskScheduler.register(task))
    logger.info(`✓ 已注册 ${crawlerTasks.length} 个爬虫任务`)

    // 启动所有已启用的定时任务
    taskScheduler.startAll()

    // 启动 HTTP 服务器
    serve({
      fetch: app.fetch,
      port,
    })

    logger.success(`✓ Server is running on http://localhost:${port}`)
    logger.info(`✓ API base URL: http://localhost:${port}/api`)
    logger.info(`✓ Swagger UI: http://localhost:${port}/docs`)
    logger.info(
      `✓ Scheduler status: http://localhost:${port}/api/scheduler/status`,
    )
  }
  catch (error) {
    logger.fatal({ message: 'Failed to start server', error: error as Error })
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  logger.info('\nShutting down gracefully...')
  taskScheduler.stopAll()
  await databaseService.disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('\nShutting down gracefully...')
  taskScheduler.stopAll()
  await databaseService.disconnect()
  process.exit(0)
})

start()
