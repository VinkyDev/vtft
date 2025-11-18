import { memo } from 'react'
import { Tabs, TabsList, TabsTrigger } from 'ui'

interface FilterOption<T = string> {
  value: T
  label: string
}

export interface FilterGroup<T = string> {
  /** 过滤器组的标题（可选） */
  title?: string
  /** 当前选中的值 */
  value: T
  /** 选项列表 */
  options: FilterOption<T>[]
  /** 值变化回调 */
  onChange: (value: T) => void
  /** 自定义渲染每个选项的后缀（如排序箭头） */
  renderSuffix?: (value: T) => React.ReactNode
}

interface FilterBarProps {
  /** 过滤器组列表 */
  groups: FilterGroup[]
  /** 容器类名 */
  className?: string
  /** 是否显示容器（默认 true） */
  showContainer?: boolean
  /** 内容布局方式 */
  layout?: 'space-between' | 'start' | 'center' | 'end'
}

export const FilterBar = memo(({
  groups,
  className = '',
  showContainer = true,
  layout = 'space-between',
}: FilterBarProps) => {
  const layoutClasses = {
    'space-between': 'justify-between',
    'start': 'justify-start',
    'center': 'justify-center',
    'end': 'justify-end',
  }

  const content = (
    <div className={`flex ${layoutClasses[layout]} items-center flex-wrap gap-2`}>
      {groups.map(group => (
        <div key={group.value} className="flex items-center gap-2">
          {group.title && (
            <span className="text-gray-400 text-xs">{group.title}</span>
          )}
          <Tabs
            value={group.value as string}
            onValueChange={value => group.onChange(value as never)}
          >
            <TabsList className="h-6 sm:h-8 bg-black/20 border-white/5 p-0.5">
              {group.options.map(({ value, label }) => (
                <TabsTrigger
                  key={value as string}
                  value={value as string}
                  className="h-5 sm:h-6 px-2 text-[10px] sm:text-[12px] font-medium data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=inactive]:text-gray-500"
                >
                  {label}
                  {group.renderSuffix && (
                    <span className="ml-1 text-[8px] opacity-60">
                      {group.renderSuffix(value as never)}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      ))}
    </div>
  )

  if (!showContainer) {
    return content
  }

  return (
    <div className={`py-2 px-2 mb-1 bg-white/5 rounded-lg border border-white/10 ${className}`}>
      {content}
    </div>
  )
})

FilterBar.displayName = 'FilterBar'
