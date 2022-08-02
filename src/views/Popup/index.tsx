import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { popupStore } from '@/store'
import { Provider } from 'react-redux'
import './index.less'

createRoot(document.getElementById('app') as Element).render(
  <Provider store={popupStore}>
    <App></App>
  </Provider>
)
