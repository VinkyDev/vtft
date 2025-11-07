/**
 * OP.GG 强化符文爬虫
 */

import type { Page } from 'playwright'
import type { AugmentMeta, CrawlOptions } from 'types'
import { DATA_QUALITY, OPGG_AUGMENT_LEVELS, SELECTORS, URLS } from '../constants'
import { extractOpggAugmentsByLevel } from '../extractors/augmentOpgg'
import { BaseCrawler } from '../lib/BaseCrawler'
import { safeClick, waitForElement } from '../lib/dom'
import { createCrawlerLogger, navigateToUrl, withErrorHandler } from '../lib/helpers'

const logger = createCrawlerLogger('AugmentOpggCrawler')

/**
 * OP.GG 强化符文爬虫
 */
export class AugmentOpggCrawler extends BaseCrawler<AugmentMeta[]> {
  constructor(options: CrawlOptions = {}) {
    super(logger, options)
  }

  async crawl(): Promise<AugmentMeta[]> {
    try {
      const page = await this.initBrowser()

      await this.setupHeaders(page)
      await navigateToUrl(page, URLS.OPGG.AUGMENTS, this.logger)

      await waitForElement(page, SELECTORS.AUGMENT.OPGG_CONTAINER)
      this.logger.info('页面加载完成')

      const allAugments: AugmentMeta[] = []

      for (const { level, label } of OPGG_AUGMENT_LEVELS) {
        this.logger.info(`准备爬取 ${label} 级别强化符文`)

        try {
          await this.clickLevelTab(page, label)

          const augments = await withErrorHandler(
            () => extractOpggAugmentsByLevel(page, level),
            `提取${label}级别强化符文`,
            this.logger,
          )

          allAugments.push(...augments)

          await this.saveDebugInfo(page, `opgg-augments-${level.toLowerCase()}`)
        }
        catch (error) {
          this.logger.error({ message: `爬取 ${label} 级别失败`, error: error as Error })
        }
      }

      const uniqueAugments = this.deduplicateAugments(allAugments)
      this.validateDataQuality(uniqueAugments)

      await this.saveResults(uniqueAugments, 'opgg-augments')

      this.logger.info(`OP.GG 强化符文爬取完成,共 ${uniqueAugments.length} 个`)
      return uniqueAugments
    }
    finally {
      await this.cleanup()
    }
  }

  private async setupHeaders(page: Page): Promise<void> {
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
  }

  private async clickLevelTab(page: Page, label: string): Promise<void> {
    const tabContainer = page.locator(SELECTORS.AUGMENT.OPGG_TAB_CONTAINER)
    const tabButton = tabContainer.getByText(label).last()

    await safeClick(tabButton)
    this.logger.info(`已切换到 ${label} 标签`)
  }

  private deduplicateAugments(augments: AugmentMeta[]): AugmentMeta[] {
    const seen = new Set<string>()
    return augments.filter((augment) => {
      const key = `${augment.name}-${augment.level}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  private validateDataQuality(augments: AugmentMeta[]): void {
    if (augments.length < DATA_QUALITY.MIN_AUGMENT_COUNT) {
      this.logger.warning(`强化符文数量过少: ${augments.length}, 期望至少 ${DATA_QUALITY.MIN_AUGMENT_COUNT} 个`)
    }
    else {
      this.logger.info(`数据质量验证通过: ${augments.length} 个强化符文`)
    }
  }
}

/**
 * 便捷函数
 */
export async function crawlOpggAugments(options?: CrawlOptions): Promise<AugmentMeta[]> {
  const crawler = new AugmentOpggCrawler(options)
  return crawler.crawl()
}
