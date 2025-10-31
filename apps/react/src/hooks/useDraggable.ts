import { useCallback, useEffect, useRef } from 'react'

export interface UseDraggableOptions {
  /**
   * 拖动回调函数，接收 x 和 y 轴的偏移量
   */
  onDrag: (dx: number, dy: number) => void
  /**
   * 拖动开始回调
   */
  onDragStart?: () => void
  /**
   * 拖动结束回调，接收鼠标的屏幕坐标
   */
  onDragEnd?: (mouseX: number, mouseY: number) => void
  /**
   * 触发拖动的最小移动距离（像素），默认 3
   */
  threshold?: number
  /**
   * 是否启用拖动，默认 true
   */
  enabled?: boolean
}

export interface UseDraggableReturn {
  /**
   * 绑定到可拖动元素上的 mousedown 事件处理器
   */
  onMouseDown: (e: React.MouseEvent) => void
  /**
   * 检查是否发生了拖动（用于在点击事件中判断）
   * 必须在事件处理器中同步调用
   */
  checkIfMoved: () => boolean
}

/**
 * 通用拖动 Hook
 * 使用全局事件监听实现高性能拖动
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { onMouseDown, checkIfMoved } = useDraggable({
 *     onDrag: (dx, dy) => {
 *       // 处理拖动逻辑
 *       Window.drag(dx, dy)
 *     },
 *     threshold: 3
 *   })
 *
 *   const handleClick = (e: React.MouseEvent) => {
 *     if (checkIfMoved()) {
 *       e.preventDefault()
 *       e.stopPropagation()
 *       return
 *     }
 *     // 处理点击逻辑
 *   }
 *
 *   return <div onMouseDown={onMouseDown} onClick={handleClick}>...</div>
 * }
 * ```
 */
export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const { onDrag, onDragStart, onDragEnd, threshold = 3, enabled = true } = options

  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    hasMoved: false,
    dragStartCalled: false,
  })

  useEffect(() => {
    if (!enabled)
      return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging)
        return

      const dx = e.screenX - dragStateRef.current.startX
      const dy = e.screenY - dragStateRef.current.startY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 如果移动距离超过阈值，标记为已移动并执行拖动回调
      if (distance > threshold) {
        // 第一次移动时调用 onDragStart
        if (!dragStateRef.current.dragStartCalled) {
          dragStateRef.current.dragStartCalled = true
          onDragStart?.()
        }

        dragStateRef.current.hasMoved = true
        onDrag(dx, dy)
        dragStateRef.current.startX = e.screenX
        dragStateRef.current.startY = e.screenY
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (dragStateRef.current.isDragging && dragStateRef.current.dragStartCalled) {
        onDragEnd?.(e.screenX, e.screenY)
      }
      dragStateRef.current.isDragging = false
      dragStateRef.current.dragStartCalled = false
    }

    // 使用全局事件监听,避免 React 事件系统的开销
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [onDrag, onDragStart, onDragEnd, threshold, enabled])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled || e.button !== 0)
      return

    dragStateRef.current = {
      isDragging: true,
      startX: e.screenX,
      startY: e.screenY,
      hasMoved: false,
      dragStartCalled: false,
    }
  }, [enabled])

  const checkIfMoved = useCallback(() => {
    return dragStateRef.current.hasMoved
  }, [])

  return {
    onMouseDown: handleMouseDown,
    checkIfMoved,
  }
}
