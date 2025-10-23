import { Hono } from 'hono'
import { taskScheduler } from '../scheduler'

const schedulerRoutes = new Hono()

// GET /api/scheduler/status - 获取定时任务状态
schedulerRoutes.get('/status', (c) => {
  const tasks = taskScheduler.getStatus()
  return c.json({
    success: true,
    tasks,
  })
})

// POST /api/scheduler/trigger/:taskName - 手动触发爬虫任务
schedulerRoutes.post('/trigger/:taskName', async (c) => {
  const taskName = c.req.param('taskName')
  const result = await taskScheduler.trigger(taskName)

  return c.json({
    success: result,
    message: result ? `任务 ${taskName} 已触发执行` : `任务 ${taskName} 触发失败`,
  })
})

export default schedulerRoutes
