import { useCallback, useMemo } from 'react'
import { useGlobalStore } from '@/store/globalStore'

/**
 * 英雄工具函数hook
 * 提供排序和阵容代码生成功能
 *
 * @returns 包含排序函数和生成阵容代码函数的对象
 *
 * @example
 * ```tsx
 * const { sortUnitsByCost, generateCompCode } = useUnitsUtils()
 * const sortedUnits = sortUnitsByCost(['TFT_Champion1', 'TFT_Champion2'])
 * const code = generateCompCode(['TFT_Champion1', 'TFT_Champion2'])
 * ```
 */
export function useUnitsUtils() {
  const unitsById = useGlobalStore(s => s.lookupsIndex.unitsById)
  const curSeason = useGlobalStore(s => s.curSeason)

  // 从赛季字符串提取TFTSet标识（如 "s15" -> "TFTSet15"）
  const tftSetIdentifier = useMemo(() => {
    if (!curSeason)
      return 'TFTSet15' // 默认值
    // 从 "s15" 或 "s16" 等格式中提取数字
    const match = curSeason.match(/s(\d+)/i)
    if (match) {
      return `TFTSet${match[1]}`
    }
    return 'TFTSet15' // 默认值
  }, [curSeason])

  /**
   * 按cost排序英雄
   * @param units 英雄ID数组
   * @returns 排序后的英雄ID数组
   */
  const sortUnitsByCost = useCallback((units: string[]): string[] => {
    if (!units || units.length === 0)
      return []

    return [...units].sort((a, b) => {
      const unitA = unitsById[a]
      const unitB = unitsById[b]

      const costA = unitA?.cost ?? 999
      const costB = unitB?.cost ?? 999

      // 先按cost排序
      if (costA !== costB)
        return costA - costB

      // cost相同则按ID字母顺序排序
      return a.localeCompare(b)
    })
  }, [unitsById])

  /**
   * 生成阵容代码
   * 格式：02 + 英雄codes拼接 + 补0到30位 + TFTSet标识
   *
   * @param units 英雄ID数组
   * @returns 阵容代码字符串
   *
   * @example
   * generateCompCode(['TFT_Champion1', 'TFT_Champion2'])
   * // 返回: "0201a01400f18a18e15a018180000000TFTSet15"
   */
  const generateCompCode = useCallback((units: string[]): string => {
    if (!units || units.length === 0)
      return ''

    // 需要屏蔽的英雄ID列表（apiName / id）
    // 这些英雄不会参与阵容代码的计算
    const BLOCKED_UNIT_IDS = new Set<string>([
      'TFT16_AnnieTibbers',
    ])

    // 收集所有英雄的code（排除屏蔽列表中的英雄）
    const codes: string[] = []
    for (const unitId of units) {
      // 跳过需要屏蔽的英雄
      if (BLOCKED_UNIT_IDS.has(unitId))
        continue

      const unit = unitsById[unitId]
      if (unit?.code) {
        codes.push(unit.code)
      }
    }

    // 拼接所有code
    const codesString = codes.join('')

    // 补0到30位
    const paddedCodes = codesString.padEnd(30, '0')

    // 组合：02 + codes + TFTSet标识
    return `02${paddedCodes}${tftSetIdentifier}`
  }, [unitsById, tftSetIdentifier])

  return {
    sortUnitsByCost,
    generateCompCode,
  }
}
