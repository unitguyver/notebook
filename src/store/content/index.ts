import { configureStore } from '@reduxjs/toolkit'
import globalReducer from './modules/global'
import editorReducer from './modules/editor'
import db from '@/utils/db'

const store = configureStore({
  reducer: {
    global: globalReducer,
    editor: editorReducer,
  },
})

db.get('content_mode').then(
  (mode) =>
    mode &&
    store.dispatch({
      type: 'global/setMode',
      payload: mode,
    })
)

db.get('content_editor_theme').then(
  (theme) =>
    theme &&
    store.dispatch({
      type: 'editor/setTheme',
      payload: theme,
    })
)

db.get('global_local_folder').then(
  (folder) =>
    folder &&
    store.dispatch({
      type: 'global/setLocalFolder',
      payload: folder,
    })
)

export default store
