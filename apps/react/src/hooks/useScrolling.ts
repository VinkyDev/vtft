import type { RefObject } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

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
    if (timeoutRef.current)
      clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsScrolling(false), delay)
  }, [delay])

  useEffect(() => {
    const element = scrollRef.current
    if (!element)
      return
    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current)
        clearTimeout(timeoutRef.current)
    }
  }, [scrollRef, handleScroll])

  return { isScrolling, scrollRef }
}
