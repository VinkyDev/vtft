import type { Locator, Page } from 'playwright'

/**
 * 提取器基类
 * 封装通用的DOM查询和验证逻辑
 */
export abstract class BaseExtractor<T> {
  constructor(protected page: Page) {}

  /**
   * 获取所有匹配的元素
   */
  protected async getAll(selector: string): Promise<Locator[]> {
    return this.page.locator(selector).all()
  }

  /**
   * 获取指定索引的元素
   */
  protected async getByIndex(selector: string, index: number): Promise<Locator> {
    const items = await this.getAll(selector)
    if (index >= items.length) {
      throw new Error(`索引 ${index} 超出范围 (总数: ${items.length})`)
    }
    return items[index]
  }

  /**
   * 检查元素是否真实可见
   */
  protected async isReallyVisible(locator: Locator): Promise<boolean> {
    const count = await locator.count()
    if (count === 0) {
      return false
    }

    const isVisible = await locator.isVisible().catch(() => false)
    if (!isVisible) {
      return false
    }

    const box = await locator.boundingBox().catch(() => null)
    return box !== null && box.height > 0
  }

  /**
   * 等待一段时间
   */
  protected async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 子类实现: 提取数据
   */
  abstract extract(index: number): Promise<T>
}
