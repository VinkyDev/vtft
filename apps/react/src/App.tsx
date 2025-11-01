import { useMount } from 'ahooks'
import { Overlay, Window } from 'bridge'
import { lazy, useMemo, useState } from 'react'
import { AppTabs, FloatingBallMode, SuspenseFallback } from '@/components'
import { useDraggable } from '@/hooks'
import { useConfigStore, useGameDataStore } from '@/store'

const CompRankingsPage = lazy(() => import('@/pages/CompsPage/index.lazy').then(m => ({ default: m.default })))
const ItemsPage = lazy(() => import('@/pages/ItemsPage/index.lazy').then(m => ({ default: m.default })))
const ChampionsPage = lazy(() => import('@/pages/ChampionsPage/index.lazy').then(m => ({ default: m.default })))
const AugmentsPage = lazy(() => import('@/pages/AugmentsPage/index.lazy').then(m => ({ default: m.default })))

function App() {
  const [activeTab, setActiveTab] = useState('comps')
  const { fetchChampions, fetchItems, fetchAugments } = useGameDataStore()
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
  })

  useMount(() => {
    fetchChampions()
    fetchItems()
    fetchAugments()

    Window.setMode(windowMode).then((result) => {
      if (result.success && result.data) {
        setWindowMode(result.data)
      }
    })
  })

  const tabs = useMemo(() => [
    {
      value: 'comps',
      label: '阵容',
      content: (
        <SuspenseFallback skeletonType="comp">
          <CompRankingsPage />
        </SuspenseFallback>
      ),
    },
    {
      value: 'items',
      label: '装备',
      content: (
        <SuspenseFallback>
          <ItemsPage />
        </SuspenseFallback>
      ),
    },
    {
      value: 'champions',
      label: '英雄',
      content: (
        <SuspenseFallback>
          <ChampionsPage />
        </SuspenseFallback>
      ),
    },
    {
      value: 'augments',
      label: '符文',
      content: (
        <SuspenseFallback>
          <AugmentsPage />
        </SuspenseFallback>
      ),
    },
  ], [])

  return (
    <div className={`overflow-hidden ${windowMode === 'floating' ? 'rounded-full' : 'rounded-2xl'}`}>
      <div className={`min-h-screen ${windowMode === 'floating' ? '' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2'}`}>
        <div
          className="flex items-center justify-center h-screen z-[60] pointer-events-auto"
          style={{ display: windowMode === 'floating' ? 'flex' : 'none' }}
          onClick={e => e.stopPropagation()}
        >
          <FloatingBallMode />
        </div>

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
