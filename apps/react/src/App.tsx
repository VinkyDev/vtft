import { useState } from 'react'
import { AppTabs, FloatingBallMode, GlobalErrorBoundary, SettingsMenu } from '@/components'
import { useDataInit } from '@/hooks/useDataInit'
import { routes } from '@/routes'
import { useConfigStore } from '@/store/dataStore'

function App() {
  const [activeTab, setActiveTab] = useState('comps')
  const { windowMode } = useConfigStore()

  // 初始化游戏数据
  useDataInit()

  return (
    <GlobalErrorBoundary>
      <div className={`overflow-hidden ${windowMode === 'floating' ? 'rounded-full' : 'rounded-2xl'}`}>
        <div className={`min-h-screen ${windowMode === 'floating' ? '' : 'bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-2'}`}>
          <div
            className="flex items-center justify-center h-screen z-60 pointer-events-auto"
            style={{ display: windowMode === 'floating' ? 'flex' : 'none' }}
            onClick={e => e.stopPropagation()}
          >
            <FloatingBallMode />
          </div>

          <div
            className="relative"
            style={{ display: windowMode !== 'floating' ? 'block' : 'none' }}
          >
            <AppTabs
              value={activeTab}
              onValueChange={setActiveTab}
              tabs={routes}
              enableAnimation
              afterTabList={<SettingsMenu />}
            />
          </div>
        </div>
      </div>
    </GlobalErrorBoundary>
  )
}

export default App
