import type { Locator, Page } from 'playwright'
import type { AugmentLevel, AugmentMeta } from 'types'
import { Logger } from 'logger'
import { SELECTORS } from '@/constants'
import { sleep } from '@/lib/dom'

const EXTRACTOR_SELECTORS = {
  TIER_ICON: 'img[alt*="OP"], img[alt*="S"], img[alt*="A"], img[alt*="B"], img[alt*="C"], img[alt*="D"]',
  AUGMENT_ITEM: 'div.flex.flex-col.items-center.gap-\\[4px\\]',
  AUGMENT_ICON: 'img[alt*="Augment"]',
  AUGMENT_NAME: 'span',
  AUGMENT_CONTAINER: SELECTORS.AUGMENT.OPGG_CONTAINER,
}

const TIER_LEVELS = ['OP', 'S', 'A', 'B', 'C', 'D'] as const

const logger = new Logger({ namespace: 'crawler', scope: 'xtr/augmentOpgg' })

/**
 * 从强化符文容器提取数据
 */
async function extractAugmentFromContainer(container: Locator, level: AugmentLevel): Promise<AugmentMeta[]> {
  const augments: AugmentMeta[] = []

  try {
    // 提取梯度等级
    const tierIcon = container.locator(EXTRACTOR_SELECTORS.TIER_ICON).first()
    const alt = (await tierIcon.getAttribute('alt').catch(() => '')) || ''
    const tier = TIER_LEVELS.find(t => alt.includes(t)) || 'Unknown'

    // 提取强化符文列表
    const augmentItems = await container.locator(EXTRACTOR_SELECTORS.AUGMENT_ITEM).all()

    const extractPromises = augmentItems.map(async (item) => {
      try {
        const iconImg = item.locator(EXTRACTOR_SELECTORS.AUGMENT_ICON).first()
        const nameSpan = item.locator(EXTRACTOR_SELECTORS.AUGMENT_NAME).first()

        const [icon, name] = await Promise.all([
          iconImg.getAttribute('src').catch(() => ''),
          nameSpan.textContent().catch(() => ''),
        ])

        if (!icon || !name?.trim())
          return null

        // 创建强化符文数据
        return {
          name: name.trim(),
          icon,
          level,
          tier,
        } as AugmentMeta
      }
      catch (error) {
        logger.error('提取单个强化符文失败', error as Error)
        return null
      }
    })

    const results = await Promise.all(extractPromises)
    const validAugments = results.filter((augment): augment is AugmentMeta => augment !== null)
    augments.push(...validAugments)
  }
  catch (error) {
    logger.error('提取强化符文容器失败', error as Error)
  }

  return augments
}

/**
 * 从页面提取指定级别的所有强化符文数据
 */
export async function extractOpggAugmentsByLevel(page: Page, level: AugmentLevel): Promise<AugmentMeta[]> {
  const augments: AugmentMeta[] = []

  try {
    await sleep(1000)

    // 查找所有强化符文容器
    const containers = await page.locator(EXTRACTOR_SELECTORS.AUGMENT_CONTAINER).all()

    for (const container of containers) {
      const containerAugments = await extractAugmentFromContainer(container, level)
      augments.push(...containerAugments)
    }

    // 去重（基于名称）
    const uniqueAugments = augments.filter((augment, index, self) =>
      index === self.findIndex(a => a.name === augment.name),
    )

    logger.info(`${level} 强化符文提取完成，共 ${uniqueAugments.length} 个`)
    return uniqueAugments
  }
  catch (error) {
    logger.error({ message: `提取 ${level} 强化符文失败`, error: error as Error })
    return []
  }
}
