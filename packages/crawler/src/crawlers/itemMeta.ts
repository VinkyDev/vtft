import type { Page } from 'playwright'
import type { CrawlOptions, ItemCategory, ItemMeta } from 'types'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { BrowserManager, PageHelper } from '../core/browser'
import { getCwd, logger } from '../core/logger'
import { extractItemsFromPage } from '../extractors/item'

/** 目标URL */
const TARGET_URL = 'https://op.gg/zh-cn/tft/meta-trends/item'

/** 装备分类配置 */
const ITEM_CATEGORIES: Array<{ value: ItemCategory, label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'radiant', label: '圣光' },
  { value: 'artifact', label: '神器' },
  { value: 'core', label: '核心' },
  { value: 'emblem', label: '徽章' },
  { value: 'component', label: '组件' },
]

/**
 * 装备元数据爬虫
 */
export class ItemMetaCrawler {
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
  async crawl(): Promise<ItemMeta[]> {
    try {
      // 启动浏览器
      await this.browserManager.launch(this.options.headless)
      const page = await this.browserManager.newPage()
      const helper = new PageHelper(page)

      // 导航到目标页面
      logger.info('开始爬取装备元数据...')
      await helper.navigate(TARGET_URL)
      logger.info('页面加载完成')

      // 等待 tabs 加载
      await page.waitForSelector('.md\\:flex.md\\:gap-4', { timeout: 30000 })
      logger.info('分类 tabs 已加载')

      const allItems: ItemMeta[] = []

      // 遍历所有分类
      for (const category of ITEM_CATEGORIES) {
        logger.info(`开始抓取分类: ${category.label} (${category.value})`)

        // 点击对应的分类 tab
        await this.clickCategoryTab(page, category.label)

        // 等待表格数据更新
        await page.waitForSelector('table tbody tr', { timeout: 30000 })

        // 提取当前分类的装备数据
        const items = await extractItemsFromPage(page, category.value)
        allItems.push(...items)

        logger.info(`分类 ${category.label} 抓取完成，共 ${items.length} 个装备`)
      }

      // 保存调试信息和结果
      if (this.options.debug || this.options.screenshot) {
        await this.saveDebugInfo(helper, allItems)
      }

      logger.info(`所有分类抓取完成，共 ${allItems.length} 个装备`)
      return allItems
    }
    finally {
      await this.browserManager.close()
    }
  }

  /**
   * 点击分类 tab
   */
  private async clickCategoryTab(page: Page, label: string): Promise<void> {
    // 在桌面端的 tabs 容器中查找对应的 tab
    const tabSelector = `.md\\:flex.md\\:gap-4 > div > div:has-text("${label}")`
    await page.click(tabSelector)
    logger.info(`已点击分类 tab: ${label}`)
  }

  /**
   * 保存调试信息
   */
  private async saveDebugInfo(helper: PageHelper, items: ItemMeta[]): Promise<void> {
    const debugDir = resolve(getCwd(), 'debug')
    await mkdir(debugDir, { recursive: true })

    if (this.options.debug) {
      const resultPath = resolve(debugDir, 'item-meta.json')
      writeFileSync(resultPath, JSON.stringify(items, null, 2), 'utf-8')
      logger.info(`结果已保存到: ${resultPath}`)
    }

    if (this.options.screenshot) {
      await helper.screenshot(resolve(debugDir, 'item-meta-screenshot.png'))
    }
  }
}

/**
 * 便捷函数：爬取装备元数据
 */
export async function crawlItemMeta(options?: CrawlOptions): Promise<ItemMeta[]> {
  const crawler = new ItemMetaCrawler(options)
  return await crawler.crawl()
}
