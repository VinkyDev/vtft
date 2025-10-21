import { useMemo } from 'react'

/**
 * 排序配置
 */
export interface SortConfig<T, K extends keyof any = string> {
  /** 排序字段 */
  field: K
  /** 排序方向：'asc' 升序, 'desc' 降序 */
  order: 'asc' | 'desc'
  /** 自定义比较函数（可选） */
  compareFn?: (a: T, b: T, field: K) => number
}

/**
 * 默认比较函数
 */
function defaultCompare<T>(a: T, b: T, field: keyof T): number {
  const aValue = a[field]
  const bValue = b[field]

  if (aValue === bValue)
    return 0
  if (aValue == null)
    return 1
  if (bValue == null)
    return -1

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue
  }

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return aValue.localeCompare(bValue)
  }

  return String(aValue).localeCompare(String(bValue))
}

/**
 * 通用排序 Hook
 * 根据指定字段和方向对数据进行排序
 *
 * @param data - 待排序的数据
 * @param config - 排序配置
 * @returns 排序后的数据
 *
 * @example
 * ```tsx
 * const [sortField, setSortField] = useState('matches')
 * const [sortOrder, setSortOrder] = useState('desc')
 *
 * const sortedChampions = useSortedData(champions, {
 *   field: sortField,
 *   order: sortOrder,
 * })
 * ```
 */
export function useSortedData<T, K extends keyof T = keyof T>(
  data: T[],
  config: SortConfig<T, K>,
): T[] {
  const { field, order, compareFn } = config

  return useMemo(() => {
    if (!data || data.length === 0)
      return []

    const compare = compareFn || ((a, b) => defaultCompare(a, b, field as keyof T))

    const sorted = [...data].sort((a, b) => {
      const result = compare(a, b, field)
      return order === 'asc' ? result : -result
    })

    return sorted
  }, [data, field, order, compareFn])
}
