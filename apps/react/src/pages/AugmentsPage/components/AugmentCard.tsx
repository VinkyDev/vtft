import type { AugmentMeta } from 'types'
import { memo } from 'react'
import { Augment } from '@/components'

interface AugmentCardProps {
  augment: AugmentMeta
}

/**
 * 简洁式强化符文卡片组件
 * 只显示符文图标和名称
 */
export const AugmentCard = memo(({ augment }: AugmentCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2 transition-all hover:border-white/10 hover:from-white/[0.12] hover:to-white/[0.05] hover:shadow-lg hover:shadow-black/20">
      {/* 符文图标 */}
      <div className="flex justify-center mb-2">
        <div className="relative overflow-hidden rounded border border-white/10 bg-black/20">
          <Augment className="!size-8" augmentName={augment.name} showTooltip={false} />
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
