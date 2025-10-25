import type { Page } from 'playwright'
import type { AugmentLevel, AugmentMeta, CrawlOptions } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { withRetry } from 'utils'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { PageStateManager } from '../core/pageState'
import { TIMEOUT_PAGE_LOAD_MS, TIMEOUT_STANDARD_MS, WAIT_SHORT_MS } from '../core/timing'
import { extractAugmentsByLevel } from '../extractors/augment'
import {
  AUGMENT_LEVELS,
  HOME_URL,
  LEVEL_SELECTOR_CONTAINER,
  MAX_RETRY_ATTEMPTS,
  OPGG_MIN_DATA_THRESHOLD,
  TABLE_ROW_SELECTOR,
  TARGET_URL,
} from './augment.constants'
import { crawlOpggAugments } from './augmentOpgg'

/**
 * 强化符文爬虫
 */
export class AugmentCrawler {
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
   * 执行爬取 - 优先使用 OP.GG，数据不足时降级到 MetaTFT
   */
  async crawl(): Promise<AugmentMeta[]> {
    try {
      // 第一步：尝试使用 OP.GG 爬取数据
      logger.info('优先尝试使用 OP.GG 爬取强化符文数据...')
      try {
        const opggData = await crawlOpggAugments(this.options)

        if (opggData.length > OPGG_MIN_DATA_THRESHOLD) {
          logger.info(`OP.GG 爬取成功，共获得 ${opggData.length} 个强化符文，数量充足，直接采用`)

          // 保存结果（如果启用调试）
          if (this.options.debug) {
            await this.saveResults(opggData, 'opgg')
          }

          return opggData
        }
        else {
          logger.warn(`OP.GG 爬取到 ${opggData.length} 个强化符文，数量不足（< ${OPGG_MIN_DATA_THRESHOLD}），降级到 MetaTFT`)
        }
      }
      catch (error) {
        logger.error('OP.GG 爬取失败，降级到 MetaTFT:', error)
      }

      // 第二步：降级到 MetaTFT 爬取数据
      logger.info('使用 MetaTFT 爬取强化符文数据...')
      return await this.crawlFromMetaTFT()
    }
    catch (error) {
      logger.error('强化符文爬取完全失败:', error)
      throw error
    }
  }

  /**
   * 从 MetaTFT 爬取数据
   */
  private async crawlFromMetaTFT(): Promise<AugmentMeta[]> {
    try {
      // 启动浏览器
      await this.browserManager.launch(this.options.headless)
      const page = await this.browserManager.newPage()
      const helper = new PageHelper(page)
      const _stateManager = new PageStateManager(page)

      // 导航到首页并设置语言
      await this.navigateToHomePage(page)
      await this.setupLanguageSettings(page)

      // 导航到目标页面
      await this.navigateToTargetPage(page)

      // 等待表格加载
      await this.waitForTableLoad(page)

      // 分别爬取每个级别的强化符文
      const allAugments: AugmentMeta[] = []

      for (const { level, selector } of AUGMENT_LEVELS) {
        logger.info(`准备爬取 ${level} 级别强化符文...`)

        // 重置筛选状态
        await this.resetFilterState(page)

        // 点击目标级别筛选按钮
        await this.clickLevelFilter(page, selector, level)

        // 等待表格更新
        await this.waitForTableUpdate(page)

        // 提取该级别的强化符文
        const augments = await this.extractAugmentsWithRetry(page, level)
        allAugments.push(...augments)

        // 保存调试信息
        if (this.options.debug || this.options.screenshot) {
          await this.saveDebugInfo(helper, level)
        }
      }

      // 保存结果
      if (this.options.debug) {
        await this.saveResults(allAugments, 'metatft')
      }

      return allAugments
    }
    finally {
      await this.browserManager.close()
    }
  }

  /**
   * 导航到首页
   */
  private async navigateToHomePage(page: Page): Promise<void> {
    const navigateWithRetry = withRetry(
      () => page.goto(HOME_URL, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUT_PAGE_LOAD_MS,
      }),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`导航到首页失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await navigateWithRetry()
    logger.info('已导航到首页')
  }

  /**
   * 设置语言配置
   */
  private async setupLanguageSettings(page: Page): Promise<void> {
    const setupWithRetry = withRetry(
      () => page.evaluate(() => {
        localStorage.setItem('language', 'zh_cn')
        localStorage.setItem('i18nextLng', 'zh_cn')
        localStorage.setItem('TierListTableView2', 'true')
      }),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`设置语言配置失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await setupWithRetry()
    logger.info('已设置语言为中文')
  }

