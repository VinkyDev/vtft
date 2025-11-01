import type { ComponentType, LazyExoticComponent } from 'react'
import { lazy } from 'react'

/**
 * 创建懒加载组件
 */
export function createLazyComponent<P extends Record<string, unknown> = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
): LazyExoticComponent<ComponentType<P>> {
  return lazy(importFn)
}
