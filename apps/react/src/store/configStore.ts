import { create } from 'zustand'

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
  set => ({
    windowMode: 'standard',
    setWindowMode: (mode: WindowMode) => {
      set({ windowMode: mode })
    },
  }),
)
