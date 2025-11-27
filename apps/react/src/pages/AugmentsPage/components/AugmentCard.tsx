import { memo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui'
import { Augment } from '@/components'
import { useGlobalStore } from '@/store/globalStore'

interface AugmentCardProps {
  id?: string
}

/**
 * 简洁式强化符文卡片组件
 * 只显示符文图标和名称
 */
export const AugmentCard = memo(({ id }: AugmentCardProps) => {
  const { lookupsIndex } = useGlobalStore()

  if (!id) {
    return null
  }

  const augment = lookupsIndex.augmentsById[id]

  if (!augment) {
    return null
  }

  const processedDesc = ((): string => {
    let d = String(augment.desc ?? '')
    const vars = augment.variable_matches ?? []
    vars.forEach((v) => {
      if (!v?.full_match)
        return
      const t = String(v.type ?? '').toLowerCase()
      const base = typeof v.value === 'number' ? v.value : undefined
      let start = 0
      while (true) {
        const idx = d.indexOf(v.full_match, start)
        if (idx === -1)
          break
        const nextChar = d[idx + v.full_match.length]
        if (t === 'multiplier' && typeof base === 'number') {
          const multRaw = String(v.multiplier ?? '1')
          const hasPercent = /%/.test(multRaw)
          const mult = Number.parseFloat(multRaw) || 1
          const result = base * mult
          const formatted = Number.isFinite(result) ? (Math.round(result * 100) / 100) : result
          const appendPercent = hasPercent && nextChar !== '%'
          const text = appendPercent ? `${formatted}%` : String(formatted)
          d = `${d.slice(0, idx)}${text}${d.slice(idx + v.full_match.length)}`
          start = idx + String(text).length
        }
        else {
          const text = base !== undefined ? String(base) : ''
          d = `${d.slice(0, idx)}${text}${d.slice(idx + v.full_match.length)}`
          start = idx + String(text).length
        }
      }
    })
    d = d.replace(/%i:[^%]+%/g, '')
    d = d.replace(/<br\s*\/?>/gi, '\n')
    d = d.replace(/<rules>([\s\S]*?)<\/rules>/gi, '$1')
    d = d.replace(/\([^)]*@TFTUnitProperty[^)]*\)/g, '')
    d = d.replace(/(^|\n)[^\n]*@TFTUnitProperty[^@]*@.*(?=\n|$)/g, '')
    d = d.replace(/@TFTUnitProperty[^@]*@/g, '')
    d = d.replace(/\n{2,}/g, '\n')
    d = d.replace(/\s+/g, match => match.length > 1 ? ' ' : match)
    d = d.trim()
    return d
  })()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="group relative overflow-hidden rounded-lg border border-white/5 bg-linear-to-br from-white/[0.07] to-white/2 p-2 transition-all hover:border-white/10 hover:from-white/12 hover:to-white/5 hover:shadow-lg hover:shadow-black/20">
          <div className="flex justify-center mb-1">
            <Augment
              className="size-8!"
              id={id}
              showTooltip={false}
              wrapperClassName="flex-col gap-2"
              renderExtra={augment => (
                <div className="text-center text-xs font-medium text-white w-full truncate">
                  {augment.name}
                </div>
              )}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-black/95 border-white/10 text-white" side="right" align="start">
        <div className="space-y-1.5">
          <div className="text-sm font-medium">{augment.name}</div>
          <div className="text-xs text-gray-200 leading-snug whitespace-pre-line">{processedDesc}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
})

AugmentCard.displayName = 'AugmentCard'
