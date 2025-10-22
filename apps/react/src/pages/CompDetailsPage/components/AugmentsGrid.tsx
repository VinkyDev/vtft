import type { Augment } from 'types'
import { memo } from 'react'
import { ScrollArea } from 'ui'
import { Augment as AugmentComponent } from '@/components'

interface AugmentCardProps {
  augment: Augment
}

/**
 * 符文卡片组件
 * 展示单个符文的信息，样式与 AugmentsPage 保持一致
 */
const AugmentCard = memo(({ augment }: AugmentCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2 transition-all hover:border-white/10 hover:from-white/[0.12] hover:to-white/[0.05] hover:shadow-lg hover:shadow-black/20">
      {/* 符文图标 */}
      <div className="flex justify-center mb-2">
        <div className="relative overflow-hidden rounded border border-white/10 bg-black/20">
          <AugmentComponent className="!size-8" augmentName={augment.name} showTooltip={true} />
        </div>
      </div>

      {/* 符文名称 */}
      <div className="text-center">
        <h3 className="text-xs font-medium text-white truncate">
          {augment.name}
        </h3>
      </div>

      {/* Hover 高光效果 */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  )
})

AugmentCard.displayName = 'AugmentCard'

interface AugmentsGridProps {
  augments: Augment[]
}

/**
 * 符文列表组件
 * 展示阵容推荐的符文
 */
export const AugmentsGrid = memo(({ augments }: AugmentsGridProps) => {
  if (!augments || augments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">暂无符文推荐</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[calc(100vh-50px)] sm:h-[calc(100vh-60px)]" type="scroll">
        <div className="p-4">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            }}
          >
            {augments.map((augment, index) => (
              <AugmentCard key={`${augment.name}-${index}`} augment={augment} />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})

AugmentsGrid.displayName = 'AugmentsGrid'
