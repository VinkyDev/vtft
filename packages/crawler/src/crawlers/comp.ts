import type { Page } from 'playwright'
import type { CompData, CrawlOptions } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Logger } from 'logger'
import { withRetry } from 'utils'
import { BrowserManager, PageHelper } from '../core/browser'
import { PageStateManager } from '../core/pageState'
import { getCwd } from '../core/utils'
import { extractCompsFromPage } from '../extractors/comp'
import { CompDetailsExtractor } from '../extractors/compDetails'
import {
  MAX_COMPS_LIMIT,
  MAX_CONSECUTIVE_FAILURES,
  TARGET_URL,
} from './comp.constants'

const logger = new Logger({ namespace: 'CompCrawler', withTime: true })

export class CompCrawler {
  private browserManager: BrowserManager
  private options: Required<CrawlOptions & { fetchDetails?: boolean }>

  constructor(options: CrawlOptions & { fetchDetails?: boolean } = {}) {
    this.browserManager = new BrowserManager()
    this.options = {
      headless: options.headless ?? true,
      debug: options.debug ?? false,
      screenshot: options.screenshot ?? false,
      fetchDetails: options.fetchDetails ?? true,
    }
  }

  async crawl(): Promise<CompData[]> {
    try {
      await this.browserManager.launch(this.options.headless)
      const page = await this.browserManager.newPage()
      const helper = new PageHelper(page)

      await helper.navigate(TARGET_URL)

      if (this.options.debug || this.options.screenshot) {
        await this.saveDebugInfo(helper)
      }

      const comps = await this.crawlWithRetry(page)

      if (this.options.debug) {
        await this.saveResults(comps)
      }

      return comps
    }
    finally {
      await this.browserManager.close()
    }
  }

  private async crawlWithRetry(page: Page): Promise<CompData[]> {
    const crawlOnce = async (): Promise<CompData[]> => {
      const comps = await extractCompsFromPage(page)

      if (this.options.fetchDetails) {
        const shouldRetry = await this.fetchDetails(comps, page)

        if (shouldRetry) {
          throw new Error('刷新页面重新爬取')
        }
      }

      return comps
    }

    const crawlWithRetryWrapper = withRetry(crawlOnce, {
      maxRetries: 3,
      delayMs: 0,
      onRetry: (error, attempt) => {
        logger.warning({ message: `爬取需要重试 (尝试 ${attempt}/3)`, error: error as Error })
      },
    })

    logger.info('开始爬取阵容')
    const result = await crawlWithRetryWrapper()
    logger.info('爬取成功完成')

    return result
  }

  private async fetchDetails(comps: CompData[], page: Page): Promise<boolean> {
    logger.info('开始获取阵容详细信息')

    const maxDetails = Math.min(comps.length, MAX_COMPS_LIMIT)
    logger.info(`将获取前 ${maxDetails} 个阵容的详细信息`)

    const extractor = new CompDetailsExtractor(page)
    const stateManager = new PageStateManager(page)

    let consecutiveFailures = 0

    for (let i = 0; i < maxDetails; i++) {
      try {
        if (stateManager.shouldRefresh()) {
          await stateManager.refresh()
          logger.warning('页面已刷新,需要完整重新爬取')
          return true
        }

        logger.info(`正在获取阵容 ${i + 1}/${maxDetails} 的详细信息`)
        const details = await extractor.extract(i)
        comps[i].details = details

        consecutiveFailures = 0
        stateManager.recordOperation()
      }
      catch (error) {
        logger.error({ message: `获取阵容 ${i + 1} 详细信息失败`, error: error as Error })
        consecutiveFailures++

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          logger.warning({ message: `连续失败 ${consecutiveFailures} 次,刷新页面并完整重新爬取` })

          try {
            await stateManager.refresh()
            return true
          }
          catch (refreshError) {
            logger.error({ message: `刷新失败,停止爬取`, error: refreshError as Error })
            throw refreshError
          }
        }
      }
    }

    logger.info('阵容详细信息获取完成')
    return false
  }

  private async saveDebugInfo(helper: PageHelper): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    if (this.options.debug) {
      const html = await helper.getPage().content()
      writeFileSync(resolve(debugDir, 'comps-page.html'), html)
      logger.info('已保存页面 HTML')
    }

    if (this.options.screenshot) {
      await helper.screenshot(resolve(debugDir, 'comps-screenshot.png'))
    }
  }

  private async saveResults(comps: CompData[]): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    const resultPath = resolve(debugDir, 'comps-result.json')
    writeFileSync(resultPath, JSON.stringify(comps, null, 2), 'utf-8')
    logger.info(`已保存结果到 ${resultPath}`)
  }
}

export async function crawlComps(options?: CrawlOptions & { fetchDetails?: boolean }): Promise<CompData[]> {
  const crawler = new CompCrawler(options)
  return await crawler.crawl()
}
