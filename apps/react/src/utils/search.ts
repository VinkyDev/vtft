import { pinyin } from 'pinyin-pro'

/**
 * 检查文本是否匹配搜索查询
 * 支持：
 * 1. 直接文本匹配
 * 2. 拼音全拼匹配
 * 3. 拼音首字母匹配
 *
 * @param text - 待搜索的文本
 * @param query - 搜索查询
 * @returns 是否匹配
 *
 * @example
 * ```ts
 * matchPinyinSearch('冰川之心', 'bczx') // true
 * matchPinyinSearch('冰川之心', 'bingchuanzhixin') // true
 * matchPinyinSearch('冰川之心', '冰川') // true
 * ```
 */
export function matchPinyinSearch(text: string, query: string): boolean {
  if (!query)
    return true

  const lowerQuery = query.toLowerCase()
  const lowerText = text.toLowerCase()

  // 直接匹配
  if (lowerText.includes(lowerQuery))
    return true

  // 拼音全拼匹配
  const fullPinyin = pinyin(text, { toneType: 'none', type: 'string' }).toLowerCase()
  if (fullPinyin.includes(lowerQuery))
    return true

  // 拼音首字母匹配
  const firstLetters = pinyin(text, { pattern: 'first', toneType: 'none', type: 'string' }).toLowerCase()
  if (firstLetters.includes(lowerQuery))
    return true

  return false
}

/**
 * 过滤数组，支持拼音搜索
 *
 * @param items - 待过滤的数组
 * @param query - 搜索查询
 * @param getSearchText - 从数组项中提取搜索文本的函数
 * @returns 过滤后的数组
 *
 * @example
 * ```ts
 * const champions = [{ name: '艾希' }, { name: '盖伦' }]
 * filterByPinyinSearch(champions, 'ax', item => item.name)
 * // => [{ name: '艾希' }]
 * ```
 */
export function filterByPinyinSearch<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string,
): T[] {
  if (!query.trim())
    return items

  return items.filter(item => matchPinyinSearch(getSearchText(item), query.trim()))
}
