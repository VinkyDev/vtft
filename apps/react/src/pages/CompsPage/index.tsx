import type { EnhancedCompData, GroupedComps } from '@/utils/compRating'
import { getComps } from 'api-client'
import { useMemo, useState } from 'react'
import { useRequest } from 'react-helper'
import { ScrollArea } from 'ui'
import { CompPageSkeleton } from '@/components'
import { useGlobalStore } from '@/store/globalStore'
import { processComps } from '@/utils/compRating'
import CompDetailPage from '../CompDetailsPage'
import { TierSection } from './components'

function CompRankingsPage() {
  const season = useGlobalStore(s => s.curSeason)
  const globalLoading = useGlobalStore(s => s.loading)

  const { data, loading } = useRequest(
    async () => {
      const res = await getComps({ season })
      return res.data
    },
    {
      cacheKey: `comps:${season}`,
      staleTime: 60_000,
      refreshDeps: [season],
      ready: Boolean(season),
    },
  )

  const groupedComps = useMemo<GroupedComps[]>(() => {
    if (!data)
      return []
    return processComps(data)
  }, [data])

  const [selectedComp, setSelectedComp] = useState<EnhancedCompData | null>(null)

  const handleCompClick = (comp: EnhancedCompData) => {
    setSelectedComp(comp)
  }

  const handleCloseDetail = () => {
    setSelectedComp(null)
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-58px)] sm:h-[calc(100vh-68px)]" type="scroll">
        {loading || globalLoading
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
