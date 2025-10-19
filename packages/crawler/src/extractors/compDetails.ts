import type { Locator, Page } from 'playwright'
import type { CompDetails, Formation, Item, Position, PositionChampion } from 'types'
import { logger } from '../core/logger'
import { extractChampionEnhancements } from './compEnhancement'
import { extractRecommendedItems } from './compItem'

/**
 * 点击 tab 并等待内容加载
 */
async function clickTab(page: Page, tabName: string): Promise<void> {
  try {
    const tab = page.locator(`div:text-is("${tabName}")`).first()
    if (await tab.count() > 0) {
      await tab.click()
      // 等待内容加载（SPA 切换不触发 networkidle，直接等待固定时间）
      await page.waitForTimeout(2000)
      logger.info(`已点击 ${tabName} tab`)
    }
  }
  catch (error) {
    logger.error(`点击 ${tabName} tab 失败:`, error)
  }
}

/**
 * 点击"更多"按钮以展开所有内容
 */
async function clickMoreButton(page: Page, compIndex: number): Promise<void> {
  try {
    const comps = await page.locator('li').filter({ has: page.locator('strong') }).all()
    const targetComp = comps[compIndex]
    const moreButton = targetComp.locator('button:has-text("更多")').first()
    if (await moreButton.count() > 0) {
      await moreButton.click()
      await page.waitForTimeout(1000)
      logger.info('已点击"更多"按钮')
    }
  }
  catch (error) {
    logger.warn(`点击"更多"按钮失败: ${error}`)
  }
}

/**
 * 展开指定的阵容
 */
async function expandComp(page: Page, compIndex: number): Promise<void> {
  const compItems = await page.locator('li').filter({ has: page.locator('strong') }).all()
  if (compIndex >= compItems.length) {
    throw new Error(`阵容索引 ${compIndex} 超出范围`)
  }

  const targetComp = compItems[compIndex]

  // 滚动到目标阵容
  await targetComp.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)

  // 点击展开按钮
  const expandButton = targetComp.locator('button').last()
  await expandButton.click()
  await page.waitForTimeout(4000)

  logger.info(`已展开第 ${compIndex + 1} 个阵容`)
}

/**
 * 折叠指定的阵容
 */
async function collapseComp(page: Page, compIndex: number): Promise<void> {
  try {
    const comps = await page.locator('li').filter({ has: page.locator('strong') }).all()
    if (compIndex < comps.length) {
      const currentComp = comps[compIndex]
      const collapseButton = currentComp.locator('button').last()
      if (await collapseButton.count() > 0) {
        await collapseButton.click()
        await page.waitForTimeout(500)
        logger.info(`已折叠第 ${compIndex + 1} 个阵容`)
      }
    }
  }
  catch (error) {
    logger.warn(`折叠阵容失败: ${error}`)
  }
}

/**
 * 获取指定阵容的 Locator
 */
async function getCompLocator(page: Page, compIndex: number) {
  const comps = await page.locator('li').filter({ has: page.locator('strong') }).all()
  if (compIndex >= comps.length) {
    throw new Error(`阵容索引 ${compIndex} 超出范围`)
  }
  return comps[compIndex]
}

/**
 * 验证是否为有效的位置（包括空位置）
 */
async function isValidPosition(positionLocator: Locator): Promise<boolean> {
  try {
    // 位置必须有六边形clip-path容器（无论是否有英雄）
    const hasClipPath = await positionLocator.locator('[class*="clip-path:polygon"]').count() > 0
    return hasClipPath
  }
  catch (error) {
    logger.warn('验证位置失败:', error)
    return false
  }
}

/**
 * 检查位置是否有英雄
 */
async function hasChampionInPosition(positionLocator: Locator): Promise<boolean> {
  try {
    // 有英雄的位置会在clip-path容器内有img元素
    const heroImg = await positionLocator.locator('[class*="clip-path:polygon"] img').count() > 0
    return heroImg
  }
  catch (error) {
    logger.warn('检查英雄失败:', error)
    return false
  }
}

/**
 * 提取英雄道具信息（从底部装备容器）
 */
async function extractChampionItems(championLocator: Locator): Promise<Item[]> {
  const items: Item[] = []

  try {
    // 装备在底部的绝对定位容器内，且是小尺寸图标
    const itemContainer = championLocator.locator('.absolute.bottom-0')
    const itemElements = await itemContainer.locator('img').all()

    for (const itemElement of itemElements) {
      const name = await itemElement.getAttribute('alt') || ''
      const icon = await itemElement.getAttribute('src') || ''

      if (name && icon) {
        items.push({ name, icon })
      }
    }
  }
  catch (error) {
    logger.warn('提取英雄道具失败:', error)
  }

  return items
}

/**
 * 提取单个位置信息（可能有英雄或空位置）
 */
