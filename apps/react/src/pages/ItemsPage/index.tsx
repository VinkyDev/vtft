import type { ItemCategory, ItemMeta } from 'types'
import type { SortField, SortOrder } from './components'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { useGameDataStore } from '../../store'
import { ItemCard, ItemFilter } from './components'

/**
 * 装备页面
 */
export function ItemsPage() {
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('matches')

  // 从 store 获取装备数据
  const { items, itemsLoading: loading } = useGameDataStore()

  // 根据排序字段自动确定排序方向
  const sortOrder: SortOrder = sortField === 'avgPlace' ? 'asc' : 'desc'

  // 筛选和排序装备
  const filteredItems = useMemo<ItemMeta[]>(() => {
    if (!items.length)
      return []

    let filteredItemList = items

    // 按类型筛选
    if (category !== 'all') {
      filteredItemList = filteredItemList.filter(item => item.category === category)
    }

    // 排序
    const sortedItems = [...filteredItemList].sort((a, b) => {
      let aValue: number
      let bValue: number

      if (sortField === 'matches') {
        aValue = a.matches ?? 0
        bValue = b.matches ?? 0
      }
      else { // avgPlace
        aValue = a.avgPlace ?? 999
        bValue = b.avgPlace ?? 999
      }

      const comparison = aValue - bValue
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sortedItems
  }, [items, category, sortField, sortOrder])

  return (
    <div className="flex flex-col gap-1.5 px-2">
      <ItemFilter
        category={category}
        onCategoryChange={setCategory}
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
