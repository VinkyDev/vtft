import type { Locator, Page } from 'playwright'
import type { ItemCategory, ItemMeta } from 'types'
import { logger } from '../core/logger'

/**
 * 从表格行提取装备元数据
 */
export async function extractItemFromRow(row: Locator, category: ItemCategory): Promise<ItemMeta | null> {
  try {
    const cells = await row.locator('td, th').all()

    if (cells.length < 7) {
      return null
    }

    // 第1列：排名
    const rankText = await cells[0].textContent()
    const rank = rankText ? Number.parseInt(rankText.trim()) : 0

    // 过滤掉 rank = 0 的数据
    if (rank === 0) {
      return null
    }

    // 第2列：装备名称和图标
    const itemCell = cells[1]
    const itemImg = itemCell.locator('img[alt]').first()
    const name = await itemImg.getAttribute('alt').catch(() => '')
    const icon = await itemImg.getAttribute('src').catch(() => '')

    if (!name || !icon) {
      return null
    }

    // 提取合成配方（在 div.ml-auto.!hidden.gap-1.md:!flex 中）
    const componentsContainer = itemCell.locator('div.ml-auto').first()
    const componentImgs = await componentsContainer.locator('img[alt]').all()
    const components: string[] = []
    for (const compImg of componentImgs) {
      const componentName = await compImg.getAttribute('alt').catch(() => '')
      if (componentName) {
        components.push(componentName)
      }
    }

    // 第3列：平均名次
    const avgPlaceText = await cells[2].textContent()
    const avgPlace = avgPlaceText ? Number.parseFloat(avgPlaceText.trim().replace('#', '')) : undefined

    // 第4列：前四名率
    const top4RateText = await cells[3].textContent()
    const top4Rate = top4RateText ? Number.parseFloat(top4RateText.trim().replace('%', '')) : undefined

    // 第5列：第一名率
    const firstPlaceRateText = await cells[4].textContent()
    const firstPlaceRate = firstPlaceRateText ? Number.parseFloat(firstPlaceRateText.trim().replace('%', '')) : undefined

    // 第6列：比赛场次
    const matchesText = await cells[5].textContent()
    const matches = matchesText ? Number.parseInt(matchesText.trim().replace(/,/g, '')) : undefined

    // 第7列：推荐英雄
    const championImgs = await cells[6].locator('img[alt]').all()
    const recommendedFor = await Promise.all(
      championImgs.map(img => img.getAttribute('alt')),
    ).then(alts => alts.filter(Boolean) as string[])

    return {
      rank,
      name,
      icon,
      category,
      components: components.length > 0 ? components : undefined,
      avgPlace,
      top4Rate,
      firstPlaceRate,
      matches,
      recommendedFor: recommendedFor.length > 0 ? recommendedFor : undefined,
    }
  }
  catch (error) {
    logger.error('提取装备行失败:', error)
    return null
  }
}

/**
 * 从页面提取所有装备元数据
 */
export async function extractItemsFromPage(page: Page, category: ItemCategory): Promise<ItemMeta[]> {
  const items: ItemMeta[] = []

  try {
    // 等待表格加载
    await page.waitForSelector('table tbody tr', { timeout: 30000 })

    // 查找表格行
    const rows = await page.locator('table tbody tr').all()
    logger.info(`找到 ${rows.length} 个装备`)

    for (const row of rows) {
      const item = await extractItemFromRow(row, category)
      if (item) {
        items.push(item)
        logger.info(`提取装备: ${item.name} (排名 #${item.rank}, 分类: ${item.category})`)
      }
    }

    logger.info(`装备元数据提取完成，共 ${items.length} 个装备`)
  }
  catch (error) {
    logger.error('提取装备元数据失败:', error)
  }

  return items
}
