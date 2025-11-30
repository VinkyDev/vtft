import { useEffect } from 'react'

import { useGlobalStore } from '@/store/globalStore'
import App from './App'
import { GlobalErrorBoundary } from './components'
import { initApiClient } from './config/apiClient'

export function Layout() {
  const { initGlobalStore } = useGlobalStore()

  useEffect(() => {
    initApiClient()
    initGlobalStore()
  }, [initGlobalStore])

  return (
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  )
}
