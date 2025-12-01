import type { ScheduledTask } from './index'
import { createBasicDataTask } from './tasks/basic-data'
import { createCompsTask } from './tasks/comps'

/**
 * 创建所有爬虫定时任务
 *
 * 必需的环境变量：
 * - CRAWLER_BASIC_DATA_ENABLED: 是否启用基础数据任务 ('true' | 'false')
 * - CRAWLER_BASIC_DATA_SCHEDULE: 基础数据任务的 cron 表达式
 * - CRAWLER_COMPS_ENABLED: 是否启用阵容数据任务 ('true' | 'false')
 * - CRAWLER_COMPS_SCHEDULE: 阵容数据任务的 cron 表达式
 * - CRAWLER_DETAILS_CONCURRENCY: 阵容详情抓取并发数
 */
export function createCrawlerTasks(): ScheduledTask[] {
  return [
    createBasicDataTask(),
    createCompsTask(),
  ]
}
