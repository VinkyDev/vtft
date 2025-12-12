import type { FilterGroup } from '@/components'
import type { ItemCategory } from '@/utils/items'
import { useMount } from 'ahooks'
import { getItems } from 'api-client'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import { ScrollArea } from 'ui/components'
import { DataSkeleton, EmptyState, FilterBar } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { compositeSortItems } from '@/utils/compositeSort'
import { getItemCategory } from '@/utils/items'
import { ItemCard } from './components'

type SortField = 'composite' | 'matches' | 'avgPlace'

function ItemsPage() {
  const season = useGlobalStore(s => s.curSeason)
  const { data: items, loading } = useRequest(
    async () => {
      const { data } = await getItems({ season })
      return data
    },
    {
      refreshDeps: [season],
      ready: Boolean(season),
      cacheKey: `items:${season}`,
      staleTime: 60_000,
    },
  )

  const loadUnitItems = useGlobalStore(s => s.loadUnitItems)
  useMount(loadUnitItems)

  const itemsById = useGlobalStore(s => s.lookupsIndex.itemsById)
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('composite')

  const filteredItems = useMemo(() => {
    if (!items)
      return []
    return items.filter((i) => {
      const itemCategory = getItemCategory(i.itemName, itemsById) ?? 'other'
      return itemCategory === category
    })
  }, [items, category, itemsById])

  const sortedItems = useMemo(() => {
    if (!filteredItems)
      return []
    if (sortField === 'composite') {
      return compositeSortItems(filteredItems).map(({ compositeScore, ...rest }) => rest)
    }
    if (sortField === 'matches') {
      return [...filteredItems].sort((a, b) => (b.pickRate ?? 0) - (a.pickRate ?? 0))
    }
    return [...filteredItems].sort((a, b) => (a.avg ?? Number.POSITIVE_INFINITY) - (b.avg ?? Number.POSITIVE_INFINITY))
  }, [filteredItems, sortField])

  const filterGroups: FilterGroup[] = [
    {
      value: category,
      options: [
        { value: 'core', label: '核心' },
        { value: 'radiant', label: '光明' },
        { value: 'artifact', label: '神器' },
        { value: 'emblem', label: '转职' },
        { value: 'other', label: '其他' },
      ],
      onChange: (value) => {
        setCategory(value as ItemCategory)
      },
    },
    {
      value: sortField,
      options: [
        { value: 'composite', label: '综合' },
        { value: 'matches', label: '场次' },
        { value: 'avgPlace', label: '影响' },
      ],
      onChange: (value) => {
        setSortField(value as SortField)
      },
    },
  ]

  return (
    <div className="flex flex-col gap-1.5 px-2">
      <FilterBar groups={filterGroups} />
      <ScrollArea className="h-[calc(100vh-110px)] sm:h-[calc(100vh-120px)]" type="scroll">
        <div className="pb-2">
          <DataSkeleton
            loading={loading}
            isEmpty={sortedItems.length === 0}
            empty={<EmptyState message="暂无装备数据" />}
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              }}
            >
              {sortedItems.map(item => (
                <ItemCard key={item.itemName} item={item} />
              ))}
            </div>
          </DataSkeleton>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ItemsPage
