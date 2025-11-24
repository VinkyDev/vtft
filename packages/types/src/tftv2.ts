export enum Levelling {
  Fast8 = 'Fast 8',
  Fast9 = 'Fast 9',
  Lvl5 = 'lvl 5',
  Lvl6 = 'lvl 6',
  Lvl7 = 'lvl 7',
  Standard = 'Standard',
}

export enum Trend {
  Up = 'up',
  Down = 'down',
  Steady = 'steady',
}

export interface Build {
  /** 阵容构建匹配次数 */
  count?: number
  /** 阵容构建平均排名 */
  avg?: number
  /** 阵容构建单位 */
  unit?: string
  /** 阵容构建装备 */
  buildName?: string[]
}

export interface Comp {
  /** 阵容所属集群ID */
  clusterId: number
  /** 阵容ID */
  id: number
  /** 阵容单位 */
  units?: string[]
  /** 阵容羁绊 */
  traits?: string[]
  /** 阵容名称 */
  name?: string

  /** 阵容选取率 */
  pickRate?: number
  /** 阵容平均排名 */
  avg?: number
  /** 阵容第一率 */
  firstRate?: number
  /** 阵容前四率 */
  top4Rate?: number

  /** 阵容3星单位 */
  stars?: string[]
  /** 阵容4星单位 */
  stars_4?: string[]

  /** 阵容构建 */
  builds?: Build[]

  /** 阵容等级 */
  levelling?: Levelling
}

export interface Counter {
  against?: number
  place_change?: number
  similarity?: number
}

export interface FinalLevel {
  level?: string
  count?: number
  avg?: number
}

export interface Unit {
  count?: number
  avg?: number
  units?: string
  place_change?: number
  unit_pick?: number
  item_pick?: number
}

export interface CompItem {
  itemNames: string
  count?: number
  avg?: number
  pcnt?: number
  units?: Unit[]
}

export interface Positioning {
  unit?: string
  position?: number
}

export interface Option {
  unit_list?: string
  count?: number
  avg?: number
  win?: number
}

export interface CompDetail {
  /** 阵容ID */
  id?: number
  /** 克制关系 */
  counters?: Counter[]
  /** 阵容最终等级 */
  final_level?: FinalLevel[]
  /** 阵容装备 */
  item?: CompItem[]
  /** 阵容趋势 */
  trends?: Trend
  /** 阵容站位 */
  positioning?: Positioning[]
  /** 阵容早期选项 */
  early_options?: Record<string, Option[]>
  /** 阵容后期选项 */
  options?: Record<string, Option[]>
}
