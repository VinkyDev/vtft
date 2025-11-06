/**
 * 阵容爬虫
 */

import type { Page } from 'playwright'
import type { CompData, CrawlOptions } from 'types'
import { COMP, URLS } from '../constants'
import { extractCompsFromPage } from '../extractors/comp'
import { extractCompDetails } from '../extractors/compDetails'
import { BaseCrawler } from '../lib/BaseCrawler'
import { PageStateManager } from '../lib/browser'
import { createCrawlerLogger, navigateToUrl, withErrorHandler } from '../lib/helpers'

const logger = createCrawlerLogger('CompCrawler')

export interface CompCrawlOptions extends CrawlOptions {
  fetchDetails?: boolean
}

/**
 * 阵容爬虫
 */
export class CompCrawler extends BaseCrawler<CompData[]> {
  private fetchDetailsEnabled: boolean

  constructor(options: CompCrawlOptions = {}) {
    super(logger, options)
    this.fetchDetailsEnabled = options.fetchDetails ?? true
  }

  async crawl(): Promise<CompData[]> {
    try {
      const { page, helper } = await this.initBrowser()

      await navigateToUrl(page, URLS.OPGG.COMPS, this.logger)

      await this.saveDebugInfo(helper, 'comps-page')

      const comps = await this.crawlWithRetry(page)

      await this.saveResults(comps, 'comps')

      this.logger.info(`阵容爬取完成,共 ${comps.length} 个`)
      return comps
    }
    finally {
      await this.cleanup()
    }
  }

  private async crawlWithRetry(page: Page): Promise<CompData[]> {
    const crawlOnce = async (): Promise<CompData[]> => {
      const comps = await withErrorHandler(
        () => extractCompsFromPage(page),
        '提取阵容列表',
        this.logger,
      )

      if (this.fetchDetailsEnabled) {
        const shouldRetry = await this.fetchDetails(comps, page)

        if (shouldRetry) {
          throw new Error('需要刷新页面重新爬取')
        }
      }

      return comps
    }

    return withErrorHandler(
      crawlOnce,
      '爬取阵容',
      this.logger,
    )
  }

  private async fetchDetails(comps: CompData[], page: Page): Promise<boolean> {
    this.logger.info('开始获取阵容详细信息')

    const maxDetails = Math.min(comps.length, COMP.MAX_LIMIT)
    this.logger.info(`将获取前 ${maxDetails} 个阵容的详细信息`)

    const stateManager = new PageStateManager(page)

    let consecutiveFailures = 0

    for (let i = 0; i < maxDetails; i++) {
      try {
        if (stateManager.shouldRefresh()) {
          await stateManager.refresh()
          this.logger.warning('页面已刷新,需要完整重新爬取')
          return true
        }

        this.logger.info(`正在获取阵容 ${i + 1}/${maxDetails} 的详细信息`)
        const details = await extractCompDetails(page, i)
        comps[i].details = details

        consecutiveFailures = 0
        stateManager.recordOperation()
      }
      catch (error) {
        this.logger.error({ message: `获取阵容 ${i + 1} 详细信息失败`, error: error as Error })
        consecutiveFailures++

        if (consecutiveFailures >= COMP.MAX_CONSECUTIVE_FAILURES) {
          this.logger.warning({ message: `连续失败 ${consecutiveFailures} 次,刷新页面并完整重新爬取` })

          try {
            await stateManager.refresh()
            return true
          }
          catch (refreshError) {
            this.logger.error({ message: '刷新失败,停止爬取', error: refreshError as Error })
            throw new Error('页面刷新失败')
          }
        }
      }
    }

    this.logger.info('阵容详细信息获取完成')
    return false
  }
}

/**
 * 便捷函数
 */
export async function crawlComps(options?: CompCrawlOptions): Promise<CompData[]> {
  const crawler = new CompCrawler(options)
  return crawler.crawl()
}
