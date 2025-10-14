import queryString from 'query-string'

/**
 * 将 URL 字符串和查询参数对象转换为包含查询参数的完整 URL 字符串。
 *
 * @param url - 基础 URL 字符串，例如 'https://example.com'。
 * @param queryParams - 包含查询参数的键值对对象，例如 { param1: 'value1', param2: 'value2' }。
 * @returns 包含查询参数的完整 URL 字符串，例如 'https://example.com?param1=value1&param2=value2'。
 */
export function toURL(
  url: string,
  queryParams: Record<string, unknown>,
): string {
  try {
    const urlObj = new URL(url)

    Object.entries(queryParams).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value))
    })

    return urlObj.toString()
  }
  catch {
    const query = queryString.stringify(queryParams)

    return `${url}${query ? `?${query}` : ''}`
  }
}

/**
 * 安全解析 URL 字符串，返回 URL 对象或 null。
 *
 * @param url - 要解析的 URL 字符串，例如 'https://example.com'。
 * @returns 如果 URL 字符串有效，则返回 URL 对象；否则返回 null。
 */
export function safeParseUrl(url: string): URL | null {
  try {
    return new URL(url)
  }
  catch {
    return null
  }
}

/**
 * 从指定 URL 获取指定参数的值。
 *
 * @param param - 要获取的参数名，例如 'param1'。
 * @returns 如果参数存在且值不为空，则返回参数值；否则返回 null。
 */
export function getUrlParams(param: string, url?: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const currentUrl = new URL(url || window.location.href)

  // 获取查询字符串
  const params = new URLSearchParams(currentUrl.search)

  // 通过参数名获取参数值
  const myParam = params.get(param)

  return myParam
}
