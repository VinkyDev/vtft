/**
 * 阵容详情提取器
 */

import type { Locator, Page } from 'playwright'
import type {
  CompDetails,
  Formation,
  Item,
  Position,
  PositionChampion,
} from 'types'
import { Logger } from 'logger'
import { withRetry } from 'utils'
import { COMP, RETRY, SELECTORS, TABS } from '../constants'
import { sleep } from '../lib/dom'
import {
  TIMEOUT_FAST_MS,
  TIMEOUT_PAGE_LOAD_MS,
  TIMEOUT_STANDARD_MS,
  WAIT_LONG_MS,
  WAIT_MEDIUM_MS,
  WAIT_PAGE_RELOAD_MS,
  WAIT_SHORT_MS,
} from '../lib/timing'
import { extractRecommendedAugments } from './compAugment'
import { extractChampionEnhancements } from './compEnhancement'
import { extractRecommendedItems } from './compItem'

const logger = new Logger({
  namespace: 'crawler',
  scope: 'extractor/compDetails',
})

const COMP_ITEM_FULL_SELECTOR = `${SELECTORS.COMP.ITEM}:has(${SELECTORS.COMP.IDENTIFIER})`

/**
 * 获取指定索引的阵容元素
 */
async function getCompItem(page: Page, index: number): Promise<Locator> {
  const locator = page.locator(COMP_ITEM_FULL_SELECTOR)
  const count = await locator.count()

  if (index < 0 || index >= count) {
    throw new Error(`索引 ${index} 超出范围,总数: ${count}`)
  }

  return locator.nth(index)
}

/**
 * 检查阵容是否已展开
 */
async function isCompExpanded(page: Page, index: number): Promise<boolean> {
  const comp = await getCompItem(page, index)
  const expandedContent = comp.locator(SELECTORS.COMP.EXPANDED_CONTENT).first()

  try {
    const isVisible = await expandedContent.isVisible({ timeout: TIMEOUT_FAST_MS })
    if (!isVisible) {
      return false
    }

    const boundingBox = await expandedContent.boundingBox({ timeout: TIMEOUT_FAST_MS })
    return boundingBox !== null && boundingBox.width > 0 && boundingBox.height > 0
  }
  catch {
    return false
  }
}

/**
 * 展开阵容
 */
async function expandComp(page: Page, index: number): Promise<void> {
  if (await isCompExpanded(page, index)) {
    return
  }

  const comp = await getCompItem(page, index)
  const expandButton = comp.locator('button').last()
  await expandButton.click({ timeout: TIMEOUT_FAST_MS })
  await sleep(WAIT_SHORT_MS)

  if (!(await isCompExpanded(page, index))) {
    throw new Error(`展开阵容 ${index + 1} 失败`)
  }
}

/**
 * 折叠阵容
 */
async function collapseComp(page: Page, index: number): Promise<void> {
  if (!(await isCompExpanded(page, index))) {
    return
  }

  const comp = await getCompItem(page, index)
  const collapseButton = comp.locator('button').last()
  await collapseButton.click({ timeout: TIMEOUT_FAST_MS })
  await sleep(WAIT_LONG_MS)

  if (await isCompExpanded(page, index)) {
    throw new Error(`折叠阵容 ${index + 1} 失败`)
  }

  logger.info(`阵容 ${index + 1} 已折叠`)
}

/**
 * 点击 Tab
 */
async function clickTab(page: Page, tabName: string): Promise<void> {
  const tab = page.locator(`div:text-is("${tabName}")`).first()
  if ((await tab.count()) > 0) {
    await tab.click()
    await sleep(WAIT_MEDIUM_MS)
  }
}

/**
 * 点击"更多"按钮
 */
async function clickMoreButton(page: Page, compIndex: number): Promise<void> {
  const comp = await getCompItem(page, compIndex)
  const moreButton = comp.locator(SELECTORS.COMP.MORE_BUTTON).first()

  if ((await moreButton.count()) > 0) {
    await moreButton.click()
    await sleep(WAIT_SHORT_MS)
  }
}

/**
 * 提取英雄星级
 */
async function extractStars(championLocator: Locator): Promise<number> {
  const starContainer = championLocator.locator(SELECTORS.FORMATION.HERO_STARS)
  if ((await starContainer.count()) === 0) {
    return COMP.DEFAULT_STAR_LEVEL
  }

  const svgElements = await starContainer.locator('svg').all()
  return svgElements.length || COMP.DEFAULT_STAR_LEVEL
}

/**
 * 提取英雄装备
 */
