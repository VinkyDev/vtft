import type { ChampionMeta } from 'types'
import type { ChampionCostFilter, ChampionSortField } from './components'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { DataSkeleton, EmptyState } from '@/components'
import { useGameDataStore } from '@/store'
import { ChampionCard, ChampionFilter } from './components'
import { sortChampions } from './helper'

function ChampionsPage() {
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
      <ScrollArea className="h-[calc(100vh-110px)] sm:h-[calc(100vh-120px)]" type="scroll">
        <div className="pb-2">
          <DataSkeleton
            loading={loading}
            isEmpty={filteredChampions.length === 0}
            empty={<EmptyState message="暂无英雄数据" />}
          >
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
          </DataSkeleton>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ChampionsPage
