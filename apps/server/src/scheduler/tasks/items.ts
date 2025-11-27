import type { ScheduledTask } from '../index'
import { getQueueEnums } from '../../config/seasons'
import { databaseService } from '../../services'
import { getTaskConfig } from './common'

export function createItemsTask(): ScheduledTask {
  const cfg = getTaskConfig('items', '5 4,10,16,22 * * *')
  return {
    name: 'crawler:items',
    schedule: cfg.schedule,
    enabled: cfg.enabled,
    task: async () => {
      const db = databaseService.getTFTDatabase()
      const { getItemsData } = await import('scraper')
      for (const q of getQueueEnums()) {
        const items = await getItemsData({ queue: q })
        await db.itemsStats.replaceAll(items, q)
      }
    },
  }
}
