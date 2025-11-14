/**
 * 浏览器管理
 */

import type { Browser, BrowserContext, Page } from 'playwright'
import logger from 'logger'
import { chromium } from 'playwright'
import { TIMEOUT_PAGE_LOAD_MS } from './timing'

const BROWSER_CONFIG = {
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  viewport: { width: 1920, height: 1080 },
  locale: 'zh-CN',
  timezoneId: 'Asia/Shanghai',
  headers: {
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
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

/**
 * 截图
 */
export async function takeScreenshot(
  page: Page,
  path: string,
): Promise<void> {
  await page.screenshot({ path, fullPage: true })
  logger.info(`截图已保存: ${path}`)
}

/**
 * 重新加载页面
 */
export async function reloadPage(page: Page): Promise<void> {
  await page.reload({
    waitUntil: 'load',
    timeout: TIMEOUT_PAGE_LOAD_MS,
  })
}
