import { useSyncExternalStore } from 'react'

/**
 * 获取当前窗口是否为小窗模式
 */
function getSnapshot(): boolean {
  return window.innerWidth < 640
}

/**
 * SSR 时的服务端快照
 */
function getServerSnapshot(): boolean {
  return false
}

/**
 * 订阅窗口尺寸变化
 */
function subscribe(callback: () => void): () => void {
  window.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
  }
}

/**
 * 检测当前是否为小窗模式
 * 基于 Tailwind CSS 的 sm 断点 (640px)
 * @returns boolean - 是否为小窗模式 (< 640px)
 */
export function useIsSmallWindow(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
