import type { FilterGroup } from '@/components'
import { memo } from 'react'
import { FilterBar } from '@/components'

export type ChampionCostFilter = 'all' | '1' | '2' | '3' | '4' | '5'
export type ChampionSortField = 'composite' | 'matches' | 'avgPlace' | 'top4Rate' | 'firstPlaceRate'
export type SortOrder = 'asc' | 'desc'

interface ChampionFilterProps {
  costFilter: ChampionCostFilter
  onCostFilterChange: (cost: ChampionCostFilter) => void
  sortField: ChampionSortField
  onSortFieldChange: (field: ChampionSortField) => void
}

/**
 * 英雄过滤器组件
 * 支持费用筛选和排序，排序方向固定（平均排名升序，其他降序）
 */
export const ChampionFilter = memo((props: ChampionFilterProps) => {
  const filterGroups: FilterGroup[] = [
    {
      value: props.costFilter.toString(),
      options: [
        { value: 'all', label: '全部' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
      ],
      onChange: (value) => {
        props.onCostFilterChange(value as ChampionCostFilter)
      },
    },
    {
      value: props.sortField,
      options: [
        { value: 'composite', label: '综合' },
        { value: 'matches', label: '场次' },
        { value: 'avgPlace', label: '影响' },
      ],
      onChange: (value) => {
        props.onSortFieldChange(value as ChampionSortField)
      },
    },
  ]

  return <FilterBar groups={filterGroups} />
})

ChampionFilter.displayName = 'ChampionFilter'
