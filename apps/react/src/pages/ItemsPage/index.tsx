import type { ItemCategory, ItemMeta } from 'types'
import type { SortField } from './helper'
import type { FilterGroup } from '@/components'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { FilterBar } from '@/components'
import { useGameDataStore } from '@/store'
import { ItemCard } from './components'
import { sortItems } from './helper'

/**
 * 装备页面
 */
export function ItemsPage() {
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('composite')

  // 从 store 获取装备数据
  const { items, itemsLoading: loading } = useGameDataStore()

  // 筛选和排序装备
  const filteredItems = useMemo<ItemMeta[]>(() => {
    if (!items.length)
      return []

    // 按类型筛选
    let filtered = items
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category)
    }

    // 排序
    return sortItems(filtered, sortField)
  }, [items, category, sortField])

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
      <ScrollArea className="h-[calc(100vh-110px)]" type="scroll">
        <div className="pb-2">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">加载中...</p>
            </div>
          )}
          {!loading && filteredItems.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">暂无装备数据</p>
            </div>
          )}
          {!loading && filteredItems.length > 0 && (
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
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
