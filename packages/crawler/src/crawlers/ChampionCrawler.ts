/**
 * 英雄爬虫
 */

import type { ChampionMeta, CrawlOptions } from 'types'
import { DATA_QUALITY, SELECTORS, URLS } from '../constants'
import { extractChampionsFromPage } from '../extractors/champion'
import { BaseCrawler } from '../lib/BaseCrawler'
import { waitForElement } from '../lib/dom'
import { createCrawlerLogger, navigateToUrl, withErrorHandler } from '../lib/helpers'

const logger = createCrawlerLogger('ChampionCrawler')

/**
 * 英雄爬虫
 */
export class ChampionCrawler extends BaseCrawler<ChampionMeta[]> {
  constructor(options: CrawlOptions = {}) {
    super(logger, options)
  }

  async crawl(): Promise<ChampionMeta[]> {
    try {
      const { page, helper } = await this.initBrowser()

      await navigateToUrl(page, URLS.OPGG.CHAMPIONS, this.logger)

      await waitForElement(page, SELECTORS.CHAMPION.TABLE_ROW)
      this.logger.info('页面内容已加载')

      await this.saveDebugInfo(helper, 'champions-page')

      const champions = await withErrorHandler(
        () => extractChampionsFromPage(page),
        '提取英雄数据',
        this.logger,
      )

      this.validateDataQuality(champions)

      await this.saveResults(champions, 'champions')

      return champions
    }
    finally {
      await this.cleanup()
    }
  }

  private validateDataQuality(champions: ChampionMeta[]): void {
    if (champions.length < DATA_QUALITY.MIN_CHAMPION_COUNT) {
      this.logger.warning(`英雄数据量不足: ${champions.length} < ${DATA_QUALITY.MIN_CHAMPION_COUNT}`)
    }
    else {
      this.logger.info(`成功爬取 ${champions.length} 个英雄`)
    }
  }
}

/**
 * 便捷函数
 */
export async function crawlChampions(options?: CrawlOptions): Promise<ChampionMeta[]> {
  const crawler = new ChampionCrawler(options)
  return crawler.crawl()
}
