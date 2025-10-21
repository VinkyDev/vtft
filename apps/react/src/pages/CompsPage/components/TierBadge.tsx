import { memo } from 'react'
import { getTierBgColor } from '@/utils/tier'

interface TierBadgeProps {
  tier: string
}

/**
 * Tier 等级徽章组件
 */
export const TierBadge = memo(({ tier }: TierBadgeProps) => {
  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded text-sm font-bold shadow-lg ${getTierBgColor(tier)}`}>
      {tier}
    </div>
  )
})

TierBadge.displayName = 'TierBadge'
