import type { ChampionMeta, CrawlOptions } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { extractChampionsFromPage } from '../extractors/champion'

/** 目标URL */
const TARGET_URL = 'https://op.gg/zh-cn/tft/meta-trends/champion'

/**
 * 英雄爬虫
 */
export class ChampionCrawler {
  private browserManager: BrowserManager
  private options: Required<CrawlOptions>

  constructor(options: CrawlOptions = {}) {
    this.browserManager = new BrowserManager()
    this.options = {
      headless: options.headless ?? true,
      debug: options.debug ?? false,
      screenshot: options.screenshot ?? false,
    }
  }

  /**
   * 执行爬取
   */
  async crawl(): Promise<ChampionMeta[]> {
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

      // 提取英雄数据
      const champions = await extractChampionsFromPage(page)

      // 保存结果
      if (this.options.debug) {
        await this.saveResults(champions)
      }

      return champions
    }
    finally {
      await this.browserManager.close()
    }
  }

  /**
   * 保存调试信息
   */
  private async saveDebugInfo(helper: PageHelper): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    if (this.options.debug) {
      const html = await helper.getPage().content()
      writeFileSync(resolve(debugDir, 'champions-page.html'), html)
      logger.info('已保存页面 HTML')
    }

    if (this.options.screenshot) {
      await helper.screenshot(resolve(debugDir, 'champions-screenshot.png'))
    }
  }

  /**
   * 保存结果
   */
  private async saveResults(champions: ChampionMeta[]): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    const resultPath = resolve(debugDir, 'champions-result.json')
    writeFileSync(resultPath, JSON.stringify(champions, null, 2), 'utf-8')
    logger.info(`已保存结果到 ${resultPath}`)
  }
}

/**
 * 便捷函数：爬取英雄数据
 */
export async function crawlChampions(options?: CrawlOptions): Promise<ChampionMeta[]> {
  const crawler = new ChampionCrawler(options)
  return await crawler.crawl()
}
