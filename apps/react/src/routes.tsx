import type { ReactNode } from 'react'
import { lazy } from 'react'
import { withErrorBoundary, withSuspense } from 'react-helper'
import { retryLoadWithFallBack } from 'utils'
import { ErrorState } from '@/components'

const CompRankingsPage = withErrorBoundary(withSuspense(lazy(() => retryLoadWithFallBack({ fn: () => import('@/pages/CompsPage') }))), {
  errorBoundaryName: 'CompsPage',
  FallbackComponent: ({ resetErrorBoundary }) => {
    return (
      <ErrorState
        message="阵容数据加载失败"
        onReload={resetErrorBoundary}
      />
    )
  },
})

const ItemsPage = withErrorBoundary(withSuspense(lazy(() => retryLoadWithFallBack({ fn: () => import('@/pages/ItemsPage/index') }))), {
  errorBoundaryName: 'ItemsPage',
  FallbackComponent: ({ resetErrorBoundary }) => {
    return (
      <ErrorState
        message="装备数据加载失败"
        onReload={resetErrorBoundary}
      />
    )
  },
})

const ChampionsPage = withErrorBoundary(withSuspense(lazy(() => retryLoadWithFallBack({ fn: () => import('@/pages/ChampionsPage/index') }))), {
  errorBoundaryName: 'ChampionsPage',
  FallbackComponent: ({ resetErrorBoundary }) => {
    return (
      <ErrorState
        message="英雄数据加载失败"
        onReload={resetErrorBoundary}
      />
    )
  },
})

const AugmentsPage = withErrorBoundary(withSuspense(lazy(() => retryLoadWithFallBack({ fn: () => import('@/pages/AugmentsPage/index') }))), {
  errorBoundaryName: 'AugmentsPage',
  FallbackComponent: ({ resetErrorBoundary }) => {
    return (
      <ErrorState
        message="符文数据加载失败"
        onReload={resetErrorBoundary}
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
