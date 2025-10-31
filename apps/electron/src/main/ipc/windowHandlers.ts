import { BrowserWindow, ipcMain } from 'electron'
import { IPC_EVENTS } from 'utils'
import { WindowService } from '../services/windowService'

// 存储拖动时的初始窗口位置、大小和累积偏移量
const dragStateMap = new WeakMap<BrowserWindow, {
  initialX: number
  initialY: number
  initialWidth: number
  initialHeight: number
  totalDx: number
  totalDy: number
  pendingUpdateTimer: NodeJS.Timeout | null
  lastAppliedX: number
  lastAppliedY: number
}>()

export async function setupWindowHandlers() {
  const windowService = new WindowService()

  // 设置窗口模式
  ipcMain.handle(
    IPC_EVENTS.WINDOW.SET_MODE,
    async (event, mode: 'standard' | 'compact' | 'floating') => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.setWindowMode(window, mode)
    },
  )

  // 获取窗口模式
  ipcMain.handle(
    IPC_EVENTS.WINDOW.GET_MODE,
    async () => {
      return await windowService.getWindowMode()
    },
  )

  // 切换窗口显示/隐藏
  ipcMain.handle(
    IPC_EVENTS.WINDOW.TOGGLE_VISIBILITY,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.toggleVisibility(window)
    },
  )

  // 显示窗口
  ipcMain.handle(
    IPC_EVENTS.WINDOW.SHOW,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.show(window)
    },
  )

  // 隐藏窗口
  ipcMain.handle(
    IPC_EVENTS.WINDOW.HIDE,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.hide(window)
    },
  )

  // 拖动窗口 - 使用 setBounds 明确保持窗口大小不变，并使用节流优化性能
  ipcMain.on(
    IPC_EVENTS.WINDOW.DRAG,
    (event, { dx, dy }: { dx: number, dy: number }) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window)
        return

      let dragState = dragStateMap.get(window)
      if (!dragState) {
        // 如果没有初始状态，初始化并记录初始位置和大小
        const bounds = window.getBounds()
        dragState = {
          initialX: bounds.x,
          initialY: bounds.y,
          initialWidth: bounds.width,
          initialHeight: bounds.height,
          totalDx: 0,
          totalDy: 0,
          pendingUpdateTimer: null,
          lastAppliedX: bounds.x,
          lastAppliedY: bounds.y,
        }
        dragStateMap.set(window, dragState)
      }

      // 累积偏移量
      dragState.totalDx += dx
      dragState.totalDy += dy

      // 使用 setTimeout(0) 节流，批量处理更新
      // 这样可以避免每次 IPC 事件都立即调用 setBounds，减少系统调用
      // 使用 0ms 延迟等同于 setImmediate，但类型支持更好
      if (dragState.pendingUpdateTimer === null) {
        dragState.pendingUpdateTimer = setTimeout(() => {
          if (!window.isDestroyed()) {
            const newX = Math.round(dragState.initialX + dragState.totalDx)
            const newY = Math.round(dragState.initialY + dragState.totalDy)

            // 只在位置真正改变时才调用 setBounds，避免不必要的更新
            if (newX !== dragState.lastAppliedX || newY !== dragState.lastAppliedY) {
              window.setBounds(
                {
                  x: newX,
                  y: newY,
                  width: dragState.initialWidth,
                  height: dragState.initialHeight,
                },
                false, // animate = false，禁用动画提升性能
              )
              dragState.lastAppliedX = newX
              dragState.lastAppliedY = newY
            }
          }
          dragState.pendingUpdateTimer = null
        }, 0)
      }
    },
  )

  // 开始拖动 - 记录初始位置和大小
  ipcMain.handle(
    IPC_EVENTS.WINDOW.START_DRAG,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return await windowService.startDrag()
      }

      // 清理之前的定时器（如果存在）
      const existingState = dragStateMap.get(window)
      if (existingState?.pendingUpdateTimer) {
        clearTimeout(existingState.pendingUpdateTimer)
      }

      // 记录拖动开始时的窗口位置和大小
      const bounds = window.getBounds()
      dragStateMap.set(window, {
        initialX: bounds.x,
        initialY: bounds.y,
        initialWidth: bounds.width,
        initialHeight: bounds.height,
        totalDx: 0,
        totalDy: 0,
        pendingUpdateTimer: null,
        lastAppliedX: bounds.x,
        lastAppliedY: bounds.y,
      })

      return await windowService.startDrag()
    },
  )

  // 结束拖动 - 清理状态并应用最终位置
  ipcMain.handle(
    IPC_EVENTS.WINDOW.END_DRAG,
    async (event, mouseX: number, mouseY: number) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }

      // 立即应用任何待处理的更新
      const dragState = dragStateMap.get(window)
      if (dragState) {
        // 清理待处理的定时器
        if (dragState.pendingUpdateTimer) {
          clearTimeout(dragState.pendingUpdateTimer)
          dragState.pendingUpdateTimer = null
        }

        // 应用最终位置
        const finalX = Math.round(dragState.initialX + dragState.totalDx)
        const finalY = Math.round(dragState.initialY + dragState.totalDy)
        if (finalX !== dragState.lastAppliedX || finalY !== dragState.lastAppliedY) {
          window.setBounds(
            {
              x: finalX,
              y: finalY,
              width: dragState.initialWidth,
              height: dragState.initialHeight,
            },
            false,
          )
        }

        // 清理拖动状态
        dragStateMap.delete(window)
      }

      return await windowService.endDrag(window, mouseX, mouseY)
    },
  )

  // 获取屏幕分区信息
  ipcMain.handle(
    IPC_EVENTS.WINDOW.GET_SCREEN_ZONES,
    async () => {
      return await windowService.getScreenZones()
    },
  )

  // 切换到标准模式并居中
  ipcMain.handle(
    IPC_EVENTS.WINDOW.SWITCH_TO_STANDARD_AND_CENTER,
    async (event) => {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) {
        return { success: false, error: 'Window not found' }
      }
      return await windowService.switchToStandardAndCenter(window)
    },
  )
}
