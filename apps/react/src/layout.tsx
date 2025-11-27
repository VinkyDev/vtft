import { useEffect } from 'react'

import { useGlobalStore } from '@/store/globalStore'
import App from './App'
import { GlobalErrorBoundary } from './components'

export function Layout() {
  const { initGlobalStore, loading } = useGlobalStore()

  useEffect(() => {
    initGlobalStore()
  }, [initGlobalStore])

  if (loading)
    return <></>

  return (
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  )
}
