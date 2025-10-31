import { useMount } from 'ahooks'
import { Overlay, Window } from 'bridge'
import { useMemo, useState } from 'react'
import { AppTabs, FloatingBallMode } from '@/components'
import { useDraggable } from '@/hooks'
import { AugmentsPage } from '@/pages/AugmentsPage'
import { ChampionsPage } from '@/pages/ChampionsPage'
import { CompRankingsPage } from '@/pages/CompsPage'
import { ItemsPage } from '@/pages/ItemsPage'
import { useConfigStore, useGameDataStore } from '@/store'

function App() {
  const [activeTab, setActiveTab] = useState('comps')
  const { fetchChampions, fetchItems, fetchAugments } = useGameDataStore()
  const { windowMode, setWindowMode } = useConfigStore()

  // 窗口拖动处理（标准模式和小窗模式）
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
    threshold: 3,
  })

  useMount(() => {
    fetchChampions()
    fetchItems()
    fetchAugments()

    // 同步窗口模式
    Window.setMode(windowMode).then((result) => {
      if (result.success && result.data) {
        setWindowMode(result.data)
      }
    })
  })

  // Tabs 配置
  const tabs = useMemo(() => [
    { value: 'comps', label: '阵容', content: <CompRankingsPage /> },
    { value: 'items', label: '装备', content: <ItemsPage /> },
    { value: 'champions', label: '英雄', content: <ChampionsPage /> },
    { value: 'augments', label: '符文', content: <AugmentsPage /> },
  ], [])

  return (
    <div className={`overflow-hidden ${windowMode === 'floating' ? 'rounded-full' : 'rounded-2xl'}`}>
      <div className={`min-h-screen ${windowMode === 'floating' ? '' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2'}`}>
        {/* 悬浮球模式 */}
        <div
          className="flex items-center justify-center h-screen"
          style={{ display: windowMode === 'floating' ? 'flex' : 'none' }}
        >
          <FloatingBallMode />
        </div>

        {/* 标准模式和小窗模式 */}
        <div
          className="relative"
          style={{ display: windowMode !== 'floating' ? 'block' : 'none' }}
          onMouseDown={onMouseDown}
        >
          <AppTabs
            value={activeTab}
            onValueChange={setActiveTab}
            tabs={tabs}
            enableAnimation
          />
        </div>
      </div>
    </div>
  )
}

export default App
