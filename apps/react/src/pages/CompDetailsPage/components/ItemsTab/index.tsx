import type { CompItem } from 'types'
import type { FilterGroup } from '@/components'
import type { ItemCategory } from '@/utils/items'
import { memo, useMemo, useState } from 'react'
import { VList } from 'virtua'
import { EmptyState, FilterBar } from '@/components'
import { useMediaQuery } from '@/hooks'
import { useGlobalStore } from '@/store/globalStore'
import { compositeSortCompItems } from '@/utils/compositeSort'
import { getItemCategory } from '@/utils/items'
import { ItemCard } from './ItemCard'

export interface ItemsTabProps {
  items: CompItem[]
}

type SortField = 'composite' | 'game' | 'avgRank'

export const ItemsTab = memo(({ items }: ItemsTabProps) => {
  const itemsById = useGlobalStore(s => s.lookupsIndex.itemsById)
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('composite')
  const isSmUp = useMediaQuery('(min-width: 640px)', true)
  const effectiveCategory = useMemo(
    () => (!isSmUp && category === 'other' ? 'core' : category),
    [isSmUp, category],
  )

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const itemCategory = getItemCategory(i.itemNames, itemsById) ?? 'other'
      return itemCategory === effectiveCategory
    })
  }, [items, effectiveCategory, itemsById])

  const sortedItems = useMemo(() => {
    const arr = [...filteredItems]
    if (sortField === 'game')
      return arr.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    if (sortField === 'avgRank')
      return arr.sort((a, b) => (a.avg ?? Number.POSITIVE_INFINITY) - (b.avg ?? Number.POSITIVE_INFINITY))
    return compositeSortCompItems(arr).map(({ compositeScore, ...rest }) => rest)
  }, [filteredItems, sortField])

  const categoryOptions = useMemo(() => {
    const base = [
      { value: 'core', label: '核心' },
      { value: 'radiant', label: '光明' },
      { value: 'artifact', label: '神器' },
      { value: 'emblem', label: '转职' },
      { value: 'other', label: '其他' },
    ]
    if (isSmUp)
      return base
    return base.filter(opt => opt.value !== 'other')
  }, [isSmUp])

  const filterGroups: FilterGroup[] = [
    {
      value: effectiveCategory,
      options: categoryOptions,
      onChange: (value) => {
        setCategory(value as ItemCategory)
      },
    },
    {
      value: sortField,
      options: [
        { value: 'composite', label: '综合' },
        { value: 'game', label: '登场' },
        { value: 'avgRank', label: '影响' },
      ],
      onChange: (value) => {
        setSortField(value as SortField)
      },
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <FilterBar className="mx-1" groups={filterGroups} />
      {(!sortedItems || sortedItems.length === 0)
        ? (
            <EmptyState message="暂无装备推荐" />
          )
        : (
            <VList className="virtual-scrollbar min-h-0 flex-1 px-1">
              {sortedItems.map(item => (
                <div key={item.itemNames} className="pb-1.5">
                  <ItemCard item={item} />
                </div>
              ))}
            </VList>
          )}
    </div>
  )
})

ItemsTab.displayName = 'ItemsTab'
