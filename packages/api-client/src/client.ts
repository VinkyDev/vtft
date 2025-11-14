import type { AxiosError, AxiosInstance } from 'axios'
import type { ApiResponse } from 'types'
import axios from 'axios'

/**
 * 全局 API 客户端实例
 * 通过 setApiClient 设置
 */
let globalApiClient: AxiosInstance | null = null

/**
 * 创建 API 客户端实例
 * @param baseURL API 基础路径，默认为 http://localhost:3000/api
 * @returns Axios 实例
 */
export function createApiClient(baseURL: string = 'http://localhost:3000/api') {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  client.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
      return Promise.reject(error)
    },
  )

  return client
}

/**
 * 设置全局 API 客户端实例
 * @param client Axios 实例
 */
export function setApiClient(client: AxiosInstance) {
  globalApiClient = client
}

/**
 * 获取 API 客户端实例
 * 如果未设置全局实例，会创建默认实例
 * @returns Axios 实例
 */
export function getApiClient(): AxiosInstance {
  if (!globalApiClient) {
    globalApiClient = createApiClient()
  }
  return globalApiClient
}
