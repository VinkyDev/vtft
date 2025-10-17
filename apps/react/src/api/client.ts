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
    // 可在此添加认证 token 等
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
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
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      console.error('API Error:', error.response.data)
    }
    else if (error.request) {
      // 请求已发送但未收到响应
      console.error('Network Error:', error.message)
    }
    else {
      // 请求配置错误
      console.error('Request Error:', error.message)
    }
    return Promise.reject(error)
  },
)
