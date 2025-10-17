/**
 * 将参数数组转换为逗号分隔的字符串
 */
export function arrayToString<T>(arr?: T[]): string | undefined {
  return arr && arr.length > 0 ? arr.join(',') : undefined
}
