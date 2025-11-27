import type { ReactNode } from 'react'
import type { LookupsUnit } from 'types'
import { memo, useMemo } from 'react'

import { cn } from 'utils'
import { useGlobalStore } from '@/store/globalStore'
import { getChampionCostColor } from '@/utils/styles'
import { WithTooltip } from '../common/WithTooltip'
import { Item } from './Item'

const genIcon = (id: string) => `https://cdn.metatft.com/cdn-cgi/image/width=48,height=48,format=auto/https://cdn.metatft.com/file/metatft/champions/${id.toLowerCase().trim()}.png`

interface ChampionProps {
  id: string
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 额外的样式 */
  style?: React.CSSProperties
  /** 装备列表（可选，用于显示英雄携带的装备） */
  items?: string[]
  /** 是否显示英雄名称（开启后无 hover 效果） */
  showName?: boolean
  /** 包装类 */
  wrapperClassName?: string
  /** 额外的渲染内容 */
  renderExtra?: (unit: LookupsUnit) => ReactNode
}

export const Champion = memo(({
  id,
  showTooltip = false,
  className = '',
  style,
  items,
  showName = false,
  wrapperClassName,
  renderExtra,
}: ChampionProps) => {
  const { lookupsIndex } = useGlobalStore()

  const champion = useMemo(() => {
    return lookupsIndex.unitsById[id]
  }, [lookupsIndex, id])

  if (!champion) {
    return <>{id}</>
  }

  const costColors = getChampionCostColor(champion.cost || 1)

  const shouldShowTooltip = showTooltip && !showName

  const championElement = (
    <div
      className={cn(
        'relative overflow-hidden rounded border-2 bg-black/40 transition-all',
        costColors.border,
        showName ? '' : 'hover:shadow-lg cursor-pointer',
        className,
      )}
      style={style}
    >
      <img
        src={genIcon(id)}
        alt={champion.name}
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  )

  const championWithTooltip = (
    <>
      <WithTooltip
        show={shouldShowTooltip}
        content={(
          <div className="space-y-1">
            <span className="font-semibold">{champion.name}</span>
          </div>
        )}
      >
        {championElement}
      </WithTooltip>
      {showName && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10">
          <div
            className="text-white text-[6px] px-1 whitespace-nowrap"
            style={{
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
            }}
          >
            {champion.name}
          </div>
        </div>
      )}
    </>

  )

  if (!items || items.length === 0) {
    return (
      <div className={cn('flex relative items-center justify-center', wrapperClassName)}>
        {championWithTooltip}
        {renderExtra?.(champion)}
      </div>
    )
  }

  return (
    <div className={cn('relative', wrapperClassName)}>
      <div className="relative w-full h-full">
        {championWithTooltip}
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex">
          {items.slice(0, 3).map(item => (
            <Item
              className="sm:size-3.5 size-2.5"
              id={item}
              key={item}
              showTooltip={showTooltip}
            />
          ))}
        </div>
      </div>

      {renderExtra?.(champion)}
    </div>
  )
})

Champion.displayName = 'Champion'
