import type { ChampionMeta } from 'types'
import { useMemo } from 'react'
import { useGameDataStore } from '@/store'

/**
 * 通过英雄名称获取英雄详细信息
 * @param championName 英雄名称
 * @returns 英雄详细信息，如果未找到则返回 undefined
 */
export function useChampionByName(championName: string | undefined): ChampionMeta | undefined {
  const { champions } = useGameDataStore()

  return useMemo(() => {
    if (!championName)
      return undefined
    return champions.find(champ => champ.name === championName)
  }, [champions, championName])
}
