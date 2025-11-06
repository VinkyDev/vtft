/**
 * 强化符文爬虫 - 优先使用 OP.GG,数据不足时降级到 MetaTFT
 */

import type { Page } from 'playwright'
import type { AugmentLevel, AugmentMeta, CrawlOptions } from 'types'
import {
  AUGMENT_LEVEL_SELECTORS,
  DATA_QUALITY,
  SELECTORS,
  URLS,
} from '../constants'
import { extractAugmentsByLevel } from '../extractors/augment'
import { BaseCrawler } from '../lib/BaseCrawler'
import { safeClick, waitForElement } from '../lib/dom'
import { createCrawlerLogger, navigateToUrl, setLocalStorage, withErrorHandler } from '../lib/helpers'
import { crawlOpggAugments } from './AugmentOpggCrawler'

const logger = createCrawlerLogger('AugmentCrawler')

/**
 * 强化符文爬虫 - 带 OP.GG 降级策略
 */
export class AugmentCrawler extends BaseCrawler<AugmentMeta[]> {
  constructor(options: CrawlOptions = {}) {
    super(logger, options)
  }

  async crawl(): Promise<AugmentMeta[]> {
    try {
      this.logger.info('优先尝试使用 OP.GG 爬取强化符文数据')

      try {
        const opggData = await crawlOpggAugments(this.options)

        if (opggData.length > DATA_QUALITY.MIN_AUGMENT_COUNT_OPGG) {
          this.logger.info(`OP.GG 爬取成功,共获得 ${opggData.length} 个强化符文`)

          if (this.options.debug) {
            await this.saveResults(opggData, 'augments-opgg')
          }

          return opggData
        }
        else {
          this.logger.warning(
            `OP.GG 爬取到 ${opggData.length} 个强化符文,数量不足 (< ${DATA_QUALITY.MIN_AUGMENT_COUNT_OPGG}),降级到 MetaTFT`,
          )
        }
      }
      catch (error) {
        this.logger.error({ message: 'OP.GG 爬取失败,降级到 MetaTFT', error: error as Error })
      }

      this.logger.info('使用 MetaTFT 爬取强化符文数据')
      return await this.crawlFromMetaTFT()
    }
    catch (error) {
      this.logger.error({ message: '强化符文爬取完全失败', error: error as Error })
      throw error
    }
  }

  private async crawlFromMetaTFT(): Promise<AugmentMeta[]> {
    try {
      const { page, helper } = await this.initBrowser()

      await navigateToUrl(page, URLS.METATFT.HOME, this.logger)
      await setLocalStorage(
        page,
        {
          language: 'zh_cn',
          i18nextLng: 'zh_cn',
          TierListTableView2: 'true',
        },
        this.logger,
      )

      await navigateToUrl(page, URLS.METATFT.AUGMENTS, this.logger)

      await waitForElement(page, SELECTORS.AUGMENT.TABLE_ROW)
      this.logger.info('页面内容已加载')

      const allAugments: AugmentMeta[] = []

      for (const { level, selector } of AUGMENT_LEVEL_SELECTORS) {
        this.logger.info(`准备爬取 ${level} 级别强化符文`)

        await this.resetFilterState(page)
        await this.clickLevelFilter(page, selector, level)

        await waitForElement(page, SELECTORS.AUGMENT.TABLE_ROW)

        const augments = await withErrorHandler(
          () => extractAugmentsByLevel(page, level),
          `提取${level}级别强化符文`,
          this.logger,
        )

        allAugments.push(...augments)

        await this.saveDebugInfo(helper, `augments-${level.toLowerCase()}`)
      }

      await this.saveResults(allAugments, 'augments-metatft')

      this.logger.info(`MetaTFT 强化符文爬取完成,共 ${allAugments.length} 个`)
      return allAugments
    }
    finally {
      await this.cleanup()
    }
  }

  private async resetFilterState(page: Page): Promise<void> {
    for (const { selector } of AUGMENT_LEVEL_SELECTORS) {
      const button = page.locator(selector).first()
      const isSelected = await button.evaluate((el) => {
        const parent = el.closest(SELECTORS.AUGMENT.LEVEL_CONTAINER)
        return parent?.classList.contains('selected') ?? false
      })

      if (isSelected) {
        await safeClick(button)
        await waitForElement(page, SELECTORS.AUGMENT.TABLE_ROW)
      }
    }

    this.logger.info('已重置所有筛选状态')
  }

  private async clickLevelFilter(
    page: Page,
    selector: string,
    level: AugmentLevel,
  ): Promise<void> {
    const targetButton = page.locator(selector).first()
    await safeClick(targetButton)
    this.logger.info(`已点击 ${level} 筛选按钮`)
  }
}

/**
 * 便捷函数
 */
export async function crawlAugments(options?: CrawlOptions): Promise<AugmentMeta[]> {
  const crawler = new AugmentCrawler(options)
  return crawler.crawl()
}
