import type { Page } from 'playwright'
import type { CompData, CrawlOptions } from '../types/index'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { extractCompsFromPage } from '../extractors/comp'
import { extractCompDetails } from '../extractors/compDetails'

/** 目标URL */
const TARGET_URL = 'https://op.gg/zh-cn/tft/meta-trends/comps'

/**
 * 阵容爬虫
 */
export class CompCrawler {
  private browserManager: BrowserManager
  private options: Required<CrawlOptions & { fetchDetails?: boolean }>

  constructor(options: CrawlOptions & { fetchDetails?: boolean } = {}) {
    this.browserManager = new BrowserManager()
    this.options = {
      headless: options.headless ?? true,
      debug: options.debug ?? false,
      screenshot: options.screenshot ?? false,
      fetchDetails: options.fetchDetails ?? false,
    }
  }

  /**
   * 执行爬取
   */
  async crawl(): Promise<CompData[]> {
    try {
      // 启动浏览器
      await this.browserManager.launch(this.options.headless)
      const page = await this.browserManager.newPage()
      const helper = new PageHelper(page)

      // 导航到目标页面
      await helper.navigate(TARGET_URL)
      await helper.waitForLoad()

      // 滚动页面加载所有数据
      await helper.scroll()

      // 保存调试信息
      if (this.options.debug || this.options.screenshot) {
        await this.saveDebugInfo(helper)
      }

      // 提取阵容数据
      const comps = await extractCompsFromPage(page)

      // 提取详细信息
      if (this.options.fetchDetails) {
        await this.fetchDetails(comps, page)
      }

      // 保存结果
      if (this.options.debug) {
        await this.saveResults(comps)
      }

      return comps
    }
    finally {
      await this.browserManager.close()
    }
  }

  /**
   * 提取详细信息
   */
  private async fetchDetails(comps: CompData[], page: Page): Promise<void> {
    logger.info('开始获取阵容详细信息...')

    // 限制数量避免过长时间
    const maxDetails = Math.min(comps.length, 1000)
    logger.info(`将获取前 ${maxDetails} 个阵容的详细信息`)

    for (let i = 0; i < maxDetails; i++) {
      try {
        logger.info(`正在获取阵容 ${i + 1}/${maxDetails} 的详细信息...`)
        const details = await extractCompDetails(page, i)
        comps[i].details = details

        if (i < maxDetails - 1) {
          await page.waitForTimeout(1000)
        }
      }
      catch (error) {
        logger.error(`获取阵容 ${i + 1} 详细信息失败:`, error)
      }
    }

    logger.info('阵容详细信息获取完成')
  }

  /**
   * 保存调试信息
   */
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

  /**
   * 保存结果
   */
  private async saveResults(comps: CompData[]): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    const resultPath = resolve(debugDir, 'comps-result.json')
    writeFileSync(resultPath, JSON.stringify(comps, null, 2), 'utf-8')
    logger.info(`已保存结果到 ${resultPath}`)
  }
}

/**
 * 便捷函数：爬取阵容数据
 */
export async function crawlComps(options?: CrawlOptions & { fetchDetails?: boolean }): Promise<CompData[]> {
  const crawler = new CompCrawler(options)
  return await crawler.crawl()
}
