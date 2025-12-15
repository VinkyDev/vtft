import { memo } from 'react'
import { useGlobalStore } from '@/store/globalStore'

interface ChampionNameProps {
  id: string
}

export const ChampionName = memo(({ id }: ChampionNameProps) => {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const name = unitsById[id]?.name ?? ''

  return (
    <div
      className="text-[7px] sm:text-[8px] text-gray-300 text-center w-full truncate px-0.5 leading-tight mt-0.5"
      title={name}
    >
      {name}
    </div>
  )
})

ChampionName.displayName = 'ChampionName'
