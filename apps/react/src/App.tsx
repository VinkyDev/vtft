import { useMount } from 'ahooks'
import { lazy, useMemo, useState } from 'react'
import { withErrorBoundary, withSuspense } from 'react-helper'
import { retryLoadWithFallBack } from 'utils'
import { AppTabs, ErrorState, FloatingBallMode } from '@/components'
import CompRankingsPage from '@/pages/CompsPage/index'
import { useConfigStore, useGameDataStore } from '@/store/dataStore'

const ItemsPage = withErrorBoundary(withSuspense(lazy(() => retryLoadWithFallBack({ fn: () => import('@/pages/ItemsPage/index') }))), {
  errorBoundaryName: 'ItemsPage',
  FallbackComponent: ({ resetErrorBoundary }) => {
    const { fetchItems } = useGameDataStore()
    return (
      <ErrorState
        message="装备数据加载失败"
        onReload={() => {
          fetchItems().then(() => {
            resetErrorBoundary()
          })
        }}
      />
    )
  },
})

const ChampionsPage = withErrorBoundary(withSuspense(lazy(() => retryLoadWithFallBack({ fn: () => import('@/pages/ChampionsPage/index') }))), {
  errorBoundaryName: 'ChampionsPage',
  FallbackComponent: ({ resetErrorBoundary }) => {
    const { fetchChampions } = useGameDataStore()
    return (
      <ErrorState
        message="英雄数据加载失败"
        onReload={() => {
          fetchChampions().then(() => {
            resetErrorBoundary()
          })
        }}
      />
    )
  },
})

const AugmentsPage = withErrorBoundary(withSuspense(lazy(() => retryLoadWithFallBack({ fn: () => import('@/pages/AugmentsPage/index') }))), {
  errorBoundaryName: 'AugmentsPage',
  FallbackComponent: ({ resetErrorBoundary }) => {
    const { fetchAugments } = useGameDataStore()
    return (
      <ErrorState
        message="符文数据加载失败"
        onReload={() => {
          fetchAugments().then(() => {
            resetErrorBoundary()
          })
        }}
      />
    )
  },
})

function App() {
  const [activeTab, setActiveTab] = useState('comps')
  const { fetchChampions, fetchItems, fetchAugments } = useGameDataStore()
  const { windowMode } = useConfigStore()

  useMount(async () => {
    Promise.allSettled([
      fetchChampions(),
      fetchItems(),
      fetchAugments(),
    ])
  })

  const tabs = useMemo(() => [
    {
      value: 'comps',
      label: '阵容',
      content: (
        <CompRankingsPage />
      ),
    },
    {
      value: 'items',
      label: '装备',
      content: (
        <ItemsPage />
      ),
    },
    {
      value: 'champions',
      label: '英雄',
      content: (
        <ChampionsPage />
      ),
    },
    {
      value: 'augments',
      label: '符文',
      content: (
        <AugmentsPage />
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
