import { createSlice, SliceCaseReducers, PayloadAction } from '@reduxjs/toolkit'
import db from '@/utils/db'

export type ModeEnum = 'fixed' | 'drawer'

export type PopupGlobal = {
  localFolder: string
}

/**
 * TODO: 默认保存文件夹地址、创建文件名称哈希值
 */

export const GlobalSlice = createSlice<
  PopupGlobal,
  SliceCaseReducers<PopupGlobal>
>({
  name: 'global',

  initialState: {
    localFolder: 'D:/notebook',
  },

  reducers: {
    setLocalFolder(state, action: PayloadAction<string>) {
      state.localFolder = action.payload
      db.set('global_local_folder', action.payload)
    },
  },
})

export default GlobalSlice.reducer
