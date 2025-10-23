import type { Locator, Page } from 'playwright'
import type { AugmentLevel, AugmentMeta } from 'types'
import { sleep } from 'utils'
import { logger } from '../core/logger'
import {
  EXTRACTOR_SELECTORS,
  TIER_ICON_MAP,
} from './augmentOpgg.constants'

/**
 * 从强化符文容器提取数据
 */
async function extractAugmentFromContainer(container: Locator, level: AugmentLevel): Promise<AugmentMeta[]> {
  const augments: AugmentMeta[] = []

  try {
    // 提取梯度等级
    let tier = 'Unknown'

    const tierIcon = container.locator(EXTRACTOR_SELECTORS.TIER_ICON).first()
    if (await tierIcon.count() > 0) {
      const src = await tierIcon.getAttribute('src')
      if (src) {
        for (const [iconName, tierValue] of Object.entries(TIER_ICON_MAP)) {
          if (src.includes(iconName)) {
            tier = tierValue
            break
          }
        }
      }
    }

    // 提取强化符文列表
    const augmentItems = await container.locator(EXTRACTOR_SELECTORS.AUGMENT_ITEM).all()

    for (const item of augmentItems) {
      try {
        // 提取强化符文图标
        const iconImg = item.locator(EXTRACTOR_SELECTORS.AUGMENT_ICON).first()
        const icon = await iconImg.getAttribute('src').catch(() => '')

        if (!icon)
          continue

        // 提取强化符文名称
        const nameSpan = item.locator(EXTRACTOR_SELECTORS.AUGMENT_NAME).first()
        const name = await nameSpan.textContent()

        if (!name?.trim())
          continue

        // 创建强化符文数据
        const augment: AugmentMeta = {
          name: name.trim(),
          icon: icon.startsWith('http') ? icon : `https://op.gg${icon}`,
          level,
          tier,
        }

        augments.push(augment)
        logger.info(`提取到强化符文: ${augment.name} (${level} - ${tier})`)
      }
      catch (error) {
        logger.error('提取单个强化符文失败:', error)
      }
    }
  }
  catch (error) {
    logger.error('提取强化符文容器失败:', error)
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
    logger.info(`找到 ${containers.length} 个强化符文容器`)

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
    logger.error(`提取 ${level} 强化符文失败:`, error)
    return []
  }
}
