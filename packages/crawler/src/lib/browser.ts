/**
 * 浏览器管理
 */

import type { Browser, BrowserContext, Page } from 'playwright'
import logger from 'logger/server'
import { chromium } from 'playwright'
import { TIMEOUT_PAGE_LOAD_MS } from './timing'

const BROWSER_CONFIG = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 },
  locale: 'zh-CN',
  timezoneId: 'Asia/Shanghai',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
  },
  launchArgs: [
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
  ],
} as const

export class BrowserManager {
  private browser: Browser | null = null
  private context: BrowserContext | null = null

  async launch(headless: boolean = true): Promise<void> {
    this.browser = await chromium.launch({
      headless,
      args: [...BROWSER_CONFIG.launchArgs],
    })

    this.context = await this.browser.newContext({
      userAgent: BROWSER_CONFIG.userAgent,
      viewport: BROWSER_CONFIG.viewport,
      locale: BROWSER_CONFIG.locale,
      timezoneId: BROWSER_CONFIG.timezoneId,
      extraHTTPHeaders: BROWSER_CONFIG.headers,
    })

    logger.info('浏览器已启动')
  }

  async newPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('浏览器未启动，请先调用 launch()')
    }

    const page = await this.context.newPage()

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      })
    })

    return page
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.context = null
      logger.info('浏览器已关闭')
    }
  }

  getBrowser(): Browser | null {
    return this.browser
  }
}

export class PageHelper {
  constructor(private page: Page) {}

  async navigate(url: string, useCache: boolean = false): Promise<void> {
    if (!useCache) {
      await this.page.route('**/*', (route) => {
        const headers = {
          ...route.request().headers(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
        route.continue({ headers })
      })
    }

    await this.page.goto(url, {
      waitUntil: 'load',
      timeout: 60000,
    })
    logger.info(`已导航到: ${url}`)
  }

  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true })
    logger.info(`截图已保存: ${path}`)
  }

  getPage(): Page {
    return this.page
  }
}

export class PageStateManager {
  private operationCount = 0
  private readonly refreshInterval: number

  constructor(
    private page: Page,
    refreshInterval: number = 20,
  ) {
    this.refreshInterval = refreshInterval
  }

  recordOperation(): void {
    this.operationCount++
  }

  shouldRefresh(): boolean {
    return this.operationCount >= this.refreshInterval
  }

  async refresh(): Promise<void> {
    await this.page.reload({ waitUntil: 'load', timeout: TIMEOUT_PAGE_LOAD_MS })
    this.reset()
  }

  reset(): void {
    this.operationCount = 0
  }
}
