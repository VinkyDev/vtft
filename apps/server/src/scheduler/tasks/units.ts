import type { ScheduledTask } from '../index'
import { getQueueEnums } from '../../config/seasons'
import { databaseService } from '../../services'
import { getTaskConfig } from './common'

export function createUnitsTask(): ScheduledTask {
  const cfg = getTaskConfig('units', '7 4,10,16,22 * * *')
  return {
    name: 'crawler:units',
    schedule: cfg.schedule,
    enabled: cfg.enabled,
    task: async () => {
      const db = databaseService.getTFTDatabase()
      const { getUnitsData } = await import('scraper')
      for (const q of getQueueEnums()) {
        const units = await getUnitsData({ queue: q })
        await db.unitsStats.replaceAll(units, q)
      }
    },
  }
}
