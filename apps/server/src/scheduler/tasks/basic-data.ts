import type { Lookups } from 'types'
import type { ScheduledTask } from '../index'
import { Logger } from 'logger'
import { Queue } from 'types'
import { getQueueEnums, getSeasons } from '../../config/seasons'
import { databaseService } from '../../services'
import { getTaskConfig } from './common'

const logger = new Logger({ namespace: 'scheduler', scope: 'basic-data' })

function buildLookupsUrl(season: string, queue: string): string {
  const s = (season || '').trim()
  const setNum = s.startsWith('S') ? s.slice(1) : s
  const isPBE = (queue || '').toUpperCase() === Queue.PBE
  const suffix = isPBE ? 'pbe_zh_cn' : 'latest_zh_cn'
  return `https://data.metatft.com/lookups/TFTSet${setNum}_${suffix}.json`
}

async function crawlAugments(): Promise<void> {
  const db = databaseService.getTFTDatabase()
  const { getAugmentsData } = await import('scraper')
  const augments = await getAugmentsData()
  await db.augments.replaceAll(augments)
  logger.info('augments 数据已更新')
}

async function crawlItems(): Promise<void> {
  const db = databaseService.getTFTDatabase()
  const { getItemsData } = await import('scraper')
  for (const q of getQueueEnums()) {
    const items = await getItemsData({ queue: q })
    await db.itemsStats.replaceAll(items, q)
  }
  logger.info('items 数据已更新')
}

async function crawlUnits(): Promise<void> {
  const db = databaseService.getTFTDatabase()
  const { getUnitsData } = await import('scraper')
  for (const q of getQueueEnums()) {
    const units = await getUnitsData({ queue: q })
    await db.unitsStats.replaceAll(units, q)
  }
  logger.info('units 数据已更新')
}

async function crawlLookups(): Promise<void> {
  const db = databaseService.getTFTDatabase()
  for (const { season, queue } of getSeasons()) {
    try {
      const url = buildLookupsUrl(season, queue)
      const res = await fetch(url)
      if (!res.ok)
        throw new Error(`fetch failed: ${res.status} ${res.statusText}`)
      const data = await res.json() as Lookups
      await db.lookups.upsert(season, queue, data)
    }
    catch (e) {
      logger.error({ message: 'lookups fetch failed', error: e as Error })
    }
  }
  logger.info('lookups 数据已更新')
}

async function crawlUnitItems(): Promise<void> {
  const db = databaseService.getTFTDatabase()
  const { getUnitItemsProcessedData } = await import('scraper')
  const data = await getUnitItemsProcessedData()
  await db.unitItemsProcessed.replace(data)
  logger.info('unit_items 数据已更新')
}

/**
 * 创建基础数据抓取任务
 */
export function createBasicDataTask(): ScheduledTask {
  const cfg = getTaskConfig('basic_data')
  return {
    name: 'crawler:basic-data',
    schedule: cfg.schedule,
    enabled: cfg.enabled,
    task: async () => {
      const start = Date.now()
      await crawlAugments()
      await crawlItems()
      await crawlUnits()
      await crawlLookups()
      await crawlUnitItems()
      logger.success(`基础数据抓取完成，耗时: ${Date.now() - start}ms`)
    },
  }
}
