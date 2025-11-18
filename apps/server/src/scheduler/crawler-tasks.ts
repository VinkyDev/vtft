import type { ScheduledTask } from './index'
import process from 'node:process'
import { clearCache } from '../middleware'

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
 */
export function createCrawlerTasks(): ScheduledTask[] {
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
      defaultSchedule: '10 4,10,16,22 * * *', // 每天4:10, 10:10, 16:10, 22:10
      defaultEnabled: true,
      importPath: 'crawler',
      crawlFnName: 'crawlChampions',
      saveFnName: 'saveChampions',
    },
    {
      name: 'items',
      defaultSchedule: '5 4,10,16,22 * * *', // 每天4:05, 10:05, 16:05, 22:05
      defaultEnabled: true,
      importPath: 'crawler',
      crawlFnName: 'crawlItemMeta',
      saveFnName: 'saveItems',
    },
    {
      name: 'augments',
      defaultSchedule: '0 4,10,16,22 * * *', // 每天4:00, 10:00, 16:00, 22:00
      defaultEnabled: true,
      importPath: 'crawler',
      crawlFnName: 'crawlAugments',
      saveFnName: 'saveAugments',
    },
    {
      name: 'comps',
      defaultSchedule: '30 4,10,16,22 * * *', // 每天4:30, 10:30, 16:30, 22:30
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
          // 刷新缓存
          clearCache()
        }
        else {
          throw new Error(`未知的爬虫任务: ${taskConfig.name}`)
        }
      },
    }
  })
}
