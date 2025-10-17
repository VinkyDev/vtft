import type { Locator, Page } from 'playwright'
import type { AugmentLevel, AugmentMeta } from 'types'
import { logger } from '../core/logger'

/** OP.GG 等级图标映射 */
const TIER_ICON_MAP: Record<string, string> = {
  'icon-tier-OP.png': 'OP',
  'icon-tier-S.png': 'S',
  'icon-tier-A.png': 'A',
  'icon-tier-B.png': 'B',
  'icon-tier-C.png': 'C',
}

/**
 * 从强化符文容器提取数据
 */
async function extractAugmentFromContainer(container: Locator, level: AugmentLevel): Promise<AugmentMeta[]> {
  const augments: AugmentMeta[] = []

  try {
    // 提取梯度等级
    let tier = 'Unknown'

    const tierIcon = container.locator('img[src*="icon-tier-"]').first()
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
    const augmentItems = await container.locator('div[class*="flex h-[64px] w-[60px] flex-col items-center gap-[4px]"]').all()

    for (const item of augmentItems) {
      try {
        // 提取强化符文图标
        const iconImg = item.locator('img').first()
        const icon = await iconImg.getAttribute('src').catch(() => '')

        if (!icon)
          continue

        // 提取强化符文名称
        const nameSpan = item.locator('span').first()
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
    // 等待页面内容加载
    await page.waitForTimeout(2000)

    // 查找所有强化符文容器
    // 根据HTML结构，每个等级分组都有一个包含强化符文的容器
    const containers = await page.locator('div.flex.flex-col.md\\:min-h-\\[86px\\].md\\:flex-row').all()
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

/**
 * 根据 OP.GG 页面状态推断当前的强化符文级别
 */
export async function detectCurrentAugmentLevel(page: Page): Promise<AugmentLevel> {
  try {
    // 检查当前选中的标签
    const selectedTab = page.locator('div.hidden.md\\:flex div[class*="bronze-500"]').first()
    const tabText = await selectedTab.textContent()

    if (tabText?.includes('白银'))
      return 'Silver'
    if (tabText?.includes('金币'))
      return 'Gold'
    if (tabText?.includes('稜鏡'))
      return 'Prismatic'

    // 默认返回 Silver
    return 'Silver'
  }
  catch (error) {
    logger.error('检测当前强化符文级别失败:', error)
    return 'Silver'
  }
}
