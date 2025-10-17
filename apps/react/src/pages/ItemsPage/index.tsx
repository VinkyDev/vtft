import type { ItemCategory, ItemMeta } from 'types'
import type { SortField, SortOrder } from './components'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { queryItems } from '../../api'
import { ItemCard, ItemFilter } from './components'

/**
 * 装备页面
 */
export function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<ItemCategory>('core')
  const [sortField, setSortField] = useState<SortField>('matches')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const { data, loading } = useRequest(
    async () => {
      return await queryItems()
    },
  )

  // 搜索、筛选和排序装备
  const filteredItems = useMemo<ItemMeta[]>(() => {
    if (!data?.data)
      return []

    let items = data.data

    // 按类型筛选
    if (category !== 'all') {
      items = items.filter(item => item.category === category)
    }

    // 按名称搜索（模糊匹配）
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      items = items.filter(item => item.name.toLowerCase().includes(query))
    }

    // 排序
    const sortedItems = [...items].sort((a, b) => {
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
  }, [data, category, searchQuery, sortField, sortOrder])

  return (
    <div className="flex h-[calc(100vh-68px)] flex-col gap-1.5">
      {/* 过滤器 */}
      <div className="px-2">
        <ItemFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          category={category}
          onCategoryChange={setCategory}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      </div>

      {/* 装备列表 */}
      <ScrollArea className="h-[calc(100vh-120px)]" type="scroll">
        <div className="flex flex-col gap-1.5 px-2 pb-2">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">加载中...</p>
            </div>
          )}
          {!loading && filteredItems.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-400 text-lg">
                {searchQuery ? '未找到匹配的装备' : '暂无装备数据'}
              </p>
            </div>
          )}
          {!loading && filteredItems.map(item => (
            <ItemCard key={`${item.rank}-${item.name}`} item={item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
