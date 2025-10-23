import type { AugmentLevel, AugmentMeta, CrawlOptions } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { withRetry } from 'utils'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { extractOpggAugmentsByLevel } from '../extractors/augmentOpgg'

/** 目标URL */
const TARGET_URL = 'https://op.gg/zh-cn/tft/meta-trends/augments'

/** 强化符文级别配置 - 新网站的级别映射 */
const OPGG_AUGMENT_LEVELS: Array<{ level: AugmentLevel, value: string, label: string }> = [
  { level: 'Silver', value: 'silver', label: '白银' },
  { level: 'Gold', value: 'gold', label: '金币' },
  { level: 'Prismatic', value: 'prism', label: '稜鏡' },
]

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
    return withRetry(
      async () => {
        try {
          // 启动浏览器
          await this.browserManager.launch(this.options.headless)
          const page = await this.browserManager.newPage()
          const helper = new PageHelper(page)

          // 设置用户代理
          await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          })

          // 导航到目标页面
          await page.goto(TARGET_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
          })
          logger.info(`已导航到: ${TARGET_URL}`)

          // 等待页面加载
          await page.waitForSelector('div.flex.flex-1.rounded-\\[4px\\]', { timeout: 10000 })
          logger.info('页面加载完成')

          // 分别爬取每个级别的强化符文
          const allAugments: AugmentMeta[] = []

          for (const { level, label } of OPGG_AUGMENT_LEVELS) {
            logger.info(`准备爬取 ${label} 级别强化符文...`)

            try {
              // 点击对应级别的标签
              const tabContainer = page.locator('div.flex.flex-1.rounded-\\[4px\\]')
              const tabButton = tabContainer.getByText(label, { exact: true })
              if (!tabButton) {
                logger.error(`未找到 ${label} 标签`)
                continue
              }

              await tabButton.click()
              // 等待表格更新
              await page.waitForTimeout(3000)
              logger.info(`已点击 ${label} 标签`)

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

          // 去重
          const uniqueAugments = this.deduplicateAugments(allAugments)

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
      },
      {
        maxAttempts: 3,
        delay: 2000,
        backoffFactor: 2,
      },
    )
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
