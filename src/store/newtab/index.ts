import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './modules/global'
import db from '@/utils/db'

const store = configureStore({
  reducer: {
    global: globalReducer,
  },
})

db.get('mode').then(
  (mode) =>
    mode &&
    store.dispatch({
      type: 'global/setMode',
      payload: mode,
    })
)

export default store
