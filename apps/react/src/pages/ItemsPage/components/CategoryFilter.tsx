import type { ItemCategory } from 'types'
import { ArrowDownAZ, ArrowUpAZ, Search, X } from 'lucide-react'
import { memo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui'

export type SortField = 'matches' | 'avgPlace'
export type SortOrder = 'asc' | 'desc'

interface ItemFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  category: ItemCategory
  onCategoryChange: (category: ItemCategory) => void
  sortField: SortField
  onSortFieldChange: (field: SortField) => void
  sortOrder: SortOrder
  onSortOrderChange: (order: SortOrder) => void
}

const categories: { value: ItemCategory, label: string }[] = [
  { value: 'core', label: '核心' },
  { value: 'radiant', label: '光明' },
  { value: 'artifact', label: '神器' },
  { value: 'emblem', label: '转职' },
  { value: 'component', label: '基础' },
]

const sortFields: { value: SortField, label: string }[] = [
  { value: 'matches', label: '场次' },
  { value: 'avgPlace', label: '平均' },
]

/**
 * 装备过滤器组件
 * 支持搜索、类型筛选和排序
 */
export const ItemFilter = memo(({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
}: ItemFilterProps) => {
  return (
    <div className="flex items-center gap-1.5">
      {/* 搜索框 */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="搜索..."
          className="w-full rounded-md border border-white/10 bg-white/5 py-1.5 pl-8 pr-7 text-xs text-white placeholder:text-gray-500 transition-all focus:border-blue-500/50 focus:bg-white/10 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-300"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* 装备类型选择器 */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-[30px] w-[90px] border-white/10 bg-white/5 text-xs text-white hover:border-white/20 hover:bg-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 排序字段选择器 */}
      <Select value={sortField} onValueChange={onSortFieldChange}>
        <SelectTrigger className="h-[30px] w-[75px] border-white/10 bg-white/5 text-xs text-white hover:border-white/20 hover:bg-white/10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortFields.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 排序方向按钮 */}
      <button
        type="button"
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="flex size-[30px] shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
        title={sortOrder === 'asc' ? '升序' : '降序'}
      >
        {sortOrder === 'asc'
          ? (
              <ArrowUpAZ className="size-3.5" />
            )
          : (
              <ArrowDownAZ className="size-3.5" />
            )}
      </button>
    </div>
  )
})

ItemFilter.displayName = 'ItemFilter'
