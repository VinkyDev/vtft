import { useMount } from 'ahooks'
import logger from 'logger'
import { withRetry } from 'utils'
import { useGameDataStore } from '@/store/dataStore'

export function useDataInit() {
  const { fetchChampions, fetchItems, fetchAugments } = useGameDataStore()

  useMount(() => {
    const loadChampions = withRetry(fetchChampions)
    const loadItems = withRetry(fetchItems)
    const loadAugments = withRetry(fetchAugments)

    // 并行加载游戏数据，失败时记录错误但不阻塞应用启动
    Promise.all([
      loadChampions().catch(err => logger.error('加载英雄数据失败:', err)),
      loadItems().catch(err => logger.error('加载装备数据失败:', err)),
      loadAugments().catch(err => logger.error('加载强化符文数据失败:', err)),
    ]).catch((error) => {
      console.error('数据初始化失败:', error)
    })
  })
}
