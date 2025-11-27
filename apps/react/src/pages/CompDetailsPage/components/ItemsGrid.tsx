import type { CompItem } from 'types'
import type { FilterGroup } from '@/components'
import type { ItemCategory } from '@/utils/items'
import { memo, useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { Champion, EmptyState, FilterBar } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { compositeSortCompItems } from '@/utils/compositeSort'
import { getItemCategory } from '@/utils/items'
import { ItemCard } from './ItemCard'

interface ItemsGridProps {
  items: CompItem[]
}

/**
 * 装备列表组件
 * 以单列形式展示多个装备（一行一个）
 */
type SortField = 'composite' | 'game' | 'avgRank'

export const ItemsGrid = memo(({ items }: ItemsGridProps) => {
  const { lookupsIndex } = useGlobalStore()
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('composite')
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null)

  const filteredByCategory = useMemo(() => {
    return items.filter(i => getItemCategory(i.itemNames, lookupsIndex.itemsById) === category)
  }, [items, category, lookupsIndex])

  const filteredItems = useMemo(() => {
    if (!selectedChampion)
      return filteredByCategory
    return filteredByCategory.filter(i => (i.units ?? []).slice(0, 2).some(u => u.units === selectedChampion))
  }, [filteredByCategory, selectedChampion])

  const sortedItems = useMemo(() => {
    const arr = [...filteredItems]
    if (sortField === 'game')
      return arr.sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    if (sortField === 'avgRank')
      return arr.sort((a, b) => (a.avg ?? Number.POSITIVE_INFINITY) - (b.avg ?? Number.POSITIVE_INFINITY))
    return compositeSortCompItems(arr).map(({ compositeScore, ...rest }) => rest)
  }, [filteredItems, sortField])

  const handleChampionClick = (championName: string) => {
    setSelectedChampion(championName)
  }

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
        { value: 'game', label: '场次' },
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
      {selectedChampion && (
        <div className="py-1.5 px-2 mx-1 my-1 bg-blue-500/5 rounded-lg border border-blue-500/20 flex items-center gap-2">
          <span className="text-blue-300 text-xs">筛选英雄:</span>
          <Champion id={selectedChampion} showTooltip={true} className="size-4" renderExtra={data => <span className="ml-2 text-white text-xs font-medium flex-1">{data.name}</span>} />
          <button
            type="button"
            onClick={() => setSelectedChampion(null)}
            className="text-gray-400 hover:text-white text-[10px] px-1.5 py-0.5 rounded bg-black/30 hover:bg-blue-500/20 transition-colors border border-white/5 hover:border-blue-500/30"
          >
            ✕
          </button>
        </div>
      )}
      {(!sortedItems || sortedItems.length === 0)
        ? (
            <EmptyState
              message={selectedChampion ? `${selectedChampion} 在当前类型下暂无核心装备推荐` : '暂无装备推荐'}
            />
          )
        : (
            <ScrollArea className="h-[calc(100vh-100px)] sm:h-[calc(100vh-110px)]">
              <div className="flex flex-col gap-1.5 p-1">
                {sortedItems.map(item => (
                  <ItemCard
                    key={`${item.itemNames}`}
                    item={item}
                    onChampionClick={handleChampionClick}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
    </div>
  )
})

ItemsGrid.displayName = 'ItemsGrid'