async function extractChampionItems(championLocator: Locator): Promise<Item[]> {
  const items: Item[] = []
  const itemContainer = championLocator.locator(SELECTORS.FORMATION.HERO_ITEMS)
  const itemElements = await itemContainer.locator('img').all()

  for (const itemElement of itemElements) {
    const name = (await itemElement.getAttribute('alt')) || ''
    const icon = (await itemElement.getAttribute('src')) || ''
    if (name && icon) {
      items.push({ name, icon })
    }
  }

  return items
}

/**
 * 提取位置英雄
 */
async function extractPositionChampion(positionLocator: Locator): Promise<PositionChampion | null> {
  const hasChampion = (await positionLocator.locator(SELECTORS.FORMATION.HERO_AVATAR).count()) > 0
  if (!hasChampion) {
    return null
  }

  const championImg = positionLocator.locator(SELECTORS.FORMATION.HERO_AVATAR).first()
  const name = (await championImg.getAttribute('alt', { timeout: TIMEOUT_STANDARD_MS })) || ''
  const icon = (await championImg.getAttribute('src', { timeout: TIMEOUT_STANDARD_MS })) || ''

  if (!name) {
    return null
  }

  const stars = await extractStars(positionLocator)
  const items = await extractChampionItems(positionLocator)

  return { name, icon, stars, items }
}

/**
 * 定位站位区域
 */
async function locateFormationArea(compLocator: Locator): Promise<Locator | null> {
  await compLocator
    .locator(SELECTORS.FORMATION.AREA)
    .first()
    .waitFor({ state: 'visible', timeout: TIMEOUT_PAGE_LOAD_MS })

  const area = compLocator.locator(SELECTORS.FORMATION.AREA).first()
  if ((await area.count()) > 0) {
    return area
  }

  return null
}

/**
 * 提取阵容站位
 */
async function extractFormation(compLocator: Locator): Promise<Formation> {
  const positions: Position[] = []

  const formationArea = await locateFormationArea(compLocator)
  if (!formationArea) {
    logger.warning('未能定位到阵容站位区域,返回空阵容')
    return { positions }
  }

  const rows = await formationArea.locator(SELECTORS.FORMATION.ROW).all()

  for (let rowIndex = 0; rowIndex < Math.min(rows.length, COMP.BOARD_ROWS); rowIndex++) {
    const row = rows[rowIndex]
    const positionsInRow = await row.locator('> div').all()

    for (let colIndex = 0; colIndex < Math.min(positionsInRow.length, COMP.BOARD_COLS); colIndex++) {
      const positionElement = positionsInRow[colIndex]
      const champion = await extractPositionChampion(positionElement)

      positions.push({ row: rowIndex, col: colIndex, champion })
    }
  }

  return { positions }
}

/**
 * 提取阵容详情
 */
export async function extractCompDetails(page: Page, compIndex: number): Promise<CompDetails> {
  const details: CompDetails = {
    augments: [],
    items: [],
    championEnhancements: [],
  }

  const expandWithRetry = withRetry(() => expandComp(page, compIndex), {
    maxRetries: RETRY.MAX_ATTEMPTS,
    delayMs: WAIT_LONG_MS,
    onRetry: (_error, attempt) => {
      logger.warning(`展开阵容失败,重试 ${attempt}/${RETRY.MAX_ATTEMPTS}`)
    },
  })

  const collapseWithRetry = withRetry(() => collapseComp(page, compIndex), {
    maxRetries: RETRY.MAX_ATTEMPTS,
    delayMs: WAIT_LONG_MS,
    onRetry: (_error, attempt) => {
      logger.warning(`折叠阵容失败,重试 ${attempt}/${RETRY.MAX_ATTEMPTS}`)
    },
  })

  try {
    await expandWithRetry()
    await sleep(WAIT_PAGE_RELOAD_MS)

    const compLocator = await getCompItem(page, compIndex)

    details.formation = await extractFormation(compLocator)

    await clickTab(page, TABS.RECOMMENDED_AUGMENTS)
    const compForAugments = await getCompItem(page, compIndex)
    details.augments = await extractRecommendedAugments(compForAugments)

    await clickTab(page, TABS.ENHANCEMENTS)
    const compForEnhancement = await getCompItem(page, compIndex)
    details.championEnhancements = await extractChampionEnhancements(compForEnhancement)

    await clickTab(page, TABS.ITEMS)
    await clickMoreButton(page, compIndex)
    const compForItems = await getCompItem(page, compIndex)
    details.items = await extractRecommendedItems(compForItems)

    await collapseWithRetry()

    logger.info(
      `阵容 ${compIndex + 1}: `
      + `${details.formation?.positions.filter(pos => pos.champion).length || 0} 站位信息, `
      + `${details.augments.length} 符文, `
      + `${details.items.length} 道具, `
      + `${details.championEnhancements.length} 强化`,
    )
  }
  catch (error) {
    logger.error({ message: `提取阵容 ${compIndex + 1} 失败`, error: error as Error })
    throw error
  }

  return details
}
