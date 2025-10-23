import type { Locator } from 'playwright'
import type { CompDetails, Formation, Item, Position, PositionChampion } from 'types'
import { withRetry } from 'utils'
import { BaseExtractor } from '../core/baseExtractor'
import { logger } from '../core/logger'
import {
  TIMEOUT_FAST_MS,
  TIMEOUT_STANDARD_MS,
  WAIT_LONG_MS,
  WAIT_MEDIUM_MS,
  WAIT_SHORT_MS,
} from '../core/timing'
import { extractRecommendedAugments } from './compAugment'
import {
  BOARD_COLS,
  BOARD_ROWS,
  COMP_IDENTIFIER_SELECTOR,
  COMP_ITEM_SELECTOR,
  DEFAULT_STAR_LEVEL,
  EXPANDED_CONTENT_SELECTOR,
  FORMATION_AREA_SELECTORS,
  FORMATION_ROW_SELECTOR,
  HERO_AVATAR_SELECTOR,
  HERO_ITEMS_SELECTOR,
  HERO_STARS_SELECTOR,
  MORE_BUTTON_SELECTOR,
  RETRY_MAX_ATTEMPTS,
  TAB_ENHANCEMENTS,
  TAB_ITEMS,
  TAB_RECOMMENDED_AUGMENTS,
} from './compDetails.constants'
import { extractChampionEnhancements } from './compEnhancement'
import { extractRecommendedItems } from './compItem'

const COMP_ITEM_FULL_SELECTOR = `${COMP_ITEM_SELECTOR}:has(${COMP_IDENTIFIER_SELECTOR})`

/**
 * 阵容详情提取器
 */
export class CompDetailsExtractor extends BaseExtractor<CompDetails> {
  private async getCompItem(index: number): Promise<Locator> {
    return this.getByIndex(COMP_ITEM_FULL_SELECTOR, index)
  }

  private async isCompExpanded(index: number): Promise<boolean> {
    const comp = await this.getCompItem(index)
    const expandedContent = comp.locator(EXPANDED_CONTENT_SELECTOR).first()
    return this.isReallyVisible(expandedContent)
  }

  private async expandComp(index: number): Promise<void> {
    if (await this.isCompExpanded(index)) {
      return
    }

    const comp = await this.getCompItem(index)
    const expandButton = comp.locator('button').last()
    await expandButton.click({ timeout: TIMEOUT_FAST_MS })
    await this.wait(WAIT_SHORT_MS)

    if (!await this.isCompExpanded(index)) {
      throw new Error(`展开阵容 ${index + 1} 失败`)
    }
  }

  private async collapseComp(index: number): Promise<void> {
    if (!await this.isCompExpanded(index)) {
      return
    }

    const comp = await this.getCompItem(index)

    const collapseButton = comp.locator('button').last()
    await collapseButton.click({ timeout: TIMEOUT_FAST_MS })
    await this.wait(WAIT_LONG_MS)

    if (await this.isCompExpanded(index)) {
      throw new Error(`折叠阵容 ${index + 1} 失败`)
    }
  }

  private async clickTab(tabName: string): Promise<void> {
    const tab = this.page.locator(`div:text-is("${tabName}")`).first()
    if (await tab.count() > 0) {
      await tab.click()
      await this.wait(WAIT_MEDIUM_MS)
    }
  }

  private async clickMoreButton(compIndex: number): Promise<void> {
    const comp = await this.getCompItem(compIndex)
    const moreButton = comp.locator(MORE_BUTTON_SELECTOR).first()

    if (await moreButton.count() > 0) {
      await moreButton.click()
      await this.wait(WAIT_SHORT_MS)
    }
  }

  private async extractFormation(compLocator: Locator): Promise<Formation> {
    const positions: Position[] = []

    const formationArea = await this.locateFormationArea(compLocator)
    if (!formationArea) {
      return { positions }
    }

    const rows = await formationArea.locator(FORMATION_ROW_SELECTOR).all()

    for (let rowIndex = 0; rowIndex < Math.min(rows.length, BOARD_ROWS); rowIndex++) {
      const row = rows[rowIndex]
      const positionsInRow = await row.locator('> div').all()

      for (let colIndex = 0; colIndex < Math.min(positionsInRow.length, BOARD_COLS); colIndex++) {
        const positionElement = positionsInRow[colIndex]
        const champion = await this.extractPositionChampion(positionElement)

        positions.push({ row: rowIndex, col: colIndex, champion })
      }
    }

    return { positions }
  }

