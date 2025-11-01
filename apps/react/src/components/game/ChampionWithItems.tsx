import type { Champion } from 'types'
import { memo } from 'react'
import { Champion as ChampionComponent } from './Champion'
import { Item } from './Item'

interface ChampionWithItemsProps {
  /** 阵容中的英雄数据 */
  champion: Champion
  /** 英雄尺寸 */
  championSize?: 'small' | 'medium' | 'large'
  /** 装备尺寸 */
  itemSize?: 'small' | 'medium' | 'large'
  /** 是否显示优先级 */
  showPriority?: boolean
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
}

export const ChampionWithItems = memo(({
  champion,
  championSize = 'medium',
  itemSize = 'small',
  showPriority = true,
  showTooltip = true,
  className = '',
}: ChampionWithItemsProps) => {
  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      <ChampionComponent
        championName={champion.name}
        size={championSize}
        showPriority={showPriority}
        priority={champion.priority}
        showTooltip={showTooltip}
      />

      {champion.items && champion.items.length > 0 && (
        <div className="flex gap-0.5">
          {champion.items.slice(0, 3).map((item, i) => (
            <Item
              key={i}
              itemName={item.name}
              size={itemSize}
              showTooltip={showTooltip}
            />
          ))}
        </div>
      )}
    </div>
  )
})

ChampionWithItems.displayName = 'ChampionWithItems'
