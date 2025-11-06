import { useMount } from 'ahooks'
import { withRetry } from 'utils'
import { useGameDataStore } from '@/store/dataStore'

export function useDataInit() {
  const { fetchChampions, fetchItems, fetchAugments } = useGameDataStore()

  useMount(() => {
    const loadChampions = withRetry(fetchChampions)
    const loadItems = withRetry(fetchItems)
    const loadAugments = withRetry(fetchAugments)

    try {
      Promise.all([
        loadChampions(),
        loadItems(),
        loadAugments(),
      ])
    }
    catch {
      throw new Error('数据初始化失败')
    }
  })
}
