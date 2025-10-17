import type { Locator } from 'playwright'
import type { ChampionEnhancement } from 'types'
import { logger } from '../core/logger'

/**
 * 提取单个英雄的强化推荐
 */
async function extractChampionEnhancement(section: Locator): Promise<ChampionEnhancement | null> {
  try {
    // 提取英雄信息
    const championImg = section.locator('img[alt]').first()
    const championName = await championImg.getAttribute('alt').catch(() => '')
    const championIcon = await championImg.getAttribute('src').catch(() => '')

    if (!championName)
      return null

    const championEnhancement: ChampionEnhancement = {
      championName,
      championIcon: championIcon || undefined,
      enhancements: [],
    }

    // 查找强化表格
    const table = section.locator('table').first()
    const caption = await table.locator('caption').textContent().catch(() => '')

    if (!caption || !caption.includes('强化'))
      return null

    // 提取表格行
    const rows = await table.locator('tbody tr').all()

    for (const row of rows) {
      const cells = await row.locator('td').all()
      if (cells.length < 2)
        continue

      // 提取强化名称
      const strongText = await cells[0].locator('strong').textContent().catch(() => '')
      if (!strongText)
        continue

      // 提取标签
      const tagDivs = await cells[0].locator('div[class*="rounded-"]').all()
      const tags: string[] = []
      let weight: number | undefined

      for (const tagDiv of tagDivs) {
        const tagText = await tagDiv.textContent().catch(() => '')
        if (tagText?.includes('Weight:')) {
          const weightMatch = tagText.match(/Weight:\s*(\d+)/)
          if (weightMatch)
            weight = Number.parseInt(weightMatch[1])
        }
        else if (tagText) {
          tags.push(tagText.trim())
        }
      }

      // 提取段位
      const tierSrc = await cells[1].locator('img').first().getAttribute('src').catch(() => '')
      let tier: string | undefined
      if (tierSrc) {
        const tierMatch = tierSrc.match(/icon-tier-([A-Z])\./i)
        if (tierMatch)
          tier = tierMatch[1].toUpperCase()
      }

      championEnhancement.enhancements.push({
        name: strongText,
        tier,
        weight,
        tags: tags.length > 0 ? tags : undefined,
      })
    }

    return championEnhancement
  }
  catch (error) {
    logger.error('提取英雄强化失败:', error)
    return null
  }
}

/**
 * 从展开的阵容中提取所有英雄的强化推荐
 */
export async function extractChampionEnhancements(
  compLocator: Locator,
): Promise<ChampionEnhancement[]> {
  const championEnhancements: ChampionEnhancement[] = []

  try {
    // 查找所有英雄强化区域
    const championSections = await compLocator.locator('div.flex.h-full.flex-1.flex-col').all()
    logger.info(`找到 ${championSections.length} 个英雄强化区域`)

    for (const section of championSections) {
      const enhancement = await extractChampionEnhancement(section)
      if (enhancement) {
        championEnhancements.push(enhancement)
      }
    }

    logger.info(`提取到 ${championEnhancements.length} 个英雄强化`)
  }
  catch (error) {
    logger.error('提取英雄强化列表失败:', error)
  }

  return championEnhancements
}
