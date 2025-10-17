import type { Locator } from 'playwright'
import type { RecommendedItem } from '../types/index'
import { logger } from '../core/logger'

/**
 * 从展开的阵容中提取推荐道具
 */
export async function extractRecommendedItems(
  compLocator: Locator,
): Promise<RecommendedItem[]> {
  const items: RecommendedItem[] = []

  try {
    // 从表格中提取道具数据
    const itemTables = await compLocator.locator('table').all()
    logger.info(`找到 ${itemTables.length} 个道具表格`)

    for (const table of itemTables) {
      try {
        const caption = await table.locator('caption').textContent().catch(() => '')
        logger.info(`道具表格标题: ${caption}`)

        if (caption && caption.includes('道具')) {
          const rows = await table.locator('tbody tr').all()
          logger.info(`道具表格有 ${rows.length} 行数据`)

          for (const row of rows) {
            try {
              // 提取各列数据
              const cells = await row.locator('td').all()
              if (cells.length < 7) {
                logger.warn(`行的列数不足: ${cells.length}`)
                continue
              }

              // 第2列：装备名称和图标
              const itemCell = cells[1]
              const itemImg = itemCell.locator('img[alt][src*="tft-item"]').first()
              const itemName = await itemImg.getAttribute('alt').catch(() => '')
              const itemIcon = await itemImg.getAttribute('src').catch(() => '')

              if (!itemName || !itemIcon) {
                continue
              }

              // 第3列：平均排名
              const avgRankText = await cells[2].textContent()
              const avgRank = avgRankText ? Number.parseFloat(avgRankText.trim().replace('#', '')) : undefined

              // 第4列：前四率
              const top4RateText = await cells[3].textContent()
              const top4Rate = top4RateText ? Number.parseFloat(top4RateText.trim().replace('%', '')) : undefined

              // 第5列：第一率
              const firstPlaceRateText = await cells[4].textContent()
              const firstPlaceRate = firstPlaceRateText ? Number.parseFloat(firstPlaceRateText.trim().replace('%', '')) : undefined

              // 第7列：推荐英雄（获取所有）
              const recommendedForCell = cells[6]
              const championImgs = await recommendedForCell.locator('img[alt]').all()
              const recommendedFor = await Promise.all(
                championImgs.map(img => img.getAttribute('alt')),
              ).then(alts => alts.filter(Boolean) as string[])

              items.push({
                name: itemName,
                icon: itemIcon,
                avgRank,
                top4Rate,
                firstPlaceRate,
                recommendedFor: recommendedFor.length > 0 ? recommendedFor : undefined,
              })
            }
            catch (error) {
              logger.error('提取道具行失败:', error)
            }
          }
        }
      }
      catch (error) {
        logger.error('处理道具表格失败:', error)
      }
    }

    logger.info(`提取到 ${items.length} 个推荐道具`)
  }
  catch (error) {
    logger.error('提取推荐道具列表失败:', error)
  }

  return items
}
