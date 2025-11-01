import type { ItemCategory, ItemMeta } from 'types'
import type { SortField } from './helper'
import type { FilterGroup } from '@/components'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { DataSkeleton, EmptyState, FilterBar } from '@/components'
import { useGameDataStore } from '@/store'
import { ItemCard } from './components'
import { sortItems } from './helper'

function ItemsPage() {
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('composite')

  const { items, itemsLoading: loading } = useGameDataStore()

  const filteredItems = useMemo<ItemMeta[]>(() => {
    if (!items.length)
      return []

    let filtered = items
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category)
    }

    return sortItems(filtered, sortField)
  }, [items, category, sortField])

  const filterGroups: FilterGroup[] = [
    {
      value: category,
      options: [
        { value: 'core', label: '核心' },
        { value: 'radiant', label: '光明' },
        { value: 'artifact', label: '神器' },
        { value: 'emblem', label: '转职' },
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
      <ScrollArea className="h-[calc(100vh-120px)]" type="scroll">
        <div className="pb-2">
          <DataSkeleton
            loading={loading}
            isEmpty={filteredItems.length === 0}
            empty={<EmptyState message="暂无装备数据" />}
          >
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              }}
            >
              {filteredItems.map(item => (
                <ItemCard key={`${item.rank}-${item.name}`} item={item} />
              ))}
            </div>
          </DataSkeleton>
        </div>
      </ScrollArea>
    </div>
  )
}

export default ItemsPage
