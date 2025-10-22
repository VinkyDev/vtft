import { useEffect, useState } from 'react'

/**
 * 检测当前是否为小窗模式
 * 基于 Tailwind CSS 的 sm 断点 (640px)
 * @returns boolean - 是否为小窗模式 (< 640px)
 */
export function useIsSmallWindow(): boolean {
  const [isSmallWindow, setIsSmallWindow] = useState(false)

  useEffect(() => {
    // 检查当前窗口尺寸
    const checkWindowSize = () => {
      setIsSmallWindow(window.innerWidth < 640)
    }

    // 初始检查
    checkWindowSize()

    // 监听窗口尺寸变化
    window.addEventListener('resize', checkWindowSize)

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', checkWindowSize)
    }
  }, [])

  return isSmallWindow
}
