import type { AugmentMeta, ChampionMeta, ItemMeta } from 'types'
import { create } from 'zustand'
import { queryAugments } from '../api/augments'
import { queryChampions } from '../api/champions'
import { queryItems } from '../api/items'

interface GameDataState {
  // 英雄数据
  champions: ChampionMeta[]
  championsLoading: boolean
  championsError: string | null

  // 装备数据
  items: ItemMeta[]
  itemsLoading: boolean
  itemsError: string | null

  // 强化符文数据
  augments: AugmentMeta[]
  augmentsLoading: boolean
  augmentsError: string | null

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
  // 初始状态
  champions: [],
  championsLoading: false,
  championsError: null,

  items: [],
  itemsLoading: false,
  itemsError: null,

  augments: [],
  augmentsLoading: false,
  augmentsError: null,

  // 获取英雄数据
  fetchChampions: async () => {
    if (get().championsLoading)
      return

    set({ championsLoading: true, championsError: null })
    try {
      const response = await queryChampions()
      set({
        champions: response.data,
        championsLoading: false,
        championsError: null,
      })
    }
    catch (error) {
      set({
        championsLoading: false,
        championsError: error instanceof Error ? error.message : '获取英雄数据失败',
      })
    }
  },

  // 获取装备数据
  fetchItems: async () => {
    if (get().itemsLoading)
      return

    set({ itemsLoading: true, itemsError: null })
    try {
      const response = await queryItems()
      set({
        items: response.data,
        itemsLoading: false,
        itemsError: null,
      })
    }
    catch (error) {
      set({
        itemsLoading: false,
        itemsError: error instanceof Error ? error.message : '获取装备数据失败',
      })
    }
  },

  // 获取强化符文数据
  fetchAugments: async () => {
    if (get().augmentsLoading)
      return

    set({ augmentsLoading: true, augmentsError: null })
    try {
      const response = await queryAugments()
      set({
        augments: response.data,
        augmentsLoading: false,
        augmentsError: null,
      })
    }
    catch (error) {
      set({
        augmentsLoading: false,
        augmentsError: error instanceof Error ? error.message : '获取强化符文数据失败',
      })
    }
  },

  // 重置英雄数据
  resetChampions: () => {
    set({
      champions: [],
      championsLoading: false,
      championsError: null,
    })
  },

  // 重置装备数据
  resetItems: () => {
    set({
      items: [],
      itemsLoading: false,
      itemsError: null,
    })
  },

  // 重置强化符文数据
  resetAugments: () => {
    set({
      augments: [],
      augmentsLoading: false,
      augmentsError: null,
    })
  },
}))
