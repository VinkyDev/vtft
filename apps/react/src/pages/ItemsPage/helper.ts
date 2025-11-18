import type { ItemMeta } from 'types'
import { compositeSortItems } from '@/utils/compositeSort'

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
  // 综合排序
  if (sortField === 'composite') {
    return compositeSortItems(items)
  }

  // 其他字段排序
  const sorted = [...items]
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

  return sorted
}
