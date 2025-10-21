import type { ItemMeta } from 'types'
import { rankItems } from '@/utils/ranking'

export type SortField = 'composite' | 'matches' | 'avgPlace'

/**
 * 排序装备列表
 *
 * @param items - 装备列表
 * @param sortField - 排序字段
 * @returns 排序后的装备列表
 */
export function sortItems(
  items: ItemMeta[],
  sortField: SortField,
): ItemMeta[] {
  let sorted = [...items]

  // 综合排序
  if (sortField === 'composite') {
    const rankedItems = rankItems(
      sorted.map(item => ({
        matches: item.matches ?? 0,
        impact: item.avgPlace !== undefined ? item.avgPlace - 4.5 : 0,
      })),
    )

    // 将综合得分附加回原数据
    sorted = sorted.map((item, index) => ({
      ...item,
      compositeScore: rankedItems[index].compositeScore ?? 0,
    }))

    // 按综合得分降序排序
    sorted.sort((a, b) => {
      const aScore = (a as any).compositeScore ?? 0
      const bScore = (b as any).compositeScore ?? 0
      return bScore - aScore
    })
  }
  // 其他字段排序
  else {
    const order = sortField === 'avgPlace' ? 'asc' : 'desc'

    sorted.sort((a, b) => {
      let aValue: number
      let bValue: number

      if (sortField === 'matches') {
        aValue = a.matches ?? 0
        bValue = b.matches ?? 0
      }
      else { // avgPlace
        aValue = a.avgPlace ?? 999
        bValue = b.avgPlace ?? 999
      }

      const comparison = aValue - bValue
      return order === 'asc' ? comparison : -comparison
    })
  }

  return sorted
}
