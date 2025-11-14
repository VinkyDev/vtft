import { createApiClient, setApiClient } from 'api-client'

/**
 * 初始化 API 客户端
 * 在 Web 环境中从 VITE_API_BASE_URL 环境变量读取 baseURL
 */
export function initApiClient() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  const client = createApiClient(BASE_URL)
  setApiClient(client)
}
