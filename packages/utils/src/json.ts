export function stringifyJSON<T = any>(value: T): string {
  try {
    return JSON.stringify(value)
  }
  catch (error) {
    console.error({ error: error as Error })
    return ''
  }
}

export function parseJSON<T = Record<string, unknown>, U = unknown>(
  value: string | null | undefined,
  fallback: U,
): T {
  try {
    return value ? JSON.parse(value) : (fallback as unknown as T)
  }
  catch (error) {
    console.warn(`JSON 解析失败: ${error instanceof Error ? error.message : String(error)}`, {
      value: value?.substring(0, 100),
    })
    return fallback as unknown as T
  }
}
