import type { ReactNode } from 'react'
import type { Item as ItemMeta } from 'types'
import { memo, useMemo } from 'react'
import { cn } from 'utils'
import { useGlobalStore } from '@/store/globalStore'
import { WithTooltip } from '../common/WithTooltip'

interface ItemProps {
  id: string
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 样式类 */
  className?: string
  /** 包装类 */
  wrapperClassName?: string
  /** 点击回调 */
  onClick?: (item: ItemMeta) => void
  /** 额外的渲染内容 */
  renderExtra?: (item: ItemMeta) => ReactNode
}

const getIcon = (apiName: string) => `https://cdn.metatft.com/cdn-cgi/image/width=48,height=48,format=auto/https://cdn.metatft.com/file/metatft/items/${apiName.toLowerCase()}.png`

export const Item = memo(({
  id,
  showTooltip = true,
  className = '',
  wrapperClassName = '',
  renderExtra,
  onClick,
}: ItemProps) => {
  const itemsById = useGlobalStore(s => s.lookupsIndex.itemsById)
  const item = useMemo(() => itemsById[id], [itemsById, id])

  if (!item) {
    return <>{id}</>
  }

  const itemElement = (
    <div
      className={cn('object-cover rounded-xs border-[0.6px] border-gray-600 bg-black/60', className)}
    >
      <img
        src={getIcon(id)}
        alt=""
        className="h-full w-full object-cover rounded"
        loading="lazy"
        draggable={false}
      />
    </div>
  )

  return (
    <div className={cn('flex relative items-center justify-center w-full', wrapperClassName)} onClick={() => onClick?.(item)}>
      <WithTooltip
        show={showTooltip}
        side="bottom"
        content={(
          <div className="space-y-1 text-xs">
            <span className="font-semibold">{item.name}</span>
          </div>
        )}
      >
        {itemElement}
      </WithTooltip>
      {renderExtra?.(item)}
    </div>
  )
})

Item.displayName = 'Item'
