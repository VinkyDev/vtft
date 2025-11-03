/**
 * Axios 基础配置
 * 提供统一的 HTTP 客户端实例
 */
import axios from 'axios'

/** API 基础 URL - 可通过环境变量配置 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/** 创建 Axios 实例 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 请求拦截器 */
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/** 响应拦截器 */
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)
