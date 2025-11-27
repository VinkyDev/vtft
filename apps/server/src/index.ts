import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import dotenv from 'dotenv'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { logger as honoLogger } from 'hono/logger'
import { timing } from 'hono/timing'
import { Logger } from 'logger'
import { errorHandler } from './middleware'
import apiRoutes from './routes'
import { taskScheduler } from './scheduler'
import { createCrawlerTasks } from './scheduler/crawler-tasks'
import { databaseService } from './services'

const _dirname
  = typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url))
const projectRoot = join(_dirname, '../')
dotenv.config({ path: join(projectRoot, '.env') })

const logger = new Logger({ namespace: 'server' })

const app = new OpenAPIHono()

app.use('*', timing())
app.use('*', honoLogger())
app.use('*', cors())
app.use('*', compress())
app.use('*', etag())
app.use('*', errorHandler)

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

app.route('/api', apiRoutes)

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'TFT API',
    version: '1.0.0',
  },
  servers: [{ url: '/' }],
})
app.get(
  '/docs',
  swaggerUI({
    url: '/openapi.json',
  }),
)

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

async function start() {
  try {
    await databaseService.connect()
    // 初始化索引
    await databaseService.getTFTDatabase().initializeIndexes()
    const crawlerTasks = createCrawlerTasks()

    crawlerTasks.forEach(task => taskScheduler.register(task))
    logger.info(`✓ 已注册 ${crawlerTasks.length} 个爬虫任务`)

    taskScheduler.startAll()
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
    logger.fatal('Failed to start server', error as Error)
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
