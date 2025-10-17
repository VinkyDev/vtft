import type { Browser, BrowserContext, Page } from 'playwright'
import { chromium } from 'playwright'
import { logger } from './logger'

/** 浏览器配置 */
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

/** 浏览器管理器 */
export class BrowserManager {
  private browser: Browser | null = null
  private context: BrowserContext | null = null

  /**
   * 启动浏览器
   */
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

  /**
   * 创建新页面
   */
  async newPage(): Promise<Page> {
    if (!this.context) {
      throw new Error('浏览器未启动，请先调用 launch()')
    }

    const page = await this.context.newPage()

    // 隐藏 webdriver 特征
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      })
    })

    return page
  }

  /**
   * 关闭浏览器
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
      this.context = null
      logger.info('浏览器已关闭')
    }
  }

  /**
   * 获取浏览器实例
   */
  getBrowser(): Browser | null {
    return this.browser
  }
}

/** 页面辅助工具 */
export class PageHelper {
  constructor(private page: Page) {}

  /**
   * 导航到 URL
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })
    logger.info(`已导航到: ${url}`)
  }

  /**
   * 等待页面加载
   */
  async waitForLoad(): Promise<void> {
    logger.info('等待页面加载...')
    await this.page.waitForTimeout(3000)

    try {
      await this.page.waitForSelector('img[alt]', { timeout: 10000 })
      logger.info('页面加载完成')
    }
    catch {
      logger.warn('等待超时，继续执行...')
    }
  }

  /**
   * 滚动页面触发懒加载
   */
  async scroll(): Promise<void> {
    logger.info('滚动页面...')

    // 分段滚动
    for (let i = 0; i < 3; i++) {
      const scrollPos = (i + 1) / 3
      await this.page.evaluate((pos) => {
        window.scrollTo(0, document.body.scrollHeight * pos)
      }, scrollPos)
      await this.page.waitForTimeout(2000)
    }

    // 滚动到底部
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await this.page.waitForTimeout(3000)

    // 滚回顶部
    await this.page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await this.page.waitForTimeout(2000)

    logger.info('滚动完成')
  }

  /**
   * 保存截图
   */
  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true })
    logger.info(`截图已保存: ${path}`)
  }

  /**
   * 获取页面实例
   */
  getPage(): Page {
    return this.page
  }
}
