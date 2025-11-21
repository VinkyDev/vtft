import axios from 'axios'
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
