import type { FilterGroup } from '@/components'
import { memo } from 'react'
import { FilterBar } from '@/components'

export type AugmentLevelFilter = 'all' | 'Silver' | 'Gold' | 'Prismatic'

interface AugmentFilterProps {
  levelFilter: AugmentLevelFilter
  onLevelFilterChange: (level: AugmentLevelFilter) => void
}

/**
 * 强化符文级别过滤器组件
 * 支持按级别筛选
 */
export const AugmentFilter = memo((props: AugmentFilterProps) => {
  const filterGroups: FilterGroup[] = [
    {
      value: props.levelFilter,
      options: [
        { value: 'all', label: '全部' },
        { value: 'Silver', label: '银色' },
        { value: 'Gold', label: '金色' },
        { value: 'Prismatic', label: '棱彩' },
      ],
      onChange: (value) => {
        props.onLevelFilterChange(value as AugmentLevelFilter)
      },
    },
  ]

  return <FilterBar groups={filterGroups} showContainer={false} />
})

AugmentFilter.displayName = 'AugmentFilter'
