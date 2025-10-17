import { memo } from 'react'
import { Tabs, TabsList, TabsTrigger } from 'ui'

export type ChampionCostFilter = 'all' | 1 | 2 | 3 | 4 | 5
export type ChampionSortField = 'matches' | 'avgPlace' | 'top4Rate' | 'firstPlaceRate'
export type SortOrder = 'asc' | 'desc'

interface ChampionFilterProps {
  costFilter: ChampionCostFilter
  onCostFilterChange: (cost: ChampionCostFilter) => void
  sortField: ChampionSortField
  onSortFieldChange: (field: ChampionSortField) => void
}

const costOptions: { value: ChampionCostFilter, label: string }[] = [
  { value: 1, label: '1费' },
  { value: 2, label: '2费' },
  { value: 3, label: '3费' },
  { value: 4, label: '4费' },
  { value: 5, label: '5费' },
]

const sortFields: { value: ChampionSortField, label: string }[] = [
  { value: 'matches', label: '场次' },
  { value: 'avgPlace', label: '排名' },
]

/**
 * 英雄过滤器组件
 * 支持费用筛选和排序，排序方向固定（平均排名升序，其他降序）
 */
export const ChampionFilter = memo(({
  costFilter,
  onCostFilterChange,
  sortField,
  onSortFieldChange,
}: ChampionFilterProps) => {
  return (
    <div className="py-2 px-2 mb-1 bg-white/5 rounded-lg border border-white/10">
      <div className="flex justify-between items-center">
        <Tabs
          value={costFilter.toString()}
          onValueChange={value => onCostFilterChange(value === 'all' ? 'all' : Number(value) as ChampionCostFilter)}
        >
          <TabsList className="h-6 bg-black/20 border-white/5 p-0.5">
            {costOptions.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value.toString()}
                className="h-5 px-2 text-[10px] font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=inactive]:text-gray-500"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs
          value={sortField}
          onValueChange={value => onSortFieldChange(value as ChampionSortField)}
        >
          <TabsList className="h-6 bg-black/20 border-white/5 p-0.5">
            {sortFields.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="h-5 px-3 text-[10px] font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=inactive]:text-gray-500"
              >
                {label}
                <span className="ml-1 text-[8px] opacity-60">
                  {value === 'avgPlace' ? '↑' : '↓'}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
})

ChampionFilter.displayName = 'ChampionFilter'
