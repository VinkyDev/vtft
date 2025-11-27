import process from 'node:process'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import UserAgent from 'user-agents'

export const api = axios.create({
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const userAgent = new UserAgent({ deviceCategory: 'desktop' })
  config.headers['User-Agent'] = userAgent.toString()
  return config
}, (error) => {
  return Promise.reject(error)
})

axiosRetry(api, {
  retries: Number(process.env.AXIOS_RETRIES || 5),
  shouldResetTimeout: true,
  retryCondition: (error) => {
    const isRetryable = axiosRetry.isRetryableError(error)
    const status = error.response?.status
    return isRetryable || status === 429 || (typeof status === 'number' && status >= 500)
  },
  retryDelay: (retryCount) => {
    const base = 300
    const max = 10000
    const delay = Math.min(base * 2 ** (retryCount - 1), max)
    const jitter = Math.random() * 300
    return Math.floor(delay + jitter)
  },
})
