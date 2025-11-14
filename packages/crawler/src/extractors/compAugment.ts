/**
 * 阵容推荐强化符文提取器
 */

import type { Locator } from 'playwright'
import type { Augment } from 'types'
import { Logger } from 'logger'

const logger = new Logger({ namespace: 'crawler', scope: 'xtr/compAugment' })

/**
 * 从单个图片元素提取强化符文
 */
async function extractAugmentFromImage(augmentImg: Locator): Promise<Augment | null> {
  const name = await augmentImg.getAttribute('alt').catch(() => '')
  const icon = await augmentImg.getAttribute('src').catch(() => '')

  if (!name || !icon) {
    return null
  }

  return { name, icon }
}

/**
 * 从单个单元格提取强化符文
 */
async function extractAugmentFromCell(cell: Locator): Promise<Augment | null> {
  const augmentImg = cell.locator('img[alt][src*="tft-augment"]').first()

  if ((await augmentImg.count()) === 0) {
    return null
  }

  return extractAugmentFromImage(augmentImg)
}

/**
 * 从表格行提取所有强化符文
 */
async function extractAugmentsFromRow(row: Locator, existingNames: Set<string>): Promise<Augment[]> {
  const augments: Augment[] = []
  const cells = await row.locator('td').all()

  for (const cell of cells) {
    try {
      const augment = await extractAugmentFromCell(cell)

      if (augment && !existingNames.has(augment.name)) {
        augments.push(augment)
        existingNames.add(augment.name)
      }
    }
    catch {
      logger.warn('提取单元格中的强化符文失败')
    }
  }

  return augments
}

/**
 * 从表格提取所有强化符文
 */
async function extractAugmentsFromTable(table: Locator, existingNames: Set<string>): Promise<Augment[]> {
  const augments: Augment[] = []

  const caption = await table.locator('caption').textContent().catch(() => '')

  if (!caption || (!caption.includes('强化') && !caption.includes('符文'))) {
    return []
  }

  await table.locator('tbody tr').first().waitFor({ timeout: 5000 }).catch(() => {})
  const rows = await table.locator('tbody tr').all()

  for (const row of rows) {
    const rowAugments = await extractAugmentsFromRow(row, existingNames)
    augments.push(...rowAugments)
  }

  return augments
}

/**
 * 从展开的阵容中提取推荐强化符文
 */
export async function extractRecommendedAugments(compLocator: Locator): Promise<Augment[]> {
  const augments: Augment[] = []
  const existingNames = new Set<string>()

  try {
    const augmentTables = await compLocator.locator('table').all()

    for (const table of augmentTables) {
      try {
        const tableAugments = await extractAugmentsFromTable(table, existingNames)
        augments.push(...tableAugments)
      }
      catch (error) {
        logger.error('处理强化符文表格失败', error as Error)
      }
    }

    logger.info(`提取到 ${augments.length} 个推荐强化符文`)
  }
  catch (error) {
    logger.error('提取推荐强化符文列表失败', error as Error)
  }

  return augments
}
