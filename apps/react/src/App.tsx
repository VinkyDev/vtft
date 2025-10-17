import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui'
import { CompRankingsPage } from './pages/CompRankingsPage'
import { ItemsPage } from './pages/ItemsPage'

function App() {
  const [activeTab, setActiveTab] = useState('comps')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-2">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="comps" className="data-[state=inactive]:text-gray-400">阵容</TabsTrigger>
            <TabsTrigger value="items" className="data-[state=inactive]:text-gray-400">装备</TabsTrigger>
            <TabsTrigger value="champions" className="data-[state=inactive]:text-gray-400">英雄</TabsTrigger>
          </TabsList>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${['comps', 'items', 'champions'].indexOf(activeTab) * 100}%)` }}>
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
                <div className="flex items-center justify-center py-20">
                  <p className="text-gray-400 text-lg">英雄页面开发中...</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export default App
