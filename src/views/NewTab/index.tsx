import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { newtabStore } from '@/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('app') as Element).render(
  <Provider store={newtabStore}>
    <App></App>
  </Provider>
)
