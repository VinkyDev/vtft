import type { Locator } from 'playwright'
import type { Augment } from 'types'
import { Logger } from 'logger'

const logger = new Logger({ namespace: 'crawler', scope: 'extractor/compAugment', withTime: true })

/**
 * 从展开的阵容中提取推荐强化符文
 */
export async function extractRecommendedAugments(
  compLocator: Locator,
): Promise<Augment[]> {
  const augments: Augment[] = []

  try {
    // 从表格中提取强化符文数据
    const augmentTables = await compLocator.locator('table').all()

    for (const table of augmentTables) {
      try {
        const caption = await table.locator('caption').textContent().catch(() => '')

        if (caption && (caption.includes('强化') || caption.includes('符文'))) {
          await table.locator('tbody tr').first().waitFor({ timeout: 5000 }).catch(() => {})
          const rows = await table.locator('tbody tr').all()

          for (const row of rows) {
            try {
              // 提取所有 td 单元格
              const cells = await row.locator('td').all()

              // 遍历每个单元格，查找强化符文
              for (const cell of cells) {
                try {
                  // 在单元格内查找强化符文图标
                  // 根据 HTML 结构：img 的 src 包含 'tft-augment'，alt 是符文名称
                  const augmentImg = cell.locator('img[alt][src*="tft-augment"]').first()

                  if (await augmentImg.count() === 0) {
                    continue
                  }

                  const name = await augmentImg.getAttribute('alt').catch(() => '')
                  const icon = await augmentImg.getAttribute('src').catch(() => '')

                  if (!name || !icon) {
                    continue
                  }

                  // 检查是否已经添加过这个符文（避免重复）
                  if (augments.some(aug => aug.name === name)) {
                    continue
                  }

                  augments.push({
                    name,
                    icon,
                  })
                }
                catch (error) {
                  logger.warning({ message: '提取单元格中的强化符文失败', error: error as Error })
                }
              }
            }
            catch (error) {
              logger.warning({ message: '提取强化符文行失败', error: error as Error })
            }
          }
        }
      }
      catch (error) {
        logger.error({ message: '处理强化符文表格失败', error: error as Error })
      }
    }

    logger.info(`提取到 ${augments.length} 个推荐强化符文`)
  }
  catch (error) {
    logger.error({ message: '提取推荐强化符文列表失败', error: error as Error })
  }

  return augments
}
