import type { Locator, Page } from 'playwright'
import type { ChampionMeta } from '../types/index'
import { logger } from '../core/logger'

/**
 * 从单行中提取英雄数据
 */
async function extractChampionFromRow(row: Locator): Promise<ChampionMeta | null> {
  try {
    const cells = await row.locator('td').all()
    if (cells.length < 7) {
      return null
    }

    // 第1列：排名
    const rankText = await cells[0].textContent()
    const rank = rankText ? Number.parseInt(rankText.trim()) : 0

    // 第2列：英雄名称和图标
    const championCell = cells[1]
    // 名称在 strong 标签中
    const nameElement = championCell.locator('strong').first()
    const name = await nameElement.textContent().catch(() => '')
    // 图标在 img 标签中
    const championImg = championCell.locator('img[alt]').first()
    const icon = await championImg.getAttribute('src').catch(() => '')

    if (!name || !icon) {
      return null
    }

    // 羁绊在名称下面的 div.flex.gap-1 中
    const traitContainer = championCell.locator('div.flex.gap-1').first()
    const traitImgs = await traitContainer.locator('img[alt]').all()
    const traits: string[] = []
    for (const traitImg of traitImgs) {
      const traitName = await traitImg.getAttribute('alt').catch(() => '')
      if (traitName) {
        traits.push(traitName)
      }
    }

    // 第3列：费用（包含 $ 符号，需要去掉）
    const costText = await cells[2].textContent()
    const cost = costText ? Number.parseInt(costText.trim().replace('$', '')) : undefined

    // 第4列：平均排名
    const avgPlaceText = await cells[3].textContent()
    const avgPlace = avgPlaceText ? Number.parseFloat(avgPlaceText.trim().replace('#', '')) : undefined

    // 第5列：前四名率
    const top4RateText = await cells[4].textContent()
    const top4Rate = top4RateText ? Number.parseFloat(top4RateText.trim().replace('%', '')) : undefined

    // 第6列：第一名率
    const firstPlaceRateText = await cells[5].textContent()
    const firstPlaceRate = firstPlaceRateText ? Number.parseFloat(firstPlaceRateText.trim().replace('%', '')) : undefined

    // 第7列：比赛数量（包含逗号分隔符）
    const matchesText = await cells[6].textContent()
    const matches = matchesText ? Number.parseInt(matchesText.trim().replace(/,/g, '')) : undefined

    return {
      rank,
      name,
      icon,
      traits: traits.length > 0 ? traits : undefined,
      cost,
      avgPlace,
      top4Rate,
      firstPlaceRate,
      matches,
    }
  }
  catch (error) {
    logger.error('提取英雄行数据失败:', error)
    return null
  }
}

/**
 * 从页面中提取所有英雄数据
 */
export async function extractChampionsFromPage(page: Page): Promise<ChampionMeta[]> {
  const champions: ChampionMeta[] = []

  try {
    // 查找所有表格，遍历找到有数据的那个
    const tables = await page.locator('table').all()
    logger.info(`找到 ${tables.length} 个表格`)

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i]
      const rows = await table.locator('tbody tr').all()

      if (rows.length === 0) {
        logger.info(`表格 ${i + 1} 没有数据行，跳过`)
        continue
      }

      logger.info(`表格 ${i + 1} 有 ${rows.length} 行数据，开始提取`)

      for (const row of rows) {
        const champion = await extractChampionFromRow(row)
        if (champion) {
          champions.push(champion)
          logger.info(`成功提取英雄: ${champion.name} (${champion.rank})`)
        }
        else {
          logger.warn(`提取英雄失败`)
        }
      }

      // 如果成功提取到数据，就不再处理其他表格
      if (champions.length > 0) {
        break
      }
    }

    logger.info(`总共成功提取 ${champions.length} 个英雄数据`)
  }
  catch (error) {
    logger.error('提取英雄数据失败:', error)
  }

  return champions
}
