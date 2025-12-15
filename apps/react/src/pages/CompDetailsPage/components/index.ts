import { lazy } from 'react'
import { retryLoadWithFallBack } from 'utils'

export type { BuildsTabProps } from './BuildsTab/index'
export type { HeroesTabProps } from './HeroesTab/index'
export type { ItemsTabProps } from './ItemsTab/index'

export { LazyTabContent } from './LazyTabContent'

export type { OverviewTabProps } from './OverviewTab/index'

export const BuildsTab = lazy(() => retryLoadWithFallBack({
  fn: () => import('./BuildsTab/index').then(m => ({ default: m.BuildsTab })),
}))

export const HeroesTab = lazy(() => retryLoadWithFallBack({
  fn: () => import('./HeroesTab/index').then(m => ({ default: m.HeroesTab })),
}))

export const ItemsTab = lazy(() => retryLoadWithFallBack({
  fn: () => import('./ItemsTab/index').then(m => ({ default: m.ItemsTab })),
}))

export const OverviewTab = lazy(() => retryLoadWithFallBack({
  fn: () => import('./OverviewTab/index').then(m => ({ default: m.OverviewTab })),
}))
