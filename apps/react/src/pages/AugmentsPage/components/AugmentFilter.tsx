import { memo } from 'react'
import { Tabs, TabsList, TabsTrigger } from 'ui'

export type AugmentLevelFilter = 'all' | 'Silver' | 'Gold' | 'Prismatic'

interface AugmentFilterProps {
  levelFilter: AugmentLevelFilter
  onLevelFilterChange: (level: AugmentLevelFilter) => void
}

const levelOptions: { value: AugmentLevelFilter, label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'Silver', label: '银色' },
  { value: 'Gold', label: '金色' },
  { value: 'Prismatic', label: '棱彩' },
]

/**
 * 强化符文级别过滤器组件
 * 支持按级别筛选
 */
export const AugmentFilter = memo(({
  levelFilter,
  onLevelFilterChange,
}: AugmentFilterProps) => {
  return (
    <Tabs
      value={levelFilter}
      onValueChange={value => onLevelFilterChange(value as AugmentLevelFilter)}
    >
      <TabsList className="h-6 bg-black/20 border-white/5 p-0.5">
        {levelOptions.map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="h-5 px-2 text-[10px] font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=inactive]:text-gray-500"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
})

AugmentFilter.displayName = 'AugmentFilter'
