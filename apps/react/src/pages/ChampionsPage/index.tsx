import type { ChampionCostFilter, ChampionSortField } from './components'
import { useMount } from 'ahooks'
import { getUnits } from 'api-client'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import { ScrollArea } from 'ui'
import { DataSkeleton, EmptyState } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { ChampionFilter, UnitCard } from './components'
import { sortChampions } from './helper'

function ChampionsPage() {
  const [costFilter, setCostFilter] = useState<ChampionCostFilter>('all')
  const [sortField, setSortField] = useState<ChampionSortField>('composite')
  const { loadUnitItems } = useGlobalStore()
  useMount(loadUnitItems)
  const season = useGlobalStore(s => s.curSeason)
  const { data: units, loading } = useRequest(
    async () => {
      const { data } = await getUnits({ season })
      return data
    },
    {
      cacheKey: `units:${season}`,
      staleTime: 60_000,
      refreshDeps: [season],
      ready: Boolean(season),
    },
  )

  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const filteredChampions = useMemo(() => {
    if (!units?.length)
      return []

    let filtered = units
    if (costFilter !== 'all') {
      const targetCost = Number(costFilter)
      filtered = filtered.filter(unit => (unitsById[unit.unit]?.cost ?? -1) === targetCost)
    }

    return sortChampions(filtered, sortField)
  }, [units, costFilter, sortField, unitsById])

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
              {filteredChampions.map(unit => (
                <UnitCard key={unit.unit} unit={unit} />
              ))}
            </div>
          </DataSkeleton>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ChampionsPage
