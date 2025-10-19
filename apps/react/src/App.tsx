import { useMount } from 'ahooks'
import { GlobalShortcut, Window } from 'bridge'
import { Maximize2, Minimize2, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui'
import { AugmentsPage } from '@/pages/AugmentsPage'
import { ChampionsPage } from '@/pages/ChampionsPage'
import { CompRankingsPage } from '@/pages/CompRankingsPage'
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

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* 顶部导航栏 */}
          <div className={`relative px-2 flex items-center drag ${windowMode === 'standard' ? 'justify-between' : 'justify-center'}`}>
            {/* 左侧：窗口模式切换按钮 */}
            <button
              onClick={handleToggleWindowMode}
              className={`no-drag bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-sm p-1.5 text-gray-400 hover:text-white transition-all duration-200 ${windowMode === 'compact' ? 'absolute left-2' : ''}`}
            >
              {windowMode === 'standard' ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>

            {/* 中间：Tab 导航 */}
            <TabsList className="bg-black/30 border border-white/20 h-9 p-1 no-drag">
              <TabsTrigger
                value="comps"
                className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
              >
                阵容
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
              >
                装备
              </TabsTrigger>
              <TabsTrigger
                value="champions"
                className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
              >
                英雄
              </TabsTrigger>
              <TabsTrigger
                value="augments"
                className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
              >
                符文
              </TabsTrigger>
            </TabsList>

            {/* 右侧：设置按钮（仅标准模式显示） */}
            {windowMode === 'standard' && (
              <button
                onClick={() => setSettingsOpen(true)}
                className="no-drag bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-sm p-1.5 text-gray-400 hover:text-white transition-all duration-200"
                title="设置"
              >
                <Settings size={12} />
              </button>
            )}
          </div>

          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${['comps', 'items', 'champions', 'augments'].indexOf(activeTab) * 100}%)` }}>
              <TabsContent value="comps" className="min-w-full shrink-0" forceMount>
                <div
                  className="transition-opacity duration-300"
                  style={{ opacity: activeTab === 'comps' ? 1 : 0, pointerEvents: activeTab === 'comps' ? 'auto' : 'none' }}
                >
                  <CompRankingsPage />
                </div>
              </TabsContent>

              <TabsContent value="items" className="min-w-full shrink-0" forceMount>
                <div
                  className="transition-opacity duration-300"
                  style={{ opacity: activeTab === 'items' ? 1 : 0, pointerEvents: activeTab === 'items' ? 'auto' : 'none' }}
                >
                  <ItemsPage />
                </div>
              </TabsContent>

              <TabsContent value="champions" className="min-w-full shrink-0" forceMount>
                <div
                  className="transition-opacity duration-300"
                  style={{ opacity: activeTab === 'champions' ? 1 : 0, pointerEvents: activeTab === 'champions' ? 'auto' : 'none' }}
                >
                  <ChampionsPage />
                </div>
              </TabsContent>

              <TabsContent value="augments" className="min-w-full shrink-0" forceMount>
                <div
                  className="transition-opacity duration-300"
                  style={{ opacity: activeTab === 'augments' ? 1 : 0, pointerEvents: activeTab === 'augments' ? 'auto' : 'none' }}
                >
                  <AugmentsPage />
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>

        {/* 设置抽屉 */}
        <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DrawerContent className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-white/10">
            <SettingsPage />
            <DrawerClose />
          </DrawerContent>
        </Drawer>
      </div>
    </div>

  )
}

export default App
