import type { ChampionMeta } from 'types'
import type { ChampionSortField } from './components'
import { rankItems } from '@/utils/ranking'

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
  let sorted = [...champions]

  // 综合排序
  if (sortField === 'composite') {
    const rankedChampions = rankItems(
      sorted.map(champion => ({
        matches: champion.matches ?? 0,
        impact: champion.avgPlace !== undefined ? champion.avgPlace - 4.5 : 0,
      })),
    )

    // 将综合得分附加回原数据
    sorted = sorted.map((champion, index) => ({
      ...champion,
      compositeScore: rankedChampions[index].compositeScore ?? 0,
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
  }

  return sorted
}
