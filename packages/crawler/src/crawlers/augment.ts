import type { AugmentLevel, AugmentMeta, CrawlOptions } from '../types/index'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { extractAugmentsByLevel } from '../extractors/augment'

/** 目标URL */
const TARGET_URL = 'https://www.metatft.com/augments'

/** 强化符文级别配置 */
const AUGMENT_LEVELS: Array<{ level: AugmentLevel, selector: string }> = [
  { level: 'Silver', selector: 'img[alt*="Silver"]' },
  { level: 'Gold', selector: 'img[alt*="Gold"]' },
  { level: 'Prismatic', selector: 'img[alt*="Prismatic"]' },
]

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
   * 执行爬取
   */
  async crawl(): Promise<AugmentMeta[]> {
    try {
      // 启动浏览器
      await this.browserManager.launch(this.options.headless)
      const page = await this.browserManager.newPage()
      const helper = new PageHelper(page)

      // 先导航到网站首页以设置 localStorage
      await page.goto('https://www.metatft.com', {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      })
      logger.info('已导航到首页')

      // 设置语言为中文
      await page.evaluate(() => {
        localStorage.setItem('language', 'zh_cn')
        localStorage.setItem('i18nextLng', 'zh_cn')
        localStorage.setItem('TierListTableView2', 'true')
      })
      logger.info('已设置语言为中文')

      // 导航到目标页面
      await page.goto(TARGET_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      })
      logger.info(`已导航到: ${TARGET_URL}`)

      // 等待表格加载（在 extractor 中也有，这里提前等待确保页面就绪）
      await page.waitForSelector('table tbody tr', { timeout: 30000 })
      logger.info('页面内容已加载')

      // 分别爬取每个级别的强化符文
      const allAugments: AugmentMeta[] = []

      for (const { level, selector } of AUGMENT_LEVELS) {
        logger.info(`准备爬取 ${level} 级别强化符文...`)

        // 先取消所有级别的选中（点击所有按钮来重置状态）
        for (const { selector: btnSelector } of AUGMENT_LEVELS) {
          const button = page.locator(btnSelector).first()
          // 检查按钮是否已选中，如果选中则点击取消
          const isSelected = await button.evaluate((el) => {
            const parent = el.closest('.item-category-selector-item')
            return parent?.classList.contains('selected') ?? false
          })
          if (isSelected) {
            await button.click()
            await page.waitForTimeout(1000)
          }
        }
        logger.info(`已重置所有筛选状态`)

        // 点击目标级别的筛选按钮
        const targetButton = page.locator(selector).first()
        await targetButton.click()
        logger.info(`已点击 ${level} 筛选按钮`)

        // 等待表格更新
        await page.waitForTimeout(2000)

        // 提取该级别的强化符文
        const augments = await extractAugmentsByLevel(page, level)
        allAugments.push(...augments)

        // 保存调试信息
        if (this.options.debug || this.options.screenshot) {
          await this.saveDebugInfo(helper, level)
        }
      }

      // 保存结果
      if (this.options.debug) {
        await this.saveResults(allAugments)
      }

      return allAugments
    }
    finally {
      await this.browserManager.close()
    }
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
  private async saveResults(augments: AugmentMeta[]): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    const resultPath = resolve(debugDir, 'augments-result.json')
    writeFileSync(resultPath, JSON.stringify(augments, null, 2), 'utf-8')
    logger.info(`已保存结果到 ${resultPath}，共 ${augments.length} 个强化符文`)
  }
}

/**
 * 便捷函数：爬取强化符文数据
 */
export async function crawlAugments(options?: CrawlOptions): Promise<AugmentMeta[]> {
  const crawler = new AugmentCrawler(options)
  return await crawler.crawl()
}
