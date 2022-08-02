import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './modules/global'
import db from '@/utils/db'

const store = configureStore({
  reducer: {
    global: globalReducer,
  },
})

db.get('global_local_folder').then(
  (folder) =>
    folder &&
    store.dispatch({
      type: 'global/setLocalFolder',
      payload: folder,
    })
)

export default store
