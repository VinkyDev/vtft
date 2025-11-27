import type { Trait as TraitMeta } from 'types'
import { memo, useMemo } from 'react'
import { useGlobalStore } from '@/store/globalStore'
import { WithTooltip } from '../common/WithTooltip'

interface TraitProps {
  id: string
  /** 显示变体：icon-only 只显示图标(默认), with-label 显示图标+名称+等级 */
  variant?: 'icon-only' | 'with-label'
  /** 是否显示工具提示 */
  showTooltip?: boolean
  /** 额外的样式类 */
  className?: string
  /** 点击回调 */
  onClick?: (trait: TraitMeta) => void
}

const genIcon = (apiName: string) => `https://cdn.metatft.com/file/metatft/traits/${apiName.toLowerCase().trim()}.png`

type Parse<T extends string>
  = T extends `${infer ApiName}_${infer N extends number}`
    ? { apiName: ApiName, traitName: string, count: N }
    : { apiName: T, traitName: string, count?: number }

function parse<T extends string>(str: T): Parse<T> {
  const parts = str.split('_')
  const last = parts[parts.length - 1]
  const hasCount = /^\d+$/.test(last!)
  const apiName = hasCount ? parts.slice(0, -1).join('_') : str
  const apiParts = apiName.split('_')
  const traitName = apiParts[apiParts.length - 1]
  const count = hasCount ? Number(last) : undefined
  return { apiName, traitName, count } as Parse<T>
}

export const Trait = memo(({
  id,
  variant = 'icon-only',
  showTooltip = true,
  className = '',
  onClick,
}: TraitProps) => {
  const { lookupsIndex } = useGlobalStore()
  const { apiName, traitName, count } = useMemo(() => parse(id), [id])
  const trait = useMemo(() => lookupsIndex.traitsById[apiName], [apiName, lookupsIndex])

  if (!trait) {
    return <>{id}</>
  }

  // 图标元素
  const iconElement = (
    <>
      <img
        src={genIcon(traitName)}
        alt={trait.name}
        draggable={false}
        className="h-full w-full object-contain"
      />
      {count != null && (
        <div className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-sm text-[8px] font-bold text-white shadow-lg">
          {count}
        </div>
      )}
    </>
  )

  // icon-only 变体: 小屏幕显示图标+tooltip, 正常屏幕显示图标+名字
  if (variant === 'icon-only') {
    const traitElement = (
      <div
        className={`relative h-5 w-5 overflow-hidden rounded border border-white/10 bg-black/30 p-0.5 transition-all hover:border-white/30 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={() => onClick?.(trait)}
      >
        {iconElement}
      </div>
    )

    return (
      <WithTooltip
        show={showTooltip}
        side="top"
        content={(
          <div className="space-y-1 text-xs">
            <span className="font-semibold">
              {trait.name}
            </span>
          </div>
        )}
      >
        {traitElement}
      </WithTooltip>
    )
  }

  return (
    <>
      <WithTooltip
        show={showTooltip}
        side="top"
        content={(
          <div className="space-y-1 text-xs">
            <span className="font-semibold">
              {trait.name}
            </span>
          </div>
        )}
      >
        <div
          className={`sm:hidden relative h-5 w-5 overflow-hidden rounded border border-white/10 bg-black/30 p-0.5 transition-all hover:border-white/30 hover:shadow-lg ${onClick ? 'cursor-pointer' : ''} ${className}`}
          onClick={() => onClick?.(trait)}
        >
          {iconElement}
        </div>
      </WithTooltip>

      <div
        className={`hidden sm:flex items-center gap-1.5 rounded border border-white/10 bg-black/30 px-2 py-1 transition-all hover:border-white/30 hover:shadow-lg shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={() => onClick?.(trait)}
      >
        <div className="relative h-5 w-5 overflow-hidden rounded shrink-0">
          {iconElement}
        </div>
        <span className="text-xs font-medium text-white/90 whitespace-nowrap">{trait.name}</span>
        {count != null && (
          <span className="text-xs font-bold text-white whitespace-nowrap">
            {count}
          </span>
        )}
      </div>
    </>
  )
})

Trait.displayName = 'Trait'
