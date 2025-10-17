import type { Champion } from 'types'
import { memo } from 'react'
import { ChampionWithItems } from '../../../components'

interface ChampionIconProps {
  champion: Champion
}

/**
 * 英雄图标组件
 * 重构为使用通用的 ChampionWithItems 组件
 */
export const ChampionIcon = memo(({ champion }: ChampionIconProps) => {
  return (
    <ChampionWithItems
      champion={champion}
      championSize="medium"
      itemSize="small"
      showPriority={true}
      showTooltip={true}
    />
  )
})

ChampionIcon.displayName = 'ChampionIcon'
