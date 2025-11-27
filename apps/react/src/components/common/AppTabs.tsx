import type { ReactNode } from 'react'
import { Overlay, Window } from 'bridge'
import { memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui'
import { useDraggable } from '@/hooks'
import { useConfigStore } from '@/store/configStore'

interface AppTab {
  value: string
  label: string
  content: ReactNode
}

interface AppTabsProps {
  value: string
  onValueChange: (value: string) => void
  tabs: AppTab[]
  tabListClassName?: string
  enableAnimation?: boolean
  className?: string
  beforeTabList?: ReactNode
  afterTabList?: ReactNode
  tabListLayout?: 'center' | 'space-between'
}

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

  const { windowMode, setWindowMode } = useConfigStore()

  const { onMouseDown } = useDraggable({
    onDrag: (dx, dy) => Window.drag(dx, dy),
    onDragStart: async () => {
      await Window.startDrag()
      await Overlay.show()
    },
    onDragEnd: async (mouseX, mouseY) => {
      const result = await Window.endDrag(mouseX, mouseY)
      if (result.success && result.data) {
        setWindowMode(result.data)
      }
      await Overlay.hide()
    },
    enabled: windowMode !== 'floating',
  })

  const layoutClass = tabListLayout === 'space-between' ? 'justify-between' : 'justify-center'

  return (
    <Tabs value={value} onValueChange={onValueChange} className={`h-full ${className}`}>
      <div className={`flex relative items-center ${layoutClass}`} onMouseDown={onMouseDown}>
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
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          {afterTabList}
        </div>

      </div>

      {enableAnimation
        ? (
            <div
              className="relative overflow-hidden h-full"
              onMouseDown={e => e.stopPropagation()}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{
                  transform: `translateX(-${tabs.findIndex(t => t.value === value) * 100}%)`,
                }}
              >
                {tabs.map((tab) => {
                  const isActive = value === tab.value
                  return (
                    <TabsContent
                      key={tab.value}
                      value={tab.value}
                      className="min-w-full shrink-0 no-drag"
                      forceMount
                      {...(!isActive && { inert: true })}
                    >
                      <div
                        className="transition-opacity duration-300 h-full"
                        style={{
                          opacity: isActive ? 1 : 0,
                          pointerEvents: isActive ? 'auto' : 'none',
                        }}
                      >
                        {isActive ? tab.content : null}
                      </div>
                    </TabsContent>
                  )
                })}
              </div>
            </div>
          )
        : (
            <div onMouseDown={e => e.stopPropagation()}>
              {tabs.map((tab) => {
                const isActive = value === tab.value
                return (
                  <TabsContent key={tab.value} value={tab.value} className="h-full m-0 no-drag">
                    {isActive ? tab.content : null}
                  </TabsContent>
                )
              })}
            </div>
          )}
    </Tabs>
  )
})

AppTabs.displayName = 'AppTabs'
