import type { Locator, Page } from 'playwright'
import type { AugmentLevel, AugmentMeta } from 'types'
import { logger } from '../core/logger'

/**
 * 从表格行提取强化符文数据
 */
async function extractAugmentFromRow(row: Locator, level: AugmentLevel): Promise<AugmentMeta | null> {
  try {
    const cells = await row.locator('td').all()

    if (cells.length < 3) {
      return null
    }

    // 第1列：强化符文名称和图标
    const augmentCell = cells[0]
    const augmentImg = augmentCell.locator('img').first()
    const name = await augmentImg.getAttribute('alt').catch(() => '')
    const icon = await augmentImg.getAttribute('src').catch(() => '')

    if (!name || !icon) {
      return null
    }

    // 第2列：段位
    const tierText = await cells[1].textContent()
    const tier = tierText?.trim() || undefined

    // 第3列：类型
    const typeText = await cells[2].textContent()
    const type = typeText?.trim() || undefined

    return {
      name,
      icon,
      level,
      tier,
      type,
    }
  }
  catch (error) {
    logger.error('提取强化符文行失败:', error)
    return null
  }
}

/**
 * 从页面提取指定级别的所有强化符文数据
 */
export async function extractAugmentsByLevel(page: Page, level: AugmentLevel): Promise<AugmentMeta[]> {
  const augments: AugmentMeta[] = []

  try {
    // 等待表格加载
    await page.waitForSelector('table tbody tr', { timeout: 30000 })
    await page.waitForTimeout(2000)

    // 查找表格行
    const rows = await page.locator('table tbody tr').all()
    logger.info(`找到 ${rows.length} 个 ${level} 强化符文`)

    for (const row of rows) {
      const augment = await extractAugmentFromRow(row, level)
      if (augment) {
        augments.push(augment)
        logger.info(`提取强化符文: ${augment.name} (${level} - ${augment.tier})`)
      }
    }

    logger.info(`${level} 强化符文提取完成，共 ${augments.length} 个`)
  }
  catch (error) {
    logger.error(`提取 ${level} 强化符文失败:`, error)
  }

  return augments
}
