import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { ErrorSchema, SchedulerStatusResponseSchema, TriggerTaskResponseSchema } from '../openapi/schemas'
import { taskScheduler } from '../scheduler'

const schedulerRoutes = new OpenAPIHono()

const statusRoute = createRoute({
  method: 'get',
  path: '/status',
  tags: ['Scheduler'],
  summary: '获取定时任务状态',
  description: '查看所有爬虫定时任务的运行状态、调度时间等信息',
  responses: {
    200: { description: '成功返回定时任务状态', content: { 'application/json': { schema: SchedulerStatusResponseSchema } } },
  },
})

schedulerRoutes.openapi(statusRoute, (c) => {
  const tasks = taskScheduler.getStatus()
  return c.json({ success: true, tasks })
})

const triggerRoute = createRoute({
  method: 'post',
  path: '/trigger/{taskName}',
  tags: ['Scheduler'],
  summary: '手动触发爬虫任务',
  description: '立即执行指定的爬虫任务，无需等待定时调度。任务将在后台异步执行。',
  request: {
    params: z.object({
      taskName: z.enum(['crawler:champions', 'crawler:items', 'crawler:augments', 'crawler:comps']).openapi({ example: 'crawler:champions' }),
    }),
  },
  responses: {
    200: { description: '任务触发响应', content: { 'application/json': { schema: TriggerTaskResponseSchema } } },
    400: { description: '任务名称无效或任务不存在', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

schedulerRoutes.openapi(triggerRoute, async (c) => {
  const { taskName } = c.req.valid('param')
  const result = await taskScheduler.trigger(taskName)
  return c.json({ success: result, message: result ? `任务 ${taskName} 已触发执行` : `任务 ${taskName} 触发失败` })
})

export default schedulerRoutes
