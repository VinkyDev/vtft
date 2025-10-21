import type { ItemMeta } from 'types'
import { useMemo } from 'react'
import { useGameDataStore } from '@/store'

/**
 * 通过装备名称获取装备详细信息
 * @param itemName 装备名称
 * @returns 装备详细信息，如果未找到则返回 undefined
 */
export function useItemByName(itemName: string | undefined): ItemMeta | undefined {
  const { items } = useGameDataStore()

  return useMemo(() => {
    if (!itemName)
      return undefined
    return items.find(item => item.name === itemName)
  }, [items, itemName])
}
