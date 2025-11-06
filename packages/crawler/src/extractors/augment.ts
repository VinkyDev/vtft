/**
 * 强化符文数据提取器
 */

import type { Locator, Page } from 'playwright'
import type { AugmentLevel, AugmentMeta } from 'types'
import { Logger } from 'logger'
import { withRetry } from 'utils'
import { SELECTORS, TABLE_COLUMNS } from '@/constants'
import { TIMEOUT_STANDARD_MS, WAIT_LONG_MS } from '@/lib/timing'

const logger = new Logger({ namespace: 'crawler', scope: 'extractor/augment', withTime: true })

/**
 * 从单行提取强化符文
 */
async function extractAugmentFromRow(row: Locator, level: AugmentLevel): Promise<AugmentMeta | null> {
  const cells = await row.locator(SELECTORS.AUGMENT.TABLE_CELL).all()

  if (cells.length < TABLE_COLUMNS.MIN_COUNT) {
    return null
  }

  const augmentCell = cells[TABLE_COLUMNS.AUGMENT]
  const augmentImg = augmentCell.locator(SELECTORS.AUGMENT.IMAGE).first()
  const name = await augmentImg.getAttribute('alt', { timeout: TIMEOUT_STANDARD_MS }).catch(() => '')
  const icon = await augmentImg.getAttribute('src', { timeout: TIMEOUT_STANDARD_MS }).catch(() => '')

  if (!name || !icon) {
    return null
  }

  const tierText = await cells[TABLE_COLUMNS.TIER].textContent()
  const tier = tierText?.trim() || undefined

  const typeText = await cells[TABLE_COLUMNS.TYPE].textContent()
  const type = typeText?.trim() || undefined

  return { name, icon, level, tier, type }
}

/**
 * 等待表格加载
 */
async function waitForTableLoad(page: Page): Promise<void> {
  await page.locator(SELECTORS.AUGMENT.TABLE_ROW).waitFor({ timeout: TIMEOUT_STANDARD_MS })
}

/**
 * 提取指定级别的所有强化符文
 */
export async function extractAugmentsByLevel(page: Page, level: AugmentLevel): Promise<AugmentMeta[]> {
  const augments: AugmentMeta[] = []

  const waitWithRetry = withRetry(
    () => waitForTableLoad(page),
    {
      maxRetries: 3,
      delayMs: WAIT_LONG_MS,
      onRetry: (_error, attempt) => {
        logger.warning(`等待表格加载失败,重试 ${attempt}/3`)
      },
    },
  )

  await waitWithRetry()

  const rows = await page.locator(SELECTORS.AUGMENT.TABLE_ROW).all()
  logger.info(`找到 ${rows.length} 个 ${level} 强化符文`)

  for (const row of rows) {
    try {
      const augment = await extractAugmentFromRow(row, level)
      if (augment) {
        augments.push(augment)
        logger.info(`提取强化符文: ${augment.name} (${level} - ${augment.tier})`)
      }
    }
    catch (error) {
      logger.error({ message: '提取强化符文行失败', error: error as Error })
    }
  }

  logger.info(`${level} 强化符文提取完成,共 ${augments.length} 个`)
  return augments
}