  /**
   * 导航到目标页面
   */
  private async navigateToTargetPage(page: Page): Promise<void> {
    const navigateWithRetry = withRetry(
      () => page.goto(TARGET_URL, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUT_PAGE_LOAD_MS,
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
   * 等待表格加载
   */
  private async waitForTableLoad(page: Page): Promise<void> {
    const waitWithRetry = withRetry(
      () => page.locator(TABLE_ROW_SELECTOR).waitFor({ timeout: TIMEOUT_STANDARD_MS }),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`等待表格加载失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await waitWithRetry()
    logger.info('页面内容已加载')
  }

  /**
   * 重置筛选状态
   */
  private async resetFilterState(page: Page): Promise<void> {
    const resetWithRetry = withRetry(
      async () => {
        for (const { selector: btnSelector } of AUGMENT_LEVELS) {
          const button = page.locator(btnSelector).first()
          const isSelected = await button.evaluate((el) => {
            const parent = el.closest(LEVEL_SELECTOR_CONTAINER)
            return parent?.classList.contains('selected') ?? false
          })
          if (isSelected) {
            await button.click()
            await page.locator(TABLE_ROW_SELECTOR).waitFor({ timeout: TIMEOUT_STANDARD_MS })
          }
        }
      },
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`重置筛选状态失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await resetWithRetry()
    logger.info('已重置所有筛选状态')
  }

  /**
   * 点击级别筛选按钮
   */
  private async clickLevelFilter(page: Page, selector: string, level: AugmentLevel): Promise<void> {
    const clickWithRetry = withRetry(
      async () => {
        const targetButton = page.locator(selector).first()
        await targetButton.click()
      },
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`点击 ${level} 筛选按钮失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await clickWithRetry()
    logger.info(`已点击 ${level} 筛选按钮`)
  }

  /**
   * 等待表格更新
   */
  private async waitForTableUpdate(page: Page): Promise<void> {
    const waitWithRetry = withRetry(
      () => page.locator(TABLE_ROW_SELECTOR).waitFor({ timeout: TIMEOUT_STANDARD_MS }),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`等待表格更新失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    await waitWithRetry()
    logger.info('表格已更新')
  }

  /**
   * 提取强化符文数据（带重试）
   */
  private async extractAugmentsWithRetry(page: Page, level: AugmentLevel): Promise<AugmentMeta[]> {
    const extractWithRetry = withRetry(
      () => extractAugmentsByLevel(page, level),
      {
        maxRetries: MAX_RETRY_ATTEMPTS,
        delayMs: WAIT_SHORT_MS,
        onRetry: (error, attempt) => {
          logger.warn(`提取 ${level} 强化符文失败，重试 ${attempt}/${MAX_RETRY_ATTEMPTS}: ${error}`)
        },
      },
    )

    return await extractWithRetry()
  }

  /**
   * 保存调试信息
   */
  private async saveDebugInfo(helper: PageHelper, level: AugmentLevel): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    if (this.options.debug) {
      const html = await helper.getPage().content()
      writeFileSync(resolve(debugDir, `augments-${level.toLowerCase()}-page.html`), html)
      logger.info(`已保存 ${level} 页面 HTML`)
    }

    if (this.options.screenshot) {
      await helper.screenshot(resolve(debugDir, `augments-${level.toLowerCase()}-screenshot.png`))
    }
  }

  /**
   * 保存结果
   */
  private async saveResults(augments: AugmentMeta[], source: string = 'combined'): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    const resultPath = resolve(debugDir, `augments-${source}-result.json`)
    writeFileSync(resultPath, JSON.stringify(augments, null, 2), 'utf-8')
    logger.info(`已保存 ${source} 结果到 ${resultPath}，共 ${augments.length} 个强化符文`)
  }
}

/**
 * 便捷函数：爬取强化符文数据
 */
export async function crawlAugments(options?: CrawlOptions): Promise<AugmentMeta[]> {
  const crawler = new AugmentCrawler(options)
  return await crawler.crawl()
}
