import type { EnhancedCompData } from '@/utils/compRating'
import { useRequest } from 'ahooks'
import { useState } from 'react'
import { Drawer, DrawerContent, DrawerDescription, DrawerOverlay, DrawerTitle, Spinner, Tabs, TabsContent, TabsList, TabsTrigger } from 'ui'
import { getCompDetails } from '@/api'
import { FormationBoard } from './components'

interface CompDetailPageProps {
  comp: EnhancedCompData | null
  onClose: () => void
}

/**
 * 阵容详情页面
 * 全屏展示阵容的详细信息
 */
export function CompDetailPage({ comp, onClose }: CompDetailPageProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // 获取阵容详情数据
  const { data: compDetails, loading } = useRequest(
    async () => {
      if (!comp?.compId)
        return null
      return await getCompDetails(comp.compId)
    },
    {
      refreshDeps: [comp?.compId],
      ready: !!comp?.compId,
    },
  )

  return (
    <Drawer
      open={!!comp}
      direction="right"
      onOpenChange={(open) => {
        if (!open)
          onClose()
      }}
    >
      <DrawerOverlay className="rounded-2xl" />
      <DrawerContent className="min-h-screen min-w-[85vw] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-none rounded-2xl">
        {/* 可访问性标题 (隐藏) */}
        <DrawerTitle className="sr-only">阵容详情</DrawerTitle>
        <DrawerDescription className="sr-only">
          查看阵容站位和配置信息
        </DrawerDescription>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          )}

          {!loading && comp && compDetails && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              {/* Tab 导航 */}
              <div className="flex justify-center px-6 pt-4">
                <TabsList className="bg-black/30 border border-white/20 h-9 p-1">
                  <TabsTrigger
                    value="overview"
                    className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
                  >
                    概览
                  </TabsTrigger>
                  <TabsTrigger
                    value="items"
                    className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
                  >
                    装备
                  </TabsTrigger>
                  <TabsTrigger
                    value="augments"
                    className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
                  >
                    符文
                  </TabsTrigger>
                  <TabsTrigger
                    value="traits"
                    className="h-7 px-4 text-sm font-medium data-[state=active]:bg-blue-500/80 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 transition-colors"
                  >
                    羁绊
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab 内容 */}
              <div className="flex-1 overflow-auto px-6 py-6">
                <TabsContent value="overview" className="h-full m-0">
                  {compDetails.data.formation
                    ? (
                        <FormationBoard formation={compDetails.data.formation} />
                      )
                    : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400">暂无站位信息</p>
                        </div>
                      )}
                </TabsContent>

                <TabsContent value="items" className="h-full m-0">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">装备信息开发中...</p>
                  </div>
                </TabsContent>

                <TabsContent value="augments" className="h-full m-0">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">符文信息开发中...</p>
                  </div>
                </TabsContent>

                <TabsContent value="traits" className="h-full m-0">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">羁绊信息开发中...</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
