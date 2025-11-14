import type { ReactNode } from 'react'
import { lazy } from 'react'
import { withErrorBoundary, withSuspense } from 'react-helper'
import { retryLoadWithFallBack } from 'utils'
import { ErrorState } from '@/components'
import { useGameDataStore } from '@/store/dataStore'
import CompRankingsPage from './pages/CompsPage'

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

interface AppRoute {
  value: string
  label: string
  content: ReactNode
}

export const routes: AppRoute[] = [
  {
    value: 'comps',
    label: '阵容',
    content: <CompRankingsPage />,
  },
  {
    value: 'items',
    label: '装备',
    content: <ItemsPage />,
  },
  {
    value: 'champions',
    label: '英雄',
    content: <ChampionsPage />,
  },
  {
    value: 'augments',
    label: '符文',
    content: <AugmentsPage />,
  },
]
