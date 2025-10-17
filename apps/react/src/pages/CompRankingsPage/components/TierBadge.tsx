import { memo } from 'react'

interface TierBadgeProps {
  tier: string
}

const tierColors: Record<string, string> = {
  S: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
  A: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
  B: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
  C: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
  D: 'bg-gradient-to-br from-gray-400 to-gray-500 text-white',
}

export const TierBadge = memo(({ tier }: TierBadgeProps) => {
  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded text-sm font-bold shadow-lg ${tierColors[tier] || tierColors.D}`}>
      {tier}
    </div>
  )
})

TierBadge.displayName = 'TierBadge'
