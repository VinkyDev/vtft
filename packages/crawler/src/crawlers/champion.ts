import type { Page } from 'playwright'
import type { ChampionMeta, CrawlOptions } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { withRetry } from 'utils'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { PageStateManager } from '../core/pageState'
import { WAIT_SHORT_MS } from '../core/timing'
import { extractChampionsFromPage } from '../extractors/champion'
import {
  ELEMENT_WAIT_TIMEOUT_MS,
  MAX_RETRY_ATTEMPTS,
  MIN_CHAMPION_COUNT,
  NAVIGATION_TIMEOUT_MS,
  TABLE_ROW_SELECTOR,
  TARGET_URL,
} from './champion.constants'

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
      const _stateManager = new PageStateManager(page)

      // 导航到目标页面
      await this.navigateToTargetPage(page)

      // 等待页面加载
      await this.waitForPageLoad(page)

      // 保存调试信息
      if (this.options.debug || this.options.screenshot) {
        await this.saveDebugInfo(helper)
      }

      // 提取英雄数据
      const champions = await this.extractChampionsWithRetry(page)

      // 验证数据质量
      this.validateDataQuality(champions)

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
   * 导航到目标页面
   */
  private async navigateToTargetPage(page: Page): Promise<void> {
    const navigateWithRetry = withRetry(
      () => page.goto(TARGET_URL, {
        waitUntil: 'domcontentloaded',
        timeout: NAVIGATION_TIMEOUT_MS,
      }),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`导航到目标页面失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await navigateWithRetry()
    logger.info(`已导航到: ${TARGET_URL}`)
  }

  /**
   * 等待页面加载
   */
  private async waitForPageLoad(page: Page): Promise<void> {
    const waitWithRetry = withRetry(
      () => page.waitForSelector(TABLE_ROW_SELECTOR, { timeout: ELEMENT_WAIT_TIMEOUT_MS }),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`等待页面加载失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await waitWithRetry()
    logger.info('页面内容已加载')
  }

  /**
   * 提取英雄数据（带重试）
   */
  private async extractChampionsWithRetry(page: Page): Promise<ChampionMeta[]> {
    const extractWithRetry = withRetry(
      () => extractChampionsFromPage(page),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`提取英雄数据失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    return await extractWithRetry()
  }

  /**
   * 验证数据质量
   */
  private validateDataQuality(champions: ChampionMeta[]): void {
    if (champions.length < MIN_CHAMPION_COUNT) {
      logger.warn(`英雄数据量不足: ${champions.length} < ${MIN_CHAMPION_COUNT}`)
    }
    else {
      logger.info(`英雄数据质量良好: ${champions.length} 个英雄`)
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