async function extractPositionChampion(positionLocator: Locator): Promise<PositionChampion | null> {
  try {
    // 先验证是否为有效的位置
    const isValid = await isValidPosition(positionLocator)
    if (!isValid) {
      return null
    }

    // 检查是否有英雄
    const hasChampion = await hasChampionInPosition(positionLocator)
    if (!hasChampion) {
      return null // 空位置
    }

    // 提取英雄头像信息（在clip-path容器内的img）
    const championImg = positionLocator.locator('[class*="clip-path:polygon"] img').first()

    const name = await championImg.getAttribute('alt', { timeout: 5000 }) || ''
    const icon = await championImg.getAttribute('src', { timeout: 5000 }) || ''

    if (!name) {
      logger.warn('未找到英雄名称，跳过该位置')
      return null
    }

    // 提取星级（通过星星容器内SVG元素的数量）
    let stars = 2 // 默认2星
    const starContainer = positionLocator.locator('.absolute.-top-1.flex.w-full.items-center.justify-center')
    if (await starContainer.count() > 0) {
      const svgElements = await starContainer.locator('svg').all()
      stars = svgElements.length || 2 // SVG数量就是星级，默认2星
    }

    // 提取装备（从底部容器）
    const items = await extractChampionItems(positionLocator)

    logger.info(`提取英雄: ${name}, 星级: ${stars}, 道具数量: ${items.length}`)

    return {
      name,
      icon,
      stars,
      items,
    }
  }
  catch (error) {
    logger.warn('提取位置信息失败:', error)
    return null
  }
}

/**
 * 提取站位信息
 */
async function extractFormation(compLocator: Locator): Promise<Formation> {
  const positions: Position[] = []

  try {
    logger.info('开始提取站位信息')

    // 查找站位区域
    let formationArea = compLocator.locator('[class*="w-[326px]"], [class*="w-[578px]"]').first()

    if (await formationArea.count() === 0) {
      logger.info('使用备用选择器查找站位区域')
      formationArea = compLocator.locator('.relative.flex.flex-col').first()
    }

    if (await formationArea.count() === 0) {
      logger.warn('未找到站位区域')
      return { positions }
    }

    logger.info('找到站位区域，开始提取行信息')

    // 使用更精确的行选择器，基于你提供的class信息
    const rows = await formationArea.locator('.flex.gap-1, .flex.gap-2').all()

    logger.info(`找到 ${rows.length} 行`)

    // 确保按照4行7列的标准布局提取
    for (let rowIndex = 0; rowIndex < Math.min(rows.length, 4); rowIndex++) {
      const row = rows[rowIndex]

      logger.info(`处理第 ${rowIndex + 1} 行`)

      // 获取该行的所有位置元素（包括空位置）
      const positionsInRow = await row.locator('> div').all()

      logger.info(`第 ${rowIndex + 1} 行有 ${positionsInRow.length} 个位置`)

      // 确保每行最多处理7个位置
      for (let colIndex = 0; colIndex < Math.min(positionsInRow.length, 7); colIndex++) {
        const positionElement = positionsInRow[colIndex]

        try {
          // 先检查是否为有效位置
          const isValid = await isValidPosition(positionElement)
          if (!isValid) {
            logger.info(`位置 (${rowIndex}, ${colIndex}): 无效位置，跳过`)
            continue
          }

          // 提取该位置的英雄信息
          const champion = await extractPositionChampion(positionElement)

          positions.push({
            row: rowIndex,
            col: colIndex,
            champion,
          })

          if (champion) {
            logger.info(`位置 (${rowIndex}, ${colIndex}): ${champion.name} (${champion.stars}星, ${champion.items.length}装备)`)
          }
          else {
            logger.info(`位置 (${rowIndex}, ${colIndex}): 空位`)
          }
        }
        catch (error) {
          logger.warn(`提取位置 (${rowIndex}, ${colIndex}) 失败:`, error)
          // 即使某个位置失败，也添加一个空位置，保持布局完整性
          positions.push({
            row: rowIndex,
            col: colIndex,
            champion: null,
          })
        }
      }
    }

    logger.info(`提取站位信息完成: ${positions.length} 个位置，其中 ${positions.filter(p => p.champion).length} 个有英雄`)
  }
  catch (error) {
    logger.error('提取站位信息失败:', error)
  }

  return { positions }
}

/**
 * 从展开的阵容中提取详细信息
 */
export async function extractCompDetails(page: Page, compIndex: number): Promise<CompDetails> {
  const details: CompDetails = {
    augments: [],
    items: [],
    championEnhancements: [],
  }

  try {
    // 1. 展开阵容
    await expandComp(page, compIndex)

    // 2. 提取站位信息（默认 tab 就是站位 tab）
    logger.info(`提取站位信息 (阵容 ${compIndex + 1})`)
    const compForFormation = await getCompLocator(page, compIndex)
    details.formation = await extractFormation(compForFormation)

    // 3. 提取强化信息
    logger.info(`提取强化 (阵容 ${compIndex + 1})`)
    await clickTab(page, '强化')
    const compForEnhancement = await getCompLocator(page, compIndex)
    details.championEnhancements = await extractChampionEnhancements(compForEnhancement)

    // 4. 提取道具信息
    logger.info(`提取道具 (阵容 ${compIndex + 1})`)
    await clickTab(page, '道具')
    await clickMoreButton(page, compIndex)
    const compForItems = await getCompLocator(page, compIndex)
    details.items = await extractRecommendedItems(compForItems)

    // 5. 折叠阵容
    await collapseComp(page, compIndex)

    logger.info(
      `阵容 ${compIndex + 1} 详细信息提取完成: `
      + `${details.formation?.positions.length || 0} 个位置, `
      + `${details.augments.length} 个符文, `
      + `${details.items.length} 个道具, `
      + `${details.championEnhancements.length} 个英雄强化`,
    )
  }
  catch (error) {
    logger.error(`提取阵容详细信息失败:`, error)
  }

  return details
}