  private async locateFormationArea(compLocator: Locator): Promise<Locator | null> {
    await compLocator.locator(FORMATION_AREA_SELECTORS).first().waitFor({ state: 'visible', timeout: TIMEOUT_STANDARD_MS })
    const area = compLocator.locator(FORMATION_AREA_SELECTORS).first()
    if (await area.count() > 0) {
      return area
    }
    return null
  }

  private async extractPositionChampion(positionLocator: Locator): Promise<PositionChampion | null> {
    const hasChampion = await positionLocator.locator(HERO_AVATAR_SELECTOR).count() > 0
    if (!hasChampion) {
      return null
    }

    const championImg = positionLocator.locator(HERO_AVATAR_SELECTOR).first()
    const name = await championImg.getAttribute('alt', { timeout: TIMEOUT_STANDARD_MS }) || ''
    const icon = await championImg.getAttribute('src', { timeout: TIMEOUT_STANDARD_MS }) || ''

    if (!name) {
      return null
    }

    const stars = await this.extractStars(positionLocator)
    const items = await this.extractChampionItems(positionLocator)

    return { name, icon, stars, items }
  }

  private async extractStars(championLocator: Locator): Promise<number> {
    const starContainer = championLocator.locator(HERO_STARS_SELECTOR)
    if (await starContainer.count() === 0) {
      return DEFAULT_STAR_LEVEL
    }

    const svgElements = await starContainer.locator('svg').all()
    return svgElements.length || DEFAULT_STAR_LEVEL
  }

  private async extractChampionItems(championLocator: Locator): Promise<Item[]> {
    const items: Item[] = []
    const itemContainer = championLocator.locator(HERO_ITEMS_SELECTOR)
    const itemElements = await itemContainer.locator('img').all()

    for (const itemElement of itemElements) {
      const name = await itemElement.getAttribute('alt') || ''
      const icon = await itemElement.getAttribute('src') || ''
      if (name && icon) {
        items.push({ name, icon })
      }
    }

    return items
  }

  async extract(compIndex: number): Promise<CompDetails> {
    const details: CompDetails = {
      augments: [],
      items: [],
      championEnhancements: [],
    }

    const expandWithRetry = withRetry(
      () => this.expandComp(compIndex),
      {
        maxRetries: RETRY_MAX_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`展开阵容失败,重试 ${attempt}/${RETRY_MAX_ATTEMPTS}: ${error}`)
        },
      },
    )

    const collapseWithRetry = withRetry(
      () => this.collapseComp(compIndex),
      {
        maxRetries: RETRY_MAX_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`折叠阵容失败,重试 ${attempt}/${RETRY_MAX_ATTEMPTS}: ${error}`)
        },
      },
    )

    try {
      await expandWithRetry()

      const compLocator = await this.getCompItem(compIndex)

      details.formation = await this.extractFormation(compLocator)

      await this.clickTab(TAB_RECOMMENDED_AUGMENTS)
      const compForAugments = await this.getCompItem(compIndex)
      details.augments = await extractRecommendedAugments(compForAugments)

      await this.clickTab(TAB_ENHANCEMENTS)
      const compForEnhancement = await this.getCompItem(compIndex)
      details.championEnhancements = await extractChampionEnhancements(compForEnhancement)

      await this.clickTab(TAB_ITEMS)
      await this.clickMoreButton(compIndex)
      const compForItems = await this.getCompItem(compIndex)
      details.items = await extractRecommendedItems(compForItems)

      await collapseWithRetry()

      logger.info(
        `阵容 ${compIndex + 1}: `
        + `${details.formation?.positions.length || 0} 位置, `
        + `${details.augments.length} 符文, `
        + `${details.items.length} 道具, `
        + `${details.championEnhancements.length} 强化`,
      )
    }
    catch (error) {
      logger.error(`提取阵容 ${compIndex + 1} 失败: ${error}`)
      throw error
    }

    return details
  }
}
