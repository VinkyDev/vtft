import type { EnhancedCompData, GroupedComps } from '@/utils/compRating'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { queryComps } from '@/api-client'
import { CompDetailPage } from '@/pages/CompDetailsPage'
import { processComps } from '@/utils/compRating'
import { TierSection } from './components'

/**
 * 阵容排行页
 */
export function CompRankingsPage() {
  const [selectedComp, setSelectedComp] = useState<EnhancedCompData | null>(null)

  const { data } = useRequest(
    async () => {
      return await queryComps()
    },
  )

  const groupedComps = useMemo<GroupedComps[]>(() => {
    if (!data?.data)
      return []
    return processComps(data.data)
  }, [data])

  const handleCompClick = (comp: EnhancedCompData) => {
    setSelectedComp(comp)
  }

  const handleCloseDetail = () => {
    setSelectedComp(null)
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-58px)] sm:h-[calc(100vh-68px)]" type="scroll">
        <div className="flex flex-col gap-1.5 px-2">
          {groupedComps.map(group => (
            <TierSection key={group.tier} group={group} onCompClick={handleCompClick} />
          ))}
        </div>
      </ScrollArea>

      {/* 阵容详情页面 */}
      <CompDetailPage comp={selectedComp} onClose={handleCloseDetail} />
    </>
  )
}
