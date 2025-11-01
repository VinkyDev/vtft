import type { EnhancedCompData, GroupedComps } from '@/utils/compRating'
import { useRequest } from 'ahooks'
import { useMemo, useState } from 'react'
import { ScrollArea } from 'ui'
import { queryComps } from '@/api-client'
import { CompPageSkeleton } from '@/components'
import { CompDetailPage } from '@/pages/CompDetailsPage'
import { processComps } from '@/utils/compRating'
import { TierSection } from './components'

function CompRankingsPage() {
  const [selectedComp, setSelectedComp] = useState<EnhancedCompData | null>(null)

  const { data, loading } = useRequest(
    queryComps,
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
        {loading
          ? (
              <CompPageSkeleton />
            )
          : (
              <div className="flex flex-col gap-1.5 px-2">
                {groupedComps.map(group => (
                  <TierSection key={group.tier} group={group} onCompClick={handleCompClick} />
                ))}
              </div>
            )}
      </ScrollArea>

      <CompDetailPage key={selectedComp?.compId} comp={selectedComp} onClose={handleCloseDetail} />
    </>
  )
}

export default CompRankingsPage
