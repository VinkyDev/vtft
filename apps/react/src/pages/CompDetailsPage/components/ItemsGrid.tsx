import type { ItemCategory, RecommendedItem } from 'types'
import type { FilterGroup } from '@/components'
import { memo, useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { Champion, EmptyState, FilterBar } from '@/components'
import { useGameDataStore } from '@/store/dataStore'
import { rankItems } from '@/utils/ranking'
import { ItemCard } from './ItemCard'

interface ItemsGridProps {
  items: RecommendedItem[]
}

type SortField = 'composite' | 'game' | 'avgRank'

/**
 * 装备列表组件
 * 以单列形式展示多个装备（一行一个）
 */
export const ItemsGrid = memo(({ items }: ItemsGridProps) => {
  const { champions, items: allItems } = useGameDataStore()
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('composite')
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null)

  // 处理英雄点击
  const handleChampionClick = (championName: string) => {
    setSelectedChampion(prev => prev === championName ? null : championName)
  }

  // 过滤掉没有有效推荐英雄的装备
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 检查是否有推荐英雄
      if (!item.recommendedFor || item.recommendedFor.length === 0) {
        return false
      }

      // 检查推荐英雄中是否至少有一个存在于 champions store 中
      const hasValidChampion = item.recommendedFor.some(championName =>
        champions.some(champ => champ.name === championName),
      )

      if (!hasValidChampion) {
        return false
      }

      // 按选中的英雄筛选：只保留该英雄在前两个推荐位置的装备
      if (selectedChampion) {
        const championIndex = item.recommendedFor.indexOf(selectedChampion)
        if (championIndex === -1 || championIndex >= 2) {
          return false
        }
      }

      // 按类型筛选
      if (category !== 'all') {
        // 通过名称从 allItems 中查找完整的装备信息
        const fullItem = allItems.find(i => i.name === item.name)
        if (!fullItem || fullItem.category !== category) {
          return false
        }
      }

      return true
    })
  }, [items, champions, allItems, category, selectedChampion])

  // 排序装备列表
  const sortedItems = useMemo(() => {
    let sorted = [...filteredItems]

    // 如果是综合排行,先计算综合得分
    if (sortField === 'composite') {
      // 将 RecommendedItem 转换为 RankedItem 格式
      const rankedItems = rankItems(
        sorted.map(item => ({
          matches: item.matches ?? 0,
          impact: item.avgRank !== undefined ? item.avgRank - 4.5 : 0,
        })),
      )

      // 将综合得分附加回原数据
      sorted = sorted.map((item, index) => ({
        ...item,
        compositeScore: rankedItems[index].compositeScore ?? 0,
      }))

      // 按综合得分降序排序
      sorted.sort((a, b) => {
        const aScore = (a as any).compositeScore ?? 0
        const bScore = (b as any).compositeScore ?? 0
        return bScore - aScore
      })
    }
    else {
      sorted.sort((a, b) => {
        if (sortField === 'game') {
          // 场次降序（多到少）
          const aValue = a.matches ?? 0
          const bValue = b.matches ?? 0
          return bValue - aValue
        }
        else {
          // avgRank 升序（小到大，排名越小越好）
          const aValue = a.avgRank ?? Number.MAX_SAFE_INTEGER
          const bValue = b.avgRank ?? Number.MAX_SAFE_INTEGER
          return aValue - bValue
        }
      })
    }

    return sorted
  }, [filteredItems, sortField])

  // FilterBar 配置
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
          <Champion
            championName={selectedChampion}
            size="tiny"
            showPriority={false}
            showTooltip={true}
            className="w-4! h-4!"
          />
          <span className="text-white text-xs font-medium flex-1">{selectedChampion}</span>
          <button
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
                {sortedItems.map((item, index) => (
                  <ItemCard
                    key={`${item.name}-${index}`}
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
