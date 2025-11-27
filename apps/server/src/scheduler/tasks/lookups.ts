import type { Lookups } from 'types'
import type { ScheduledTask } from '../index'
import { Logger } from 'logger'
import { Queue } from 'types'
import { getSeasons } from '../../config/seasons'
import { databaseService } from '../../services'
import { getTaskConfig } from './common'

const logger = new Logger({ namespace: 'scheduler', scope: 'lookups' })

function buildLookupsUrl(season: string, queue: string): string {
  const s = (season || '').trim()
  const setNum = s.startsWith('S') ? s.slice(1) : s
  const isPBE = (queue || '').toUpperCase() === Queue.PBE
  const suffix = isPBE ? 'pbe_zh_cn' : 'latest_zh_cn'
  return `https://data.metatft.com/lookups/TFTSet${setNum}_${suffix}.json`
}

export function createLookupsTask(): ScheduledTask {
  const cfg = getTaskConfig('lookups', '0 4,10,16,22 * * *')
  return {
    name: 'crawler:lookups',
    schedule: cfg.schedule,
    enabled: cfg.enabled,
    task: async () => {
      const db = databaseService.getTFTDatabase()
      for (const { season, queue } of getSeasons()) {
        try {
          const url = buildLookupsUrl(season, queue)
          const res = await fetch(url)
          if (!res.ok)
            throw new Error(`fetch failed: ${res.status} ${res.statusText}`)
          const data = await res.json() as Lookups
          await db.lookups.upsert(season, queue, data)
          logger.success(`lookups upserted: season=${season} queue=${queue}`)
        }
        catch (e) {
          logger.error({ message: 'lookups fetch failed', error: e as Error })
        }
      }
    },
  }
}
