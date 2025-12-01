import type { ScheduledTask } from '../index'
import { Logger } from 'logger'
import { generateCompId } from 'utils'
import { getQueueEnums } from '../../config/seasons'
import { clearCache } from '../../middleware'
import { databaseService } from '../../services'
import { getRequiredEnv, getTaskConfig } from './common'

const logger = new Logger({ namespace: 'scheduler', scope: 'comps' })

/**
 * 创建阵容数据抓取任务
 */
export function createCompsTask(): ScheduledTask {
  const cfg = getTaskConfig('comps')
  const concurrency = Number(getRequiredEnv('CRAWLER_DETAILS_CONCURRENCY'))

  return {
    name: 'crawler:comps',
    schedule: cfg.schedule,
    enabled: cfg.enabled,
    task: async () => {
      const db = databaseService.getTFTDatabase()
      const { getAllCompsData, getCompDetails } = await import('scraper')
      const pLimitModule = await import('p-limit')
      const pLimit = pLimitModule.default || pLimitModule
      const limit = pLimit(concurrency)

      for (const q of getQueueEnums()) {
        const start = Date.now()
        const comps = await getAllCompsData({ queue: q })
        await db.comps.upsertManyByQueue(comps, q)
        logger.info(`comps upserted: ${comps.length} queue=${q}`)

        const total = comps.length
        let completed = 0
        logger.info(`details start: total=${total} queue=${q} concurrency=${concurrency}`)

        const tasks = comps.map((comp) => {
          const compId = generateCompId(comp, q)
          return limit(async () => {
            try {
              const details = await getCompDetails({ queue: q, clusterId: comp.clusterId, compId: String(comp.id), compUnits: comp.units || [] })
              await db.compDetails.upsert(compId, details, q)
              completed++
              if (completed % Math.max(1, Math.floor(total / 10)) === 0 || completed === total) {
                logger.info(`details progress: ${completed}/${total} queue=${q}`)
              }
            }
            catch (e) {
              logger.error({ message: 'comp detail failed', error: e as Error })
              completed++
            }
          })
        })
        await Promise.all(tasks)
        const del = await db.compDetails.deleteOlderThan(1)
        logger.info(`details cleanup: deleted=${del.deletedCount || 0} queue=${q}`)
        logger.success(`comps details done: ${comps.length} queue=${q} duration=${Date.now() - start}ms`)
      }
      clearCache()
    },
  }
}
