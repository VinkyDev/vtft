import type { EnhancedCompData } from '@/utils/compRating'
import { ChevronRightIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { Badge } from 'ui'
import { CompCard } from './CompCard'

interface LowPickrateAccordionProps {
  comps: EnhancedCompData[]
  onCompClick?: (comp: EnhancedCompData) => void
}

/**
 * 低出场率阵容折叠面板
 * 独立组件，用于虚拟化列表中渲染
 */
export const LowPickrateAccordion = memo(({ comps, onCompClick }: LowPickrateAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (comps.length === 0)
    return null

  return (
    <div className="w-full">
      {/* 折叠头部 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group w-full rounded-md border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 transition-all hover:border-amber-500/30 hover:bg-amber-500/10"
      >
        <div className="relative flex w-full items-center gap-2">
          <ChevronRightIcon
            className={`inline-block size-4 text-amber-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
          <span className="text-xs font-medium text-amber-300">
            低出场率阵容
          </span>
          <Badge
            variant="outline"
            className="h-4 border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] text-amber-400"
          >
            {comps.length}
          </Badge>
          <span className="absolute right-2 text-[10px] text-gray-500">
            {isOpen ? '收起' : '展开'}
          </span>
        </div>
      </button>

      {/* 折叠内容 */}
      {isOpen && (
        <div className="space-y-1.5 pt-1.5">
          {comps.map(comp => (
            <CompCard key={comp.id} comp={comp} onClick={onCompClick} />
          ))}
        </div>
      )}
    </div>
  )
})

LowPickrateAccordion.displayName = 'LowPickrateAccordion'

