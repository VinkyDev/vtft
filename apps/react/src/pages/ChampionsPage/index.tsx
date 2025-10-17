import type { ChampionMeta } from 'types'
import type { ChampionCostFilter, ChampionSortField } from './components'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { useGameDataStore } from '../../store'
import { ChampionCard, ChampionFilter } from './components'

/**
 * 英雄页面
 */
export function ChampionsPage() {
  const [costFilter, setCostFilter] = useState<ChampionCostFilter>('all')
  const [sortField, setSortField] = useState<ChampionSortField>('matches')

  // 从 store 获取英雄数据
  const { champions, championsLoading: loading } = useGameDataStore()

  // 筛选和排序英雄
  const filteredChampions = useMemo<ChampionMeta[]>(() => {
    if (!champions.length)
      return []

    let filteredChampionList = champions

    // 按费用筛选
    if (costFilter !== 'all') {
      filteredChampionList = filteredChampionList.filter(champion => champion.cost === costFilter)
    }

    // 排序
    const sortedChampions = [...filteredChampionList].sort((a, b) => {
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
      // 平均排名升序，其他降序
      return sortField === 'avgPlace' ? comparison : -comparison
    })

    return sortedChampions
  }, [champions, costFilter, sortField])

  return (
    <div className="flex flex-col gap-1.5 px-2">
      <ChampionFilter
        costFilter={costFilter}
        onCostFilterChange={setCostFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
      />
      <ScrollArea className="h-[calc(100vh-120px)]" type="scroll">
        <div className="pb-2">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">加载中...</p>
            </div>
          )}
          {!loading && filteredChampions.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">暂无英雄数据</p>
            </div>
          )}
          {!loading && filteredChampions.length > 0 && (
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              }}
            >
              {filteredChampions.map(champion => (
                <ChampionCard key={`${champion.rank}-${champion.name}`} champion={champion} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
