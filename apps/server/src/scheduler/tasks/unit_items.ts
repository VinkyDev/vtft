import type { ScheduledTask } from '../index'
import { databaseService } from '../../services'
import { getTaskConfig } from './common'

export function createUnitItemsTask(): ScheduledTask {
  const cfg = getTaskConfig('unit_items', '9 4,10,16,22 * * *')
  return {
    name: 'crawler:unit_items',
    schedule: cfg.schedule,
    enabled: cfg.enabled,
    task: async () => {
      const db = databaseService.getTFTDatabase()
      const { getUnitItemsProcessedData } = await import('scraper')
      const data = await getUnitItemsProcessedData()
      await db.unitItemsProcessed.replace(data)
    },
  }
}
