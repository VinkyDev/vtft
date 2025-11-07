/**
 * 爬虫基类
 */

import type { Logger } from 'logger'
import type { Page } from 'playwright'
import type { CrawlOptions } from 'types'
import { BrowserManager } from './browser'
import { saveJsonResult, savePageDebug } from './helpers'

/**
 * 爬虫基类
 */
export abstract class BaseCrawler<T> {
  protected browserManager: BrowserManager
  protected logger: Logger
  protected options: Required<CrawlOptions>

  constructor(logger: Logger, options: CrawlOptions = {}) {
    this.logger = logger
    this.browserManager = new BrowserManager()
    this.options = {
      headless: options.headless ?? true,
      debug: options.debug ?? false,
      screenshot: options.screenshot ?? false,
    }
  }

  /**
   * 执行爬取 - 子类必须实现
   */
  abstract crawl(): Promise<T>

  /**
   * 初始化浏览器和页面
   */
  protected async initBrowser(): Promise<Page> {
    await this.browserManager.launch(this.options.headless)
    const page = await this.browserManager.newPage()

    this.logger.info('浏览器已初始化')
    return page
  }

  /**
   * 关闭浏览器
   */
  protected async cleanup(): Promise<void> {
    await this.browserManager.close()
  }

  /**
   * 保存页面调试信息
   */
  protected async saveDebugInfo(
    page: Page,
    name: string,
  ): Promise<void> {
    if (!this.options.debug && !this.options.screenshot) {
      return
    }

    await savePageDebug(
      page,
      name,
      {
        saveHtml: this.options.debug,
        saveScreenshot: this.options.screenshot,
      },
      this.logger,
    )
  }

  /**
   * 保存爬取结果
   */
  protected async saveResults(data: T, name: string): Promise<void> {
    if (!this.options.debug) {
      return
    }

    await saveJsonResult(data, `${name}-result`, this.logger)
  }
}
