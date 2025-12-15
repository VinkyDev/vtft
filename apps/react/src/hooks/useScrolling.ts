import type { RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 监听滚动状态的 Hook
 * 用于实现滚动时显示滚动条的效果
 *
 * @param ref 滚动容器的 ref（可选，如果不传则返回一个 ref 供外部使用）
 * @param delay 停止滚动后延迟隐藏的时间（毫秒），默认 800ms
 * @returns isScrolling 是否正在滚动
 */
export function useScrolling<T extends HTMLElement = HTMLElement>(
  ref?: RefObject<T | null>,
  delay = 800,
): { isScrolling: boolean, scrollRef: RefObject<T | null> } {
  const internalRef = useRef<T>(null)
  const scrollRef = ref ?? internalRef
  const [isScrolling, setIsScrolling] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleScroll = useCallback(() => {
    setIsScrolling(true)

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 设置新的定时器，停止滚动后延迟隐藏
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, delay)
  }, [delay])

  useEffect(() => {
    const element = scrollRef.current
    if (!element)
      return

    element.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [scrollRef, handleScroll])

  return { isScrolling, scrollRef }
}
