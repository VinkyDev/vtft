import type { Page } from 'playwright'
import type { CompData, CrawlOptions } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { PageStateManager } from '../core/pageState'
import { extractCompsFromPage } from '../extractors/comp'
import { CompDetailsExtractor } from '../extractors/compDetails'
import {
  MAX_COMPS_LIMIT,
  MAX_CONSECUTIVE_FAILURES,
  TARGET_URL,
} from './comp.constants'

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
      await helper.waitForLoad()

      if (this.options.debug || this.options.screenshot) {
        await this.saveDebugInfo(helper)
      }

      const comps = await extractCompsFromPage(page)

      if (this.options.fetchDetails) {
        await this.fetchDetails(comps, page)
      }

      if (this.options.debug) {
        await this.saveResults(comps)
      }

      return comps
    }
    finally {
      await this.browserManager.close()
    }
  }

  private async fetchDetails(comps: CompData[], page: Page): Promise<void> {
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
        }

        logger.info(`正在获取阵容 ${i + 1}/${maxDetails} 的详细信息`)
        const details = await extractor.extract(i)
        comps[i].details = details

        consecutiveFailures = 0
        stateManager.recordOperation()
      }
      catch (error) {
        logger.error(`获取阵容 ${i + 1} 详细信息失败: ${error}`)
        consecutiveFailures++

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          logger.warn(`连续失败 ${consecutiveFailures} 次,尝试刷新页面恢复`)

          try {
            await stateManager.refresh()
            consecutiveFailures = 0
          }
          catch (refreshError) {
            logger.error(`刷新失败,停止爬取: ${refreshError}`)
            break
          }
        }
      }
    }

    logger.info('阵容详细信息获取完成')
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
