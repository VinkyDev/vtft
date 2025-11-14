/**
 * 装备元数据爬虫
 */

import type { Page } from 'playwright'
import type { CrawlOptions, ItemMeta } from 'types'
import { ITEM_CATEGORIES, SELECTORS, URLS } from '@/constants'
import { extractItemsFromPage } from '@/extractors/item'
import { BaseCrawler } from '@/lib/BaseCrawler'
import { safeClick, waitForElement } from '@/lib/dom'
import { createCrawlerLogger, navigateToUrl, withErrorHandler } from '@/lib/helpers'

const logger = createCrawlerLogger('ItemMetaCrawler')

/**
 * 装备元数据爬虫
 */
export class ItemMetaCrawler extends BaseCrawler<ItemMeta[]> {
  constructor(options: CrawlOptions = {}) {
    super(logger, options)
  }

  async crawl(): Promise<ItemMeta[]> {
    try {
      const page = await this.initBrowser()

      await navigateToUrl(page, URLS.OPGG.ITEMS, this.logger)

      await waitForElement(page, SELECTORS.ITEM.TAB_CONTAINER)
      this.logger.info('分类 tabs 已加载')

      const allItems: ItemMeta[] = []

      for (const category of ITEM_CATEGORIES) {
        this.logger.info(`开始抓取分类: ${category.label}`)

        await this.clickCategoryTab(page, category.label)

        await waitForElement(page, SELECTORS.ITEM.TABLE_ROW)

        const items = await withErrorHandler(
          () => extractItemsFromPage(page, category.value),
          `提取${category.label}分类装备`,
          this.logger,
        )

        allItems.push(...items)
        this.logger.info(`分类 ${category.label} 抓取完成,共 ${items.length} 个装备`)
      }

      await this.saveDebugInfo(page, 'item-meta')
      await this.saveResults(allItems, 'item-meta')

      this.logger.info(`所有分类抓取完成,共 ${allItems.length} 个装备`)
      return allItems
    }
    finally {
      await this.cleanup()
    }
  }

  private async clickCategoryTab(page: Page, label: string): Promise<void> {
    const tabSelector = `${SELECTORS.ITEM.TAB_CONTAINER} > div > div:has-text("${label}")`
    const tabLocator = page.locator(tabSelector).first()

    await safeClick(tabLocator)
    this.logger.info(`已切换到分类: ${label}`)
  }
}

/**
 * 便捷函数
 */
export async function crawlItemMeta(options?: CrawlOptions): Promise<ItemMeta[]> {
  const crawler = new ItemMetaCrawler(options)
  return crawler.crawl()
}
