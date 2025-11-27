import type { ScheduledTask } from '../index'
import { databaseService } from '../../services'
import { getTaskConfig } from './common'

export function createAugmentsTask(): ScheduledTask {
  const cfg = getTaskConfig('augments', '0 4,10,16,22 * * *')
  return {
    name: 'crawler:augments',
    schedule: cfg.schedule,
    enabled: cfg.enabled,
    task: async () => {
      const db = databaseService.getTFTDatabase()
      const { getAugmentsData } = await import('scraper')
      const augments = await getAugmentsData()
      await db.augments.replaceAll(augments)
    },
  }
}
