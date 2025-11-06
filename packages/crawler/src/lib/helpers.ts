/**
 * 辅助工具函数
 */

import type { Logger } from 'logger'
import type { Page } from 'playwright'
import type { PageHelper } from './browser'
import { writeFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Logger as LoggerClass } from 'logger'
import { withRetry } from 'utils'
import { RETRY } from '../constants'
import { TIMEOUT_PAGE_LOAD_MS } from './timing'
import { getCwd } from './utils'

/**
 * 创建 Crawler Logger
 */
export function createCrawlerLogger(name: string): Logger {
  return new LoggerClass({ namespace: 'crawler', scope: name })
}

/**
 * 创建 Extractor Logger
 */
export function createExtractorLogger(name: string): Logger {
  return new LoggerClass({ namespace: 'crawler', scope: `extractor/${name}` })
}

/**
 * 导航到 URL
 */
export async function navigateToUrl(
  page: Page,
  url: string,
  logger: Logger,
  options?: {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'
    timeout?: number
  },
): Promise<void> {
  const {
    waitUntil = 'load',
    timeout = TIMEOUT_PAGE_LOAD_MS,
  } = options ?? {}

  await withErrorHandler(
    () => page.goto(url, { waitUntil, timeout }),
    `导航到 ${url}`,
    logger,
  )

  logger.info(`已导航到: ${url}`)
}

/**
 * 设置 LocalStorage
 */
export async function setLocalStorage(
  page: Page,
  items: Record<string, string>,
  logger: Logger,
): Promise<void> {
  await withErrorHandler(
    () => page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        localStorage.setItem(key, value)
      }
    }, items),
    '设置 LocalStorage',
    logger,
  )

  logger.info(`已设置 LocalStorage: ${Object.keys(items).join(', ')}`)
}

/**
 * 保存页面调试信息
 */
export async function savePageDebug(
  helper: PageHelper,
  name: string,
  options: {
    saveHtml?: boolean
    saveScreenshot?: boolean
  },
  logger: Logger,
): Promise<void> {
  const debugDir = resolve(getCwd(), 'debug')
  await mkdir(debugDir, { recursive: true })

  if (options.saveHtml) {
    const html = await helper.getPage().content()
    const htmlPath = resolve(debugDir, `${name}.html`)
    writeFileSync(htmlPath, html)
    logger.info(`已保存 HTML: ${htmlPath}`)
  }

  if (options.saveScreenshot) {
    const screenshotPath = resolve(debugDir, `${name}.png`)
    await helper.screenshot(screenshotPath)
  }
}

/**
 * 保存 JSON 结果
 */
export async function saveJsonResult<T>(
  data: T,
  name: string,
  logger: Logger,
): Promise<void> {
  const debugDir = resolve(getCwd(), 'debug')
  await mkdir(debugDir, { recursive: true })

  const resultPath = resolve(debugDir, `${name}.json`)
  writeFileSync(resultPath, JSON.stringify(data, null, 2), 'utf-8')
  logger.info(`已保存结果: ${resultPath},共 ${Array.isArray(data) ? data.length : 1} 项`)
}

/**
 * 带错误处理和重试的执行函数
 */
export async function withErrorHandler<T>(
  fn: () => Promise<T>,
  context: string,
  logger: Logger,
  options?: {
    maxRetries?: number
    delayMs?: number
  },
): Promise<T> {
  const {
    maxRetries = RETRY.MAX_ATTEMPTS,
    delayMs = RETRY.DELAY_MS,
  } = options ?? {}

  const retryFn = withRetry(fn, {
    maxRetries,
    delayMs,
    onRetry: (_error, attempt) => {
      logger.warning(`${context} 失败,重试 ${attempt}/${maxRetries}`)
    },
  })

  return retryFn()
}
