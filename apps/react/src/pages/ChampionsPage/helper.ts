import type { ChampionMeta } from 'types'
import type { ChampionSortField } from './components'
import { compositeSortChampions } from '@/utils/compositeSort'

/**
 * 排序英雄列表
 *
 * @param champions - 英雄列表
 * @param sortField - 排序字段
 * @returns 排序后的英雄列表
 */
export function sortChampions(
  champions: ChampionMeta[],
  sortField: ChampionSortField,
): ChampionMeta[] {
  // 综合排序
  if (sortField === 'composite') {
    return compositeSortChampions(champions)
  }

  // 其他字段排序
  const sorted = [...champions]
  sorted.sort((a, b) => {
    let aValue: number
    let bValue: number

    switch (sortField) {
      case 'matches':
        aValue = a.matches ?? 0
        bValue = b.matches ?? 0
        break
      case 'avgPlace':
        aValue = a.avgPlace ?? 999
        bValue = b.avgPlace ?? 999
        break
      case 'top4Rate':
        aValue = a.top4Rate ?? 0
        bValue = b.top4Rate ?? 0
        break
      case 'firstPlaceRate':
        aValue = a.firstPlaceRate ?? 0
        bValue = b.firstPlaceRate ?? 0
        break
      default:
        aValue = a.matches ?? 0
        bValue = b.matches ?? 0
    }

    const comparison = aValue - bValue
    // avgPlace 升序（小排名更好），其他降序（大数值更好）
    return sortField === 'avgPlace' ? comparison : -comparison
  })

  return sorted
}
