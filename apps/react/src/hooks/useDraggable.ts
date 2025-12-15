import { useCallback, useEffect, useRef } from 'react'

interface UseDraggableOptions {
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

interface UseDraggableReturn {
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
  const { onDrag, onDragStart, onDragEnd, threshold = 2, enabled = true } = options

  // 最小 IPC 调用间隔（ms），防止高刷新率显示器上过于频繁的调用
  const MIN_DRAG_INTERVAL = 8

  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    hasMoved: false,
    dragStartCalled: false,
    pendingDx: 0,
    pendingDy: 0,
    rafId: null as number | null,
    lastDragTime: 0,
  })

  // 使用 ref 存储最新的回调函数，避免频繁重新绑定事件监听器
  const callbacksRef = useRef({ onDrag, onDragStart, onDragEnd, threshold })
  callbacksRef.current = { onDrag, onDragStart, onDragEnd, threshold }

  useEffect(() => {
    if (!enabled)
      return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging)
        return

      const { threshold: currentThreshold } = callbacksRef.current
      const dx = e.screenX - dragStateRef.current.startX
      const dy = e.screenY - dragStateRef.current.startY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 如果移动距离超过阈值，标记为已移动
      if (distance > currentThreshold) {
        // 第一次移动时调用 onDragStart
        if (!dragStateRef.current.dragStartCalled) {
          dragStateRef.current.dragStartCalled = true
          callbacksRef.current.onDragStart?.()
        }

        dragStateRef.current.hasMoved = true
        // 累积待处理的偏移量
        dragStateRef.current.pendingDx += dx
        dragStateRef.current.pendingDy += dy

        // 更新起始位置，下次计算相对于新位置
        dragStateRef.current.startX = e.screenX
        dragStateRef.current.startY = e.screenY

        // 使用 requestAnimationFrame 节流，并添加最小时间间隔检查
        // 这样即使在高刷新率显示器上也能保持稳定的 IPC 调用频率
        if (dragStateRef.current.rafId === null) {
          dragStateRef.current.rafId = requestAnimationFrame(() => {
            const now = performance.now()
            const elapsed = now - dragStateRef.current.lastDragTime
            const { pendingDx, pendingDy } = dragStateRef.current

            // 如果距离上次调用时间太短，跳过本次更新，等待下一帧
            if (elapsed < MIN_DRAG_INTERVAL) {
              dragStateRef.current.rafId = null
              // 安排下一帧继续检查
              if (pendingDx !== 0 || pendingDy !== 0) {
                dragStateRef.current.rafId = requestAnimationFrame(() => {
                  const { pendingDx: dx, pendingDy: dy } = dragStateRef.current
                  if (dx !== 0 || dy !== 0) {
                    callbacksRef.current.onDrag(dx, dy)
                    dragStateRef.current.pendingDx = 0
                    dragStateRef.current.pendingDy = 0
                    dragStateRef.current.lastDragTime = performance.now()
                  }
                  dragStateRef.current.rafId = null
                })
              }
              return
            }

            if (pendingDx !== 0 || pendingDy !== 0) {
              callbacksRef.current.onDrag(pendingDx, pendingDy)
              dragStateRef.current.pendingDx = 0
              dragStateRef.current.pendingDy = 0
              dragStateRef.current.lastDragTime = now
            }
            dragStateRef.current.rafId = null
          })
        }
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      // 取消待处理的动画帧
      if (dragStateRef.current.rafId !== null) {
        cancelAnimationFrame(dragStateRef.current.rafId)
        dragStateRef.current.rafId = null
      }

      // 如果有待处理的更新，立即执行
      if (dragStateRef.current.pendingDx !== 0 || dragStateRef.current.pendingDy !== 0) {
        callbacksRef.current.onDrag(dragStateRef.current.pendingDx, dragStateRef.current.pendingDy)
        dragStateRef.current.pendingDx = 0
        dragStateRef.current.pendingDy = 0
      }

      if (dragStateRef.current.isDragging && dragStateRef.current.dragStartCalled) {
        callbacksRef.current.onDragEnd?.(e.screenX, e.screenY)
      }
      dragStateRef.current.isDragging = false
      dragStateRef.current.dragStartCalled = false
    }

    // 使用全局事件监听,避免 React 事件系统的开销
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      // 清理动画帧
      if (dragStateRef.current.rafId !== null) {
        cancelAnimationFrame(dragStateRef.current.rafId)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [enabled])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled || e.button !== 0)
      return

    // 清理之前的动画帧（如果存在）
    if (dragStateRef.current.rafId !== null) {
      cancelAnimationFrame(dragStateRef.current.rafId)
    }

    dragStateRef.current = {
      isDragging: true,
      startX: e.screenX,
      startY: e.screenY,
      hasMoved: false,
      dragStartCalled: false,
      pendingDx: 0,
      pendingDy: 0,
      rafId: null,
      lastDragTime: 0,
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
