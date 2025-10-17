import { useMount } from 'ahooks'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui'
import { AugmentsPage } from './pages/AugmentsPage'
import { ChampionsPage } from './pages/ChampionsPage'
import { CompRankingsPage } from './pages/CompRankingsPage'
import { ItemsPage } from './pages/ItemsPage'
import { useGameDataStore } from './store'

function App() {
  const [activeTab, setActiveTab] = useState('comps')
  const { fetchChampions, fetchItems, fetchAugments } = useGameDataStore()

  useMount(() => {
    fetchChampions()
    fetchItems()
    fetchAugments()
  })

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center drag">
            <TabsList className="bg-black/30 border border-white/20 h-8 p-1 no-drag">
              <TabsTrigger
                value="comps"
                className="h-6 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
              >
                阵容
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="h-6 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
              >
                装备
              </TabsTrigger>
              <TabsTrigger
                value="champions"
                className="h-6 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
              >
                英雄
              </TabsTrigger>
              <TabsTrigger
                value="augments"
                className="h-6 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
              >
                符文
              </TabsTrigger>
            </TabsList>
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
      </div>
    </div>

  )
}

export default App
