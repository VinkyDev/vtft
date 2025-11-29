import { useEffect } from 'react'

import { useGlobalStore } from '@/store/globalStore'
import App from './App'
import { GlobalErrorBoundary } from './components'

export function Layout() {
  const { initGlobalStore } = useGlobalStore()

  useEffect(() => {
    initGlobalStore()
  }, [initGlobalStore])

  return (
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  )
}
