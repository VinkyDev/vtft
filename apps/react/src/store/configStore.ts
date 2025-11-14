import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 窗口模式类型
 */
type WindowMode = 'standard' | 'compact' | 'floating'

interface TooltipConfig {
  championTooltip: boolean
  itemTooltip: boolean
  traitTooltip: boolean
}

interface ConfigState {
  windowMode: WindowMode
  tooltipConfig: TooltipConfig
  setWindowMode: (mode: WindowMode) => void
  setTooltipConfig: (config: Partial<TooltipConfig>) => void
}

/**
 * 全局配置 store
 * 包含窗口模式和其他应用配置
 */
export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      windowMode: 'standard',
      tooltipConfig: {
        championTooltip: true,
        itemTooltip: true,
        traitTooltip: true,
      },
      setWindowMode: (mode: WindowMode) => {
        set({ windowMode: mode })
      },
      setTooltipConfig: (config: Partial<TooltipConfig>) => {
        set({ tooltipConfig: { ...get().tooltipConfig, ...config } })
      },
    }),
    {
      name: 'tft-config',
      partialize: state => ({
        tooltipConfig: state.tooltipConfig,
      }),
    },
  ),
)
