import type { Page } from 'playwright'
import type { AugmentMeta, CrawlOptions } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { TIMEOUT_PAGE_LOAD_MS, TIMEOUT_STANDARD_MS } from '../core/timing'
import { extractOpggAugmentsByLevel } from '../extractors/augmentOpgg'
import {
  DATA_QUALITY,
  OPGG_AUGMENT_LEVELS,
  SELECTORS,
  TARGET_URL,
} from './augmentOpgg.constants'

/**
 * OP.GG 强化符文爬虫
 */
export class OpggAugmentCrawler {
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
  async crawl(): Promise<AugmentMeta[]> {
    try {
      // 启动浏览器
      await this.browserManager.launch(this.options.headless)
      const page = await this.browserManager.newPage()
      const helper = new PageHelper(page)

      // 设置用户代理
      await this.setupUserAgent(page)

      // 导航到目标页面
      await this.navigateToTargetPage(page)

      // 等待页面加载
      await this.waitForPageLoad(page)

      // 分别爬取每个级别的强化符文
      const allAugments = await this.crawlAllLevels(page, helper)

      // 去重
      const uniqueAugments = this.deduplicateAugments(allAugments)

      // 验证数据质量
      this.validateDataQuality(uniqueAugments)

      // 保存结果
      if (this.options.debug) {
        await this.saveResults(uniqueAugments)
      }

      logger.info(`OP.GG 强化符文爬取完成，共 ${uniqueAugments.length} 个`)
      return uniqueAugments
    }
    finally {
      await this.browserManager.close()
    }
  }

  /**
   * 设置用户代理
   */
  private async setupUserAgent(page: any): Promise<void> {
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    })
  }

  /**
   * 导航到目标页面
   */
  private async navigateToTargetPage(page: any): Promise<void> {
    await page.goto(TARGET_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT_PAGE_LOAD_MS,
    })
    logger.info(`已导航到: ${TARGET_URL}`)
  }

  /**
   * 等待页面加载
   */
  private async waitForPageLoad(page: Page): Promise<void> {
    await page.locator(SELECTORS.AUGMENT_CONTAINER).first().waitFor({
      timeout: TIMEOUT_STANDARD_MS,
    })
    logger.info('页面加载完成')
  }

  /**
   * 爬取所有级别的强化符文
   */
  private async crawlAllLevels(page: Page, helper: PageHelper): Promise<AugmentMeta[]> {
    const allAugments: AugmentMeta[] = []

    for (const { level, label } of OPGG_AUGMENT_LEVELS) {
      logger.info(`准备爬取 ${label} 级别强化符文...`)

      try {
        // 点击对应级别的标签
        await this.clickLevelTab(page, label)

        // 提取该级别的强化符文
        const augments = await extractOpggAugmentsByLevel(page, level)
        allAugments.push(...augments)

        // 保存调试信息
        if (this.options.debug || this.options.screenshot) {
          await this.saveDebugInfo(helper, level)
        }
      }
      catch (error) {
        logger.error(`爬取 ${label} 级别失败:`, error)
      }
    }

    return allAugments
  }

  /**
   * 点击级别标签
   */
  private async clickLevelTab(page: Page, label: string): Promise<void> {
    const tabContainer = page.locator(SELECTORS.TAB_CONTAINER)
    const tabButton = tabContainer.getByText(label).last()

    if (!tabButton) {
      throw new Error(`未找到 ${label} 标签`)
    }

    await tabButton.click({ timeout: TIMEOUT_STANDARD_MS })
    logger.info(`已点击 ${label} 标签`)
  }

  /**
   * 验证数据质量
   */
  private validateDataQuality(augments: AugmentMeta[]): void {
    if (augments.length < DATA_QUALITY.MIN_AUGMENT_COUNT) {
      logger.warn(`强化符文数量过少: ${augments.length}, 期望至少 ${DATA_QUALITY.MIN_AUGMENT_COUNT} 个`)
    }
    else {
      logger.info(`数据质量验证通过: ${augments.length} 个强化符文`)
    }
  }

  /**
   * 去重强化符文数据
   */
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

  /**
   * 保存调试信息
   */
  private async saveDebugInfo(helper: PageHelper, level: string): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    if (this.options.debug) {
      const html = await helper.getPage().content()
      writeFileSync(resolve(debugDir, `opgg-augments-${level.toLowerCase()}-page.html`), html)
      logger.info(`已保存 OP.GG ${level} 页面 HTML`)
    }

    if (this.options.screenshot) {
      await helper.screenshot(resolve(debugDir, `opgg-augments-${level.toLowerCase()}-screenshot.png`))
    }
  }

  /**
   * 保存结果
   */
  private async saveResults(augments: AugmentMeta[]): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    const resultPath = resolve(debugDir, 'opgg-augments-result.json')
    writeFileSync(resultPath, JSON.stringify(augments, null, 2), 'utf-8')
    logger.info(`已保存 OP.GG 结果到 ${resultPath}，共 ${augments.length} 个强化符文`)
  }
}

/**
 * 便捷函数：爬取 OP.GG 强化符文数据
 */
export async function crawlOpggAugments(options?: CrawlOptions): Promise<AugmentMeta[]> {
  const crawler = new OpggAugmentCrawler(options)
  return await crawler.crawl()
}
