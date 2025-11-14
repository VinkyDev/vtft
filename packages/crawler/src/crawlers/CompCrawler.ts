/**
 * 阵容爬虫
 */

import type { Page } from 'playwright'
import type { CompData, CrawlOptions } from 'types'
import { COMP, URLS } from '@/constants'
import { extractCompsFromPage } from '@/extractors/comp'
import { extractCompDetails } from '@/extractors/compDetails'
import { BaseCrawler } from '@/lib/BaseCrawler'
import {
  createCrawlerLogger,
  navigateToUrl,
  withErrorHandler,
} from '@/lib/helpers'

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
      const comps = await this.crawlWithBrowserRetry()

      await this.saveResults(comps, 'comps')

      this.logger.info(`阵容爬取完成,共 ${comps.length} 个`)
      return comps
    }
    finally {
      await this.cleanup()
    }
  }

  /**
   * 浏览器级别重试 - 连续失败时重启整个浏览器
   */
  private async crawlWithBrowserRetry(): Promise<CompData[]> {
    const maxBrowserRetries = 3
    let browserRetryCount = 0

    while (browserRetryCount < maxBrowserRetries) {
      try {
        const page = await this.initBrowser()
        await navigateToUrl(page, URLS.OPGG.COMPS, this.logger)
        await this.saveDebugInfo(page, 'comps-page')

        const comps = await this.crawlWithRetry(page)
        return comps
      }
      catch (error) {
        browserRetryCount++
        this.logger.error({
          message: `浏览器级别重试 ${browserRetryCount}/${maxBrowserRetries}`,
          error: error as Error,
        })

        // 关闭当前浏览器
        await this.cleanup()

        if (browserRetryCount >= maxBrowserRetries) {
          this.logger.error({
            message: '达到最大浏览器重试次数,爬取失败',
            error: error as Error,
          })
          throw error
        }

        this.logger.info('重启浏览器并重新爬取...')
        await new Promise(resolve => setTimeout(resolve, browserRetryCount * 10000))
      }
    }

    throw new Error('爬取失败')
  }

  /**
   * 页面级别重试 - 连续失败时抛出错误触发浏览器重启
   */
  private async crawlWithRetry(page: Page): Promise<CompData[]> {
    const comps = await withErrorHandler(
      () => extractCompsFromPage(page),
      '提取阵容列表',
      this.logger,
    )

    if (this.fetchDetailsEnabled) {
      await this.fetchDetails(comps, page)
    }

    return comps
  }

  /**
   * 获取阵容详细信息 - 连续失败时抛出错误
   */
  private async fetchDetails(comps: CompData[], page: Page): Promise<void> {
    this.logger.info('开始获取阵容详细信息')

    const maxDetails = Math.min(comps.length, COMP.MAX_LIMIT)
    this.logger.info(`将获取前 ${maxDetails} 个阵容的详细信息`)

    let consecutiveFailures = 0

    for (let i = 0; i < maxDetails; i++) {
      try {
        this.logger.info(`正在获取阵容 ${i + 1}/${maxDetails} 的详细信息`)
        const details = await extractCompDetails(page, i)
        comps[i].details = details

        consecutiveFailures = 0
      }
      catch (error) {
        this.logger.error({
          message: `获取阵容 ${i + 1} 详细信息失败`,
          error: error as Error,
        })
        consecutiveFailures++

        if (consecutiveFailures >= COMP.MAX_CONSECUTIVE_FAILURES) {
          this.logger.warn({
            message: `连续失败 ${consecutiveFailures} 次,需要重启浏览器`,
          })
          throw new Error('连续失败超过阈值,需要重启浏览器')
        }
      }
    }

    this.logger.info('阵容详细信息获取完成')
  }
}

/**
 * 便捷函数
 */
export async function crawlComps(
  options?: CompCrawlOptions,
): Promise<CompData[]> {
  const crawler = new CompCrawler(options)
  return crawler.crawl()
}
