import { lazy } from 'react'
import { retryLoadWithFallBack } from 'utils'

export type { FinalCompTabProps } from './FinalCompTab/index'
export type { HeroesTabProps } from './HeroesTab/index'
export type { ItemsTabProps } from './ItemsTab/index'

export { LazyTabContent } from './LazyTabContent'

export type { OverviewTabProps } from './OverviewTab/index'
export type { TransitionTabProps } from './TransitionTab/index'

export const FinalCompTab = lazy(() => retryLoadWithFallBack({
  fn: () => import('./FinalCompTab/index').then(m => ({ default: m.FinalCompTab })),
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

export const TransitionTab = lazy(() => retryLoadWithFallBack({
  fn: () => import('./TransitionTab/index').then(m => ({ default: m.TransitionTab })),
}))
