import type { ChampionMeta } from 'types'
import type { ChampionCostFilter, ChampionSortField } from './components'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { useGameDataStore } from '@/store'
import { ChampionCard, ChampionFilter } from './components'
import { sortChampions } from './helper'

/**
 * 英雄页面
 */
export function ChampionsPage() {
  const [costFilter, setCostFilter] = useState<ChampionCostFilter>('all')
  const [sortField, setSortField] = useState<ChampionSortField>('composite')

  const { champions, championsLoading: loading } = useGameDataStore()

  const filteredChampions = useMemo<ChampionMeta[]>(() => {
    if (!champions.length)
      return []

    let filtered = champions
    if (costFilter !== 'all') {
      filtered = filtered.filter(champion => champion.cost === Number(costFilter))
    }

    return sortChampions(filtered, sortField)
  }, [champions, costFilter, sortField])

  return (
    <div className="flex flex-col gap-1.5 px-2">
      <ChampionFilter
        costFilter={costFilter}
        onCostFilterChange={setCostFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
      />
      <ScrollArea className="h-[calc(100vh-110px)]" type="scroll">
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
