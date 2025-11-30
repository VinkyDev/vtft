import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './layout'

import './index.css'
import 'ui/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)
