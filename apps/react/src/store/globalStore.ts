import type { AugmentClass, Item, ItemName, Lookups, LookupsUnit, Queue, Trait, UnitValue } from 'types'
import { getComps, getLookups, getSeasons, getUnitItems } from 'api-client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

async function buildSeasonData(season: string, queue?: Queue) {
  const [{ data: lookups = null }, { data: comps = [] }, { data: unitItems = null }] = await Promise.all([
    getLookups({ season, queue }),
    getComps({ season }),
    getUnitItems(),
  ])

  const itemNames = unitItems?.itemNames ?? {}
  const units = unitItems?.units ?? {}

  const itemNamesById: Record<string, ItemName> = Object.fromEntries(
    Object.entries(itemNames).map(([key, value]) => [String(value?.itemName ?? key), value]),
  )
  const unitsByIdFromItems: Record<string, UnitValue> = Object.fromEntries(
    Object.entries(units).map(([key, value]) => [String(value?.unit ?? key), value]),
  )
  const itemsById = Object.fromEntries((lookups?.items ?? []).filter(i => i.apiName).map(i => [String(i.apiName), i]))
  const unitsById = Object.fromEntries((lookups?.units ?? []).filter(u => u.apiName).map(u => [String(u.apiName), u]))
  const traitsById = Object.fromEntries((lookups?.traits ?? []).filter(t => t.apiName).map(t => [String(t.apiName), t]))
  const augmentsById = Object.fromEntries((lookups?.augments ?? []).filter(a => a.apiName).map(a => [String(a.apiName), a]))
  const compsUpdatedAt = comps[0]?.updatedAt ?? null

  return {
    lookups,
    lookupsIndex: { itemsById, unitsById, traitsById, augmentsById },
    unitItemsByName: itemNames,
    unitItemsIndex: { itemNamesById, unitsById: unitsByIdFromItems },
    compsUpdatedAt,
  }
}

function resolveSeason(seasons: { season: string, queue: Queue }[], persisted?: string) {
  const isValidSeason = persisted && seasons.some(s => s.season === persisted)
  const season = isValidSeason ? persisted : seasons[0]?.season
  const queue = seasons.find(s => s.season === season)?.queue
  return { season, queue }
}

interface GlobalState {
  lookups: Lookups | null
  lookupsIndex: {
    itemsById: Record<string, Item>
    unitsById: Record<string, LookupsUnit>
    traitsById: Record<string, Trait>
    augmentsById: Record<string, AugmentClass>
  }
  curSeason: string | undefined
  seasons: { season: string, queue: Queue }[]
  loading: boolean
  /** 阵容数据更新时间 */
  compsUpdatedAt: Date | null
  /** 初始化全局状态 */
  initGlobalStore: () => Promise<void>
  /** 强制刷新数据（清除缓存后重新加载） */
  refreshData: () => Promise<void>
  setSeason: (season: string) => Promise<void>
  unitItemsByName: Record<string, ItemName>
  unitItemsIndex: {
    itemNamesById: Record<string, ItemName>
    unitsById: Record<string, UnitValue>
  }
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      curSeason: undefined,
      seasons: [],
      lookups: null,
      lookupsIndex: {
        itemsById: {},
        unitsById: {},
        traitsById: {},
        augmentsById: {},
      },
      loading: true,
      compsUpdatedAt: null,
      unitItemsByName: {},
      unitItemsIndex: {
        itemNamesById: {},
        unitsById: {},
      },
      initGlobalStore: async () => {
        set({ loading: true })
        // 获取所有赛季
        const { data: seasons = [] } = await getSeasons()
        set({ seasons })
        const { season, queue } = resolveSeason(seasons, get().curSeason)
        set({ curSeason: season })
        if (!season)
          return
        const seasonData = await buildSeasonData(season, queue)
        set({ ...seasonData, loading: false })
      },
      refreshData: async () => {
        set({ unitItemsByName: {}, unitItemsIndex: { itemNamesById: {}, unitsById: {} }, compsUpdatedAt: null })
        await get().initGlobalStore()
      },
      setSeason: async (season: string) => {
        if (get().curSeason === season)
          return
        set({ curSeason: season, loading: true })
        const queue = get().seasons.find(s => s.season === season)?.queue
        const seasonData = await buildSeasonData(season, queue)
        set({ ...seasonData, loading: false })
      },
    }),
    {
      name: 'vtft-global-storage',
      partialize: state => ({ curSeason: state.curSeason }),
    },
  ),
)
