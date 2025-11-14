import { useSize } from 'ahooks'
import { useMemo, useRef } from 'react'

interface UseAdaptiveListOptions {
  /** 项目列表 */
  items: unknown[]
  /** 每个项目的宽度（包括 gap） */
  itemWidth: number
  /** "+x" 按钮的宽度 */
  moreButtonWidth?: number
  /** 最小显示数量 */
  minVisible?: number
}

interface UseAdaptiveListResult<T> {
  /** 容器 ref */
  containerRef: React.RefObject<HTMLDivElement>
  /** 可见的项目 */
  visibleItems: T[]
  /** 剩余项目数量 */
  remainingCount: number
  /** 是否需要显示 "+x" 按钮 */
  showMore: boolean
}

/**
 * 自适应列表 hook
 * 根据容器宽度动态计算可显示的项目数量
 *
 * @example
 * ```tsx
 * const { containerRef, visibleItems, remainingCount, showMore } = useAdaptiveList({
 *   items: champions,
 *   itemWidth: 20, // 16px + 4px gap
 *   moreButtonWidth: 20,
 *   minVisible: 1,
 * })
 * ```
 */
export function useAdaptiveList<T = unknown>(
  options: UseAdaptiveListOptions,
): UseAdaptiveListResult<T> {
  const {
    items,
    itemWidth,
    moreButtonWidth = itemWidth,
    minVisible = 1,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const containerSize = useSize(containerRef)

  // 动态计算可以显示多少个项目
  const visibleCount = useMemo(() => {
    if (!containerSize?.width || items.length === 0)
      return items.length

    const availableWidth = containerSize.width

    // 如果所有项目都能显示
    if (items.length * itemWidth <= availableWidth) {
      return items.length
    }

    // 需要显示 "+x" 按钮，计算能显示多少个项目
    const widthForItems = availableWidth - moreButtonWidth
    const count = Math.floor(widthForItems / itemWidth)

    // 至少显示 minVisible 个项目
    return Math.max(minVisible, count)
  }, [containerSize?.width, items.length, itemWidth, moreButtonWidth, minVisible])

  const visibleItems = items.slice(0, visibleCount) as T[]
  const remainingCount = items.length - visibleCount
  const showMore = remainingCount > 0

  return {
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    visibleItems,
    remainingCount,
    showMore,
  }
}
