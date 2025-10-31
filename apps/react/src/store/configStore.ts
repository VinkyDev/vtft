import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 窗口模式类型
 */
export type WindowMode = 'standard' | 'compact' | 'floating'

interface ConfigState {
  windowMode: WindowMode
  setWindowMode: (mode: WindowMode) => void
}

/**
 * 全局配置 store
 * 包含窗口模式和其他应用配置
 */
export const useConfigStore = create<ConfigState>()(
  persist(
    set => ({
      // 初始状态 - 默认为标准模式
      windowMode: 'standard',
      setWindowMode: (mode: WindowMode) => {
        set({ windowMode: mode })
      },
    }),
    {
      name: 'vtft-config-storage', // localStorage 中的键名
      partialize: state => ({
        windowMode: state.windowMode,
      }),
    },
  ),
)
