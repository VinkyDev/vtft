import type { Page } from 'playwright'
import type { CompDetails } from '../types/index'
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
  await page.waitForTimeout(2000)

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

    // 2. 提取强化信息
    logger.info(`提取强化 (阵容 ${compIndex + 1})`)
    await clickTab(page, '强化')
    const compForEnhancement = await getCompLocator(page, compIndex)
    details.championEnhancements = await extractChampionEnhancements(compForEnhancement)

    // 3. 提取道具信息
    logger.info(`提取道具 (阵容 ${compIndex + 1})`)
    await clickTab(page, '道具')
    await clickMoreButton(page, compIndex)
    const compForItems = await getCompLocator(page, compIndex)
    details.items = await extractRecommendedItems(compForItems)

    // 4. 折叠阵容
    await collapseComp(page, compIndex)

    logger.info(
      `阵容 ${compIndex + 1} 详细信息提取完成: `
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
