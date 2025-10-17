import type { GroupedComps } from '../../utils/compRating'
import { useRequest } from 'ahooks'
import { useMemo } from 'react'
import { ScrollArea } from 'ui'
import { queryComps } from '../../api'
import { processComps } from '../../utils/compRating'
import { TierSection } from './components'

/**
 * 阵容排行页
 */
export function CompRankingsPage() {
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

  return (
    <ScrollArea className="h-[calc(100vh-68px)]" type="scroll">
      <div className="flex flex-col gap-1.5 px-2">
        {groupedComps.map(group => (
          <TierSection key={group.tier} group={group} />
        ))}
      </div>
    </ScrollArea>
  )
}
