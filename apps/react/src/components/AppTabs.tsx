import type { ReactNode } from 'react'
import { memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui'

/**
 * Tab 配置项
 */
export interface AppTab {
  /** Tab 的值 */
  value: string
  /** Tab 的显示文本 */
  label: string
  /** Tab 内容 */
  content: ReactNode
}

/**
 * AppTabs 组件属性
 */
interface AppTabsProps {
  /** 当前激活的 tab */
  value: string
  /** Tab 切换回调 */
  onValueChange: (value: string) => void
  /** Tab 配置列表 */
  tabs: AppTab[]
  /** TabsList 额外类名 */
  tabListClassName?: string
  /** 是否启用平滑切换动画 */
  enableAnimation?: boolean
  /** 容器类名 */
  className?: string
  /** TabsList 之前的元素 */
  beforeTabList?: ReactNode
  /** TabsList 之后的元素 */
  afterTabList?: ReactNode
  /** TabsList 容器的布局方式 */
  tabListLayout?: 'center' | 'space-between'
}

/**
 * 应用通用 Tabs 组件
 */
export const AppTabs = memo((props: AppTabsProps) => {
  const {
    value,
    onValueChange,
    tabs,
    tabListClassName = '',
    enableAnimation = true,
    className = 'w-full',
    beforeTabList,
    afterTabList,
    tabListLayout = 'center',
  } = props

  const layoutClass = tabListLayout === 'space-between' ? 'justify-between' : 'justify-center'

  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <div className={`flex items-center ${layoutClass}`}>
        {beforeTabList}

        <TabsList className={`bg-black/30 border border-white/20 h-7 sm:h-9 p-1 no-drag ${tabListClassName}`}>
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-5 px-3 text-xs sm:h-6 sm:px-4 sm:text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {afterTabList}
      </div>

      {/* 内容区域 */}
      {enableAnimation
        ? (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${tabs.findIndex(t => t.value === value) * 100}%)`,
                }}
              >
                {tabs.map(tab => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="min-w-full shrink-0 no-drag"
                    forceMount
                  >
                    <div
                      className="transition-opacity duration-300 h-full"
                      style={{
                        opacity: value === tab.value ? 1 : 0,
                        pointerEvents: value === tab.value ? 'auto' : 'none',
                      }}
                    >
                      {tab.content}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </div>
          )
        : (
            <>
              {tabs.map(tab => (
                <TabsContent key={tab.value} value={tab.value} className="h-full m-0 no-drag">
                  {tab.content}
                </TabsContent>
              ))}
            </>
          )}
    </Tabs>
  )
})

AppTabs.displayName = 'AppTabs'
