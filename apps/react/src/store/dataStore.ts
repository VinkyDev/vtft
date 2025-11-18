import type { AugmentMeta, ChampionMeta, ItemMeta } from 'types'
import { queryAugments, queryChampions, queryItems } from 'api-client'
import logger from 'logger'
import { create } from 'zustand'

export * from './configStore'

interface GameDataState {
  // 英雄数据
  champions: ChampionMeta[]
  championsLoading: boolean

  // 装备数据
  items: ItemMeta[]
  itemsLoading: boolean

  // 强化符文数据
  augments: AugmentMeta[]
  augmentsLoading: boolean

  // Actions
  fetchChampions: () => Promise<void>
  fetchItems: () => Promise<void>
  fetchAugments: () => Promise<void>
  resetChampions: () => void
  resetItems: () => void
  resetAugments: () => void
}

/**
 * 全局游戏数据 store
 * 包含英雄、装备和强化符文数据的管理
 */
export const useGameDataStore = create<GameDataState>((set, get) => ({

  champions: [],
  championsLoading: false,

  items: [],
  itemsLoading: false,

  augments: [],
  augmentsLoading: false,

  // 获取英雄数据
  fetchChampions: async () => {
    const state = get()
    if (state.championsLoading)
      return

    set({ championsLoading: true })
    try {
      const response = await queryChampions()
      set({
        champions: response.data,
        championsLoading: false,
      })
    }
    catch (error) {
      logger.error('获取英雄数据失败:', error as Error)
      set({
        champions: [],
        championsLoading: false,
      })
      throw error
    }
  },

  // 获取装备数据
  fetchItems: async () => {
    const state = get()
    if (state.itemsLoading)
      return

    set({ itemsLoading: true })
    try {
      const response = await queryItems()
      set({
        items: response.data,
        itemsLoading: false,
      })
    }
    catch (error) {
      logger.error('获取装备数据失败:', error as Error)
      set({
        items: [],
        itemsLoading: false,
      })
      throw error
    }
  },

  // 获取强化符文数据
  fetchAugments: async () => {
    const state = get()
    if (state.augmentsLoading)
      return

    set({ augmentsLoading: true })
    try {
      const response = await queryAugments()
      set({
        augments: response.data,
        augmentsLoading: false,
      })
    }
    catch (error) {
      logger.error('获取强化符文数据失败:', error as Error)
      set({
        augments: [],
        augmentsLoading: false,
      })
      throw error
    }
  },

  // 重置英雄数据
  resetChampions: () => {
    set({
      champions: [],
      championsLoading: false,
    })
  },

  // 重置装备数据
  resetItems: () => {
    set({
      items: [],
      itemsLoading: false,
    })
  },

  // 重置强化符文数据
  resetAugments: () => {
    set({
      augments: [],
      augmentsLoading: false,
    })
  },
}))
