import { pinyin } from 'pinyin-pro'

/**
 * 检查文本是否匹配搜索查询
 * 支持智能模糊匹配：
 * 1. 汉字子串匹配 - 支持任意位置的连续汉字匹配
 * 2. 拼音全拼智能匹配 - 支持跨字边界的拼音匹配，支持撇号分隔符
 * 3. 拼音首字母智能匹配 - 支持跨字边界的首字母匹配
 *
 * @param text - 待搜索的文本
 * @param query - 搜索查询，支持撇号（'）作为音节分隔符
 * @returns 是否匹配
 */
export function matchPinyinSearch(text: string, query: string): boolean {
  if (!query)
    return true

  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery)
    return true

  // 移除撇号（音节分隔符），因为拼音数组已经自然分隔了音节
  const normalizedQuery = lowerQuery.replace(/'/g, '')

  const lowerText = text.toLowerCase()

  // 1. 汉字子串模糊匹配
  if (lowerText.includes(lowerQuery) || lowerText.includes(normalizedQuery))
    return true

  // 2. 拼音全拼智能匹配（支持跨字边界）
  const fullPinyinArray = pinyin(text, { toneType: 'none', type: 'array' }) as string[]
  if (matchPinyinArray(fullPinyinArray, normalizedQuery))
    return true

  // 3. 拼音首字母智能匹配
  const firstLettersArray = pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' }) as string[]
  if (matchPinyinArray(firstLettersArray, normalizedQuery))
    return true

  return false
}

/**
 * 匹配拼音数组，支持跨字边界的智能匹配
 * @param pinyinArray - 拼音数组，例如 ["bian", "xie", "duan", "lu"]
 * @param query - 搜索查询
 * @returns 是否匹配
 *
 * @example
 */
function matchPinyinArray(pinyinArray: string[], query: string): boolean {
  const lowerQuery = query.toLowerCase()

  // 遍历每个起始位置
  for (let startIdx = 0; startIdx < pinyinArray.length; startIdx++) {
    let queryIdx = 0
    let currentPinyin = pinyinArray[startIdx].toLowerCase()
    let pinyinIdx = 0

    // 尝试从当前起始位置开始匹配
    for (let i = startIdx; i < pinyinArray.length && queryIdx < lowerQuery.length; i++) {
      currentPinyin = pinyinArray[i].toLowerCase()
      pinyinIdx = 0

      // 在当前拼音中匹配尽可能多的字符
      while (pinyinIdx < currentPinyin.length && queryIdx < lowerQuery.length) {
        if (currentPinyin[pinyinIdx] === lowerQuery[queryIdx]) {
          pinyinIdx++
          queryIdx++
        }
        else {
          break
        }
      }

      // 如果当前拼音没有完全匹配完，说明查询字符串不匹配
      if (pinyinIdx > 0 && pinyinIdx < currentPinyin.length && queryIdx < lowerQuery.length) {
        // 部分匹配了当前拼音，但还有剩余字符未匹配
        // 检查下一个拼音是否能继续匹配
        if (i + 1 < pinyinArray.length) {
          const nextPinyin = pinyinArray[i + 1].toLowerCase()
          if (nextPinyin[0] !== lowerQuery[queryIdx]) {
            break
          }
        }
        else {
          break
        }
      }
    }

    // 如果查询字符串全部匹配完，返回 true
    if (queryIdx === lowerQuery.length)
      return true
  }

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
