import type { ScheduledTask } from './index'

/**
 * 爬虫任务配置
 * 使用环境变量控制是否启用和调度时间
 */
export interface CrawlerTaskConfig {
  name: string
  enabled: boolean
  schedule: string // Cron 表达式
  crawlFn: () => Promise<void>
}

/**
 * 从环境变量读取配置，提供默认值
 */
function getTaskConfig(
  taskName: string,
  defaultSchedule: string,
  defaultEnabled: boolean = true,
): { enabled: boolean, schedule: string } {
  const enabledEnvKey = `CRAWLER_${taskName.toUpperCase()}_ENABLED`
  const scheduleEnvKey = `CRAWLER_${taskName.toUpperCase()}_SCHEDULE`

  return {
    enabled: process.env[enabledEnvKey] === 'false' ? false : defaultEnabled,
    schedule: process.env[scheduleEnvKey] || defaultSchedule,
  }
}

/**
 * 创建爬虫任务配置
 *
 * 默认调度时间说明:
 * - champions: 每天凌晨 2:00 (数据更新较慢)
 * - items: 每天凌晨 2:30 (数据更新较慢)
 * - augments: 每天凌晨 3:00 (数据更新较慢)
 * - comps: 每 6 小时一次 (阵容数据变化较频繁)
 */
export function createCrawlerTasks(): ScheduledTask[] {
  // 动态导入爬虫函数以避免循环依赖
  const crawlerTasks: Array<{
    name: string
    defaultSchedule: string
    defaultEnabled: boolean
    importPath: string
    crawlFnName: string
    saveFnName: string
  }> = [
    {
      name: 'champions',
      defaultSchedule: '0 2 * * *', // 每天凌晨 2:00
      defaultEnabled: true,
      importPath: 'crawler',
      crawlFnName: 'crawlChampions',
      saveFnName: 'saveChampions',
    },
    {
      name: 'items',
      defaultSchedule: '30 2 * * *', // 每天凌晨 2:30
      defaultEnabled: true,
      importPath: 'crawler',
      crawlFnName: 'crawlItemMeta',
      saveFnName: 'saveItems',
    },
    {
      name: 'augments',
      defaultSchedule: '0 3 * * *', // 每天凌晨 3:00
      defaultEnabled: true,
      importPath: 'crawler',
      crawlFnName: 'crawlAugments',
      saveFnName: 'saveAugments',
    },
    {
      name: 'comps',
      defaultSchedule: '0 */6 * * *', // 每 6 小时
      defaultEnabled: true,
      importPath: 'crawler',
      crawlFnName: 'crawlComps',
      saveFnName: 'saveComps',
    },
  ]

  return crawlerTasks.map((taskConfig) => {
    const config = getTaskConfig(
      taskConfig.name,
      taskConfig.defaultSchedule,
      taskConfig.defaultEnabled,
    )

    return {
      name: `crawler:${taskConfig.name}`,
      schedule: config.schedule,
      enabled: config.enabled,
      task: async () => {
        // 根据任务类型执行对应的爬虫
        if (taskConfig.name === 'champions') {
          const { crawlChampions, saveChampions } = await import('crawler')
          const data = await crawlChampions({
            headless: true,
            debug: false,
            screenshot: false,
          })
          await saveChampions(data)
        }
        else if (taskConfig.name === 'items') {
          const { crawlItemMeta, saveItems } = await import('crawler')
          const data = await crawlItemMeta({
            headless: true,
            debug: false,
            screenshot: false,
          })
          await saveItems(data)
        }
        else if (taskConfig.name === 'augments') {
          const { crawlAugments, saveAugments } = await import('crawler')
          const data = await crawlAugments({
            headless: true,
            debug: false,
            screenshot: false,
          })
          await saveAugments(data)
        }
        else if (taskConfig.name === 'comps') {
          const { crawlComps, saveComps } = await import('crawler')
          const data = await crawlComps({
            headless: true,
            debug: false,
            screenshot: false,
          })
          await saveComps(data)
        }
        else {
          throw new Error(`未知的爬虫任务: ${taskConfig.name}`)
        }
      },
    }
  })
}

/**
 * Cron 表达式说明:
 *
 * 格式: 分 时 日 月 周
 *
 * 字段说明:
 * - 分钟 (0-59)
 * - 小时 (0-23)
 * - 日期 (1-31)
 * - 月份 (1-12)
 * - 星期几 (0-7, 0 和 7 都代表周日)
 *
 * 常用示例:
 * - '0 2 * * *'    每天凌晨 2:00
 * - '30 2 * * *'   每天凌晨 2:30
 * - '0 *\/6 * * *' 每 6 小时
 * - '0 0 * * 0'    每周日凌晨 0:00
 * - '0 0 1 * *'    每月 1 号凌晨 0:00
 */
