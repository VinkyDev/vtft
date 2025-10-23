import type { Locator, Page } from 'playwright'
import type { AugmentLevel, AugmentMeta } from 'types'
import { withRetry } from 'utils'
import { BaseExtractor } from '../core/baseExtractor'
import { logger } from '../core/logger'
import { TIMEOUT_STANDARD_MS, WAIT_SHORT_MS } from '../core/timing'
import {
  AUGMENT_COLUMN_INDEX,
  AUGMENT_IMAGE_SELECTOR,
  MIN_COLUMN_COUNT,
  TABLE_CELL_SELECTOR,
  TABLE_LOAD_TIMEOUT_MS,
  TABLE_ROW_SELECTOR,
  TIER_COLUMN_INDEX,
  TYPE_COLUMN_INDEX,
} from './augment.constants'

/**
 * 强化符文提取器
 */
export class AugmentExtractor extends BaseExtractor<AugmentMeta[]> {
  /**
   * 从表格行提取强化符文数据
   */
  private async extractAugmentFromRow(row: Locator, level: AugmentLevel): Promise<AugmentMeta | null> {
    const cells = await row.locator(TABLE_CELL_SELECTOR).all()

    if (cells.length < MIN_COLUMN_COUNT) {
      return null
    }

    // 第1列：强化符文名称和图标
    const augmentCell = cells[AUGMENT_COLUMN_INDEX]
    const augmentImg = augmentCell.locator(AUGMENT_IMAGE_SELECTOR).first()
    const name = await augmentImg.getAttribute('alt', { timeout: TIMEOUT_STANDARD_MS }).catch(() => '')
    const icon = await augmentImg.getAttribute('src', { timeout: TIMEOUT_STANDARD_MS }).catch(() => '')

    if (!name || !icon) {
      return null
    }

    // 第2列：段位
    const tierText = await cells[TIER_COLUMN_INDEX].textContent()
    const tier = tierText?.trim() || undefined

    // 第3列：类型
    const typeText = await cells[TYPE_COLUMN_INDEX].textContent()
    const type = typeText?.trim() || undefined

    return {
      name,
      icon,
      level,
      tier,
      type,
    }
  }

  /**
   * 等待表格加载
   */
  private async waitForTableLoad(): Promise<void> {
    await this.page.waitForSelector(TABLE_ROW_SELECTOR, { timeout: TABLE_LOAD_TIMEOUT_MS })
  }

  /**
   * 实现基类的抽象方法（暂不使用）
   */
  async extract(_index: number): Promise<AugmentMeta[]> {
    throw new Error('请使用 extractByLevel 方法')
  }

  /**
   * 提取指定级别的所有强化符文数据
   */
  async extractByLevel(level: AugmentLevel): Promise<AugmentMeta[]> {
    const augments: AugmentMeta[] = []

    // 等待表格加载
    const waitForTableWithRetry = withRetry(
      () => this.waitForTableLoad(),
      {
        maxRetries: 3,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`等待表格加载失败，重试 ${attempt}/3: ${error}`)
        },
      },
    )

    await waitForTableWithRetry()

    // 查找表格行
    const rows = await this.page.locator(TABLE_ROW_SELECTOR).all()
    logger.info(`找到 ${rows.length} 个 ${level} 强化符文`)

    for (const row of rows) {
      try {
        const augment = await this.extractAugmentFromRow(row, level)
        if (augment) {
          augments.push(augment)
          logger.info(`提取强化符文: ${augment.name} (${level} - ${augment.tier})`)
        }
      }
      catch (error) {
        logger.error('提取强化符文行失败:', error)
      }
    }

    logger.info(`${level} 强化符文提取完成，共 ${augments.length} 个`)
    return augments
  }
}

/**
 * 从页面提取指定级别的所有强化符文数据
 */
export async function extractAugmentsByLevel(page: Page, level: AugmentLevel): Promise<AugmentMeta[]> {
  const extractor = new AugmentExtractor(page)
  return await extractor.extractByLevel(level)
}
