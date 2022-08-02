import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { panelStore } from '@/store'
import { Provider } from 'react-redux'
import './index.less'

createRoot(document.getElementById('app') as Element).render(
  <Provider store={panelStore}>
    <App></App>
  </Provider>
)
