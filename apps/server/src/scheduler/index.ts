import type { ScheduledTask as CronTask } from 'node-cron'
import { Logger } from 'logger'
import cron from 'node-cron'

const logger = new Logger({ namespace: 'scheduler', scope: 'index', withTime: true })

export interface ScheduledTask {
  name: string
  schedule: string
  enabled: boolean
  task: () => Promise<void>
}

class TaskScheduler {
  private tasks: Map<string, CronTask> = new Map()
  private taskConfigs: Map<string, ScheduledTask> = new Map()

  /**
   * 注册一个定时任务
   */
  register(config: ScheduledTask): void {
    if (this.taskConfigs.has(config.name)) {
      logger.warning(`任务 "${config.name}" 已存在，将被覆盖`)
      this.unregister(config.name)
    }

    this.taskConfigs.set(config.name, config)

    if (config.enabled) {
      this.start(config.name)
    }
  }

  /**
   * 启动指定任务
   */
  start(taskName: string): boolean {
    const config = this.taskConfigs.get(taskName)
    if (!config) {
      logger.error({ message: `任务 "${taskName}" 不存在`, error: new Error(`Task "${taskName}" not found`) })
      return false
    }

    if (this.tasks.has(taskName)) {
      logger.warning(`任务 "${taskName}" 已经在运行中`)
      return false
    }

    try {
      const task = cron.schedule(config.schedule, async () => {
        logger.info(`[定时任务] 开始执行: ${config.name}`)
        const startTime = Date.now()

        try {
          await config.task()
          const duration = Date.now() - startTime
          logger.success(`[定时任务] 执行完成: ${config.name} (耗时: ${duration}ms)`)
        }
        catch (error) {
          logger.error({ message: `[定时任务] 执行失败: ${config.name}`, error: error as Error })
        }
      }, {
        timezone: 'Asia/Shanghai',
      })

      this.tasks.set(taskName, task)
      logger.info(`[定时任务] 已启动: ${config.name} (cron: ${config.schedule})`)
      return true
    }
    catch (error) {
      logger.error({ message: `[定时任务] 启动失败: ${taskName}`, error: error as Error })
      return false
    }
  }

  /**
   * 停止指定任务
   */
  stop(taskName: string): boolean {
    const task = this.tasks.get(taskName)
    if (!task) {
      logger.warning(`任务 "${taskName}" 未运行`)
      return false
    }

    task.stop()
    this.tasks.delete(taskName)
    logger.info(`[定时任务] 已停止: ${taskName}`)
    return true
  }

  /**
   * 注销任务（停止并移除配置）
   */
  unregister(taskName: string): boolean {
    this.stop(taskName)
    this.taskConfigs.delete(taskName)
    return true
  }

  /**
   * 启动所有已启用的任务
   */
  startAll(): void {
    for (const [name, config] of this.taskConfigs) {
      if (config.enabled) {
        this.start(name)
      }
    }
  }

  /**
   * 停止所有任务
   */
  stopAll(): void {
    for (const [name] of this.tasks) {
      this.stop(name)
    }
  }

  /**
   * 获取所有任务状态
   */
  getStatus(): Array<{ name: string, running: boolean, schedule: string, enabled: boolean }> {
    return Array.from(this.taskConfigs.entries()).map(([name, config]) => ({
      name,
      running: this.tasks.has(name),
      schedule: config.schedule,
      enabled: config.enabled,
    }))
  }

  /**
   * 手动触发任务执行
   */
  async trigger(taskName: string): Promise<boolean> {
    const config = this.taskConfigs.get(taskName)
    if (!config) {
      logger.error({ message: `任务 "${taskName}" 不存在`, error: new Error(`Task "${taskName}" not found`) })
      return false
    }

    logger.info(`[定时任务] 手动触发: ${config.name}`)
    const startTime = Date.now()

    try {
      await config.task()
      const duration = Date.now() - startTime
      logger.success(`[定时任务] 手动执行完成: ${config.name} (耗时: ${duration}ms)`)
      return true
    }
    catch (error) {
      logger.error({ message: `[定时任务] 手动执行失败: ${config.name}`, error: error as Error })
      return false
    }
  }
}

export const taskScheduler = new TaskScheduler()
