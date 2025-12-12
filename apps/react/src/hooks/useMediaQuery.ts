import { useSyncExternalStore } from 'react'

/**
 * 基于 matchMedia 的媒体查询监听
 */
export function useMediaQuery(query: string, defaultValue = true) {
  const getSnapshot = () => {
    if (typeof window === 'undefined')
      return defaultValue
    return window.matchMedia(query).matches
  }

  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined')
      return () => {}
    const mediaQueryList = window.matchMedia(query)
    mediaQueryList.addEventListener('change', callback)
    return () => mediaQueryList.removeEventListener('change', callback)
  }

  return useSyncExternalStore(subscribe, getSnapshot, () => defaultValue)
}
