import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initApiClient } from '@/config/apiClient'
import App from './App'

import './index.css'
import 'ui/globals.css'

// 初始化 API 客户端
initApiClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
