import { useMount } from 'ahooks'
import { GlobalShortcut, Window } from 'bridge'
import { Maximize2, Minimize2, Settings } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from 'ui'
import { AppTabs } from '@/components'
import { AugmentsPage } from '@/pages/AugmentsPage'
import { ChampionsPage } from '@/pages/ChampionsPage'
import { CompRankingsPage } from '@/pages/CompsPage'
import { ItemsPage } from '@/pages/ItemsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { useConfigStore, useGameDataStore } from '@/store'

function App() {
  const [activeTab, setActiveTab] = useState('comps')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { fetchChampions, fetchItems, fetchAugments } = useGameDataStore()
  const { windowMode, setWindowMode, toggleWindowShortcut } = useConfigStore()

  useMount(() => {
    fetchChampions()
    fetchItems()
    fetchAugments()

    // 同步窗口模式
    Window.setMode(windowMode).then((result) => {
      if (result.success && result.data) {
        setWindowMode(result.data)
      }
    })
  })

  // 注册全局快捷键
  useEffect(() => {
    if (!toggleWindowShortcut)
      return

    let isActive = true

    // 异步注册快捷键
    const registerShortcut = async () => {
      // 先清理可能存在的旧快捷键
      await GlobalShortcut.unregister(toggleWindowShortcut, 'toggle-window-visibility')

      // 如果组件已卸载，不继续注册
      if (!isActive)
        return

      // 注册新快捷键
      await GlobalShortcut.register(
        toggleWindowShortcut,
        'toggle-window-visibility',
        async () => {
          await Window.toggleVisibility()
        },
      )
    }

    registerShortcut()

    // 清理：组件卸载时取消注册
    return () => {
      isActive = false
      GlobalShortcut.unregister(toggleWindowShortcut, 'toggle-window-visibility')
    }
  }, [toggleWindowShortcut])

  // 切换窗口模式
  const handleToggleWindowMode = async () => {
    const newMode = windowMode === 'standard' ? 'compact' : 'standard'
    const result = await Window.setMode(newMode)
    if (result.success && result.data) {
      setWindowMode(result.data)
    }
  }

  // Tabs 配置
  const tabs = useMemo(() => [
    { value: 'comps', label: '阵容', content: <CompRankingsPage /> },
    { value: 'items', label: '装备', content: <ItemsPage /> },
    { value: 'champions', label: '英雄', content: <ChampionsPage /> },
    { value: 'augments', label: '符文', content: <AugmentsPage /> },
  ], [])

  // 窗口模式切换按钮
  const toggleButton = (
    <button
      onClick={handleToggleWindowMode}
      className={`no-drag bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-sm p-1.5 text-gray-400 hover:text-white transition-all duration-200 ${windowMode === 'compact' ? 'absolute left-2' : ''}`}
    >
      {windowMode === 'standard' ? <Minimize2 className="size-2 sm:size-3" /> : <Maximize2 className="size-2 sm:size-3" />}
    </button>
  )

  // 设置按钮
  const settingsButton = (
    <button
      onClick={() => setSettingsOpen(true)}
      className="hidden sm:block no-drag bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-sm p-1.5 text-gray-400 hover:text-white transition-all duration-200"
      title="设置"
    >
      <Settings className="size-2 sm:size-3" />
    </button>
  )

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2">
        <div className={`relative drag ${windowMode === 'standard' ? '' : ''}`}>
          <AppTabs
            value={activeTab}
            onValueChange={setActiveTab}
            tabs={tabs}
            tabListClassName="no-drag"
            tabListLayout={windowMode === 'standard' ? 'space-between' : 'center'}
            beforeTabList={toggleButton}
            afterTabList={windowMode === 'standard' ? settingsButton : null}
            enableAnimation
          />
        </div>

        {/* 设置抽屉 */}
        <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DrawerContent className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-white/10">
            <DrawerTitle className="sr-only">设置</DrawerTitle>
            <SettingsPage />
            <DrawerClose />
          </DrawerContent>
        </Drawer>
      </div>
    </div>

  )
}

export default App
