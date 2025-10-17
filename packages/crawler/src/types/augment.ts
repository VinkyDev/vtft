/**
 * 强化符文级别
 */
export type AugmentLevel = 'Silver' | 'Gold' | 'Prismatic'

/**
 * 强化符文元数据
 */
export interface AugmentMeta {
  /** 强化符文名称 */
  name: string
  /** 强化符文图标 URL */
  icon: string
  /** 级别（银色/金色/棱彩） */
  level: AugmentLevel
  /** 段位（S/A/B/C/D等） */
  tier?: string
  /** 类型（经济/战斗等） */
  type?: string
}
