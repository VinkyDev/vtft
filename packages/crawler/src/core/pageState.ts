import type { Page } from 'playwright'
import { logger } from './logger'
import { TIMEOUT_PAGE_LOAD_MS } from './timing'

const DEFAULT_REFRESH_INTERVAL = 20

/**
 * 通用页面状态管理器
 * 职责: 追踪操作次数,管理页面刷新
 */
export class PageStateManager {
  private operationCount = 0
  private readonly refreshInterval: number

  constructor(
    private page: Page,
    options: { refreshInterval?: number } = {},
  ) {
    this.refreshInterval = options.refreshInterval ?? DEFAULT_REFRESH_INTERVAL
  }

  shouldRefresh(): boolean {
    return this.operationCount >= this.refreshInterval
  }

  async refresh(): Promise<void> {
    logger.info(`已执行 ${this.operationCount} 次操作,刷新页面以重置状态`)
    await this.page.reload({
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT_PAGE_LOAD_MS,
    })
    this.reset()
  }

  reset(): void {
    this.operationCount = 0
  }

  recordOperation(): void {
    this.operationCount++
  }

  getOperationCount(): number {
    return this.operationCount
  }
}
