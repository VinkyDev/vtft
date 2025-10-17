import type { GroupedComps } from '../../../utils/compRating'
import { ChevronRightIcon } from 'lucide-react'
import { memo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from 'ui'
import { CompCard } from './CompCard'

interface TierSectionProps {
  group: GroupedComps
}

export const TierSection = memo(({ group }: TierSectionProps) => {
  return (
    <div className="space-y-1.5">
      {/* 普通阵容 */}
      {group.normal.map(comp => (
        <CompCard key={`${comp.rank}-${comp.name}`} comp={comp} />
      ))}

      {/* 低出场率阵容 */}
      {group.lowPickrate.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="low-pickrate" className="border-0">
            <AccordionTrigger className="group rounded-md border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 transition-all hover:border-amber-500/30 hover:bg-amber-500/10 hover:no-underline">
              <div className="relative w-full flex items-center gap-2">
                <ChevronRightIcon className="inline-block size-4 text-amber-500 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                <span className="text-xs font-medium text-amber-300">
                  低出场率阵容
                </span>
                <Badge variant="outline" className="h-4 border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] text-amber-400">
                  {group.lowPickrate.length}
                </Badge>
                <span className="absolute right-2 text-[10px] text-gray-500 group-data-[state=open]:hidden">
                  展开
                </span>
                <span className="absolute right-2 text-[10px] text-gray-500 group-data-[state=closed]:hidden">
                  收起
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1.5 pt-1.5 pb-0">
              {group.lowPickrate.map(comp => (
                <CompCard key={`${comp.rank}-${comp.name}`} comp={comp} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
})

TierSection.displayName = 'TierSection'
