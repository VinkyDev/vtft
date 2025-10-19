import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 窗口模式类型
 */
export type WindowMode = 'standard' | 'compact'

interface ConfigState {
  // 窗口模式
  windowMode: WindowMode

  // 快捷键配置
  toggleWindowShortcut: string

  // Actions
  setWindowMode: (mode: WindowMode) => void
  toggleWindowMode: () => void
  setToggleWindowShortcut: (shortcut: string) => void
}

/**
 * 全局配置 store
 * 包含窗口模式和其他应用配置
 */
export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // 初始状态 - 默认为标准模式
      windowMode: 'standard',

      // 默认快捷键
      toggleWindowShortcut: 'CommandOrControl+Shift+H',

      // 设置窗口模式
      setWindowMode: (mode: WindowMode) => {
        set({ windowMode: mode })
      },

      // 切换窗口模式
      toggleWindowMode: () => {
        const currentMode = get().windowMode
        const newMode: WindowMode = currentMode === 'standard' ? 'compact' : 'standard'
        set({ windowMode: newMode })
      },

      // 设置切换窗口快捷键
      setToggleWindowShortcut: (shortcut: string) => {
        set({ toggleWindowShortcut: shortcut })
      },
    }),
    {
      name: 'vtft-config-storage', // localStorage 中的键名
      partialize: state => ({
        windowMode: state.windowMode,
        toggleWindowShortcut: state.toggleWindowShortcut,
      }),
    },
  ),
)
