/**
 * DOM 操作工具
 */

import type { Locator, Page } from 'playwright'
import { TIMEOUT_FAST_MS, TIMEOUT_STANDARD_MS, WAIT_SHORT_MS } from './timing'

/**
 * 等待元素出现并返回
 */
export async function waitForElement(
  page: Page,
  selector: string,
  options?: {
    timeout?: number
    additionalWait?: number
    state?: 'attached' | 'detached' | 'visible' | 'hidden'
  },
): Promise<Locator> {
  const {
    timeout = TIMEOUT_STANDARD_MS,
    additionalWait = WAIT_SHORT_MS,
    state = 'visible',
  } = options ?? {}

  const locator = page.locator(selector).first()
  await locator.waitFor({ state, timeout })

  if (additionalWait > 0) {
    await sleep(additionalWait)
  }

  return locator
}

/**
 * 等待多个元素出现并返回所有
 */
export async function waitForElements(
  page: Page,
  selector: string,
  options?: {
    timeout?: number
    additionalWait?: number
    minCount?: number
  },
): Promise<Locator[]> {
  const {
    timeout = TIMEOUT_STANDARD_MS,
    additionalWait = WAIT_SHORT_MS,
    minCount = 1,
  } = options ?? {}

  const locator = page.locator(selector)
  await locator.first().waitFor({ state: 'visible', timeout })

  const count = await locator.count()
  if (count < minCount) {
    throw new Error(`期望至少 ${minCount} 个元素,但只找到 ${count} 个`)
  }

  if (additionalWait > 0) {
    await sleep(additionalWait)
  }

  return locator.all()
}

/**
 * 简单延时
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 检查元素是否真正可见
 */
export async function isElementVisible(locator: Locator): Promise<boolean> {
  try {
    const isVisible = await locator.isVisible({ timeout: TIMEOUT_FAST_MS })
    if (!isVisible) {
      return false
    }

    const boundingBox = await locator.boundingBox({ timeout: TIMEOUT_FAST_MS })
    return boundingBox !== null && boundingBox.width > 0 && boundingBox.height > 0
  }
  catch {
    return false
  }
}

/**
 * 安全点击元素
 */
export async function safeClick(
  locator: Locator,
  options?: {
    timeout?: number
    waitAfter?: number
  },
): Promise<void> {
  const { timeout = TIMEOUT_FAST_MS, waitAfter = WAIT_SHORT_MS } = options ?? {}

  await locator.click({ timeout })

  if (waitAfter > 0) {
    await sleep(waitAfter)
  }
}

/**
 * 安全获取文本内容
 */
export async function safeGetText(
  locator: Locator,
  defaultValue: string = '',
): Promise<string> {
  try {
    return (await locator.textContent()) ?? defaultValue
  }
  catch {
    return defaultValue
  }
}

/**
 * 获取指定索引的元素
 */
export async function getElementByIndex(
  locator: Locator,
  index: number,
): Promise<Locator> {
  const count = await locator.count()

  if (index < 0 || index >= count) {
    throw new Error(`索引 ${index} 超出范围,总数: ${count}`)
  }

  return locator.nth(index)
}
