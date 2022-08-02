import { createSlice, SliceCaseReducers, PayloadAction } from '@reduxjs/toolkit'
import db from '@/utils/db'

export type ModeEnum = 'fixed' | 'drawer'

export type ContentGlobal = {
  mode: ModeEnum
  localFolder: string
}

/**
 * TODO: 默认保存文件夹地址、创建文件名称哈希值
 */

export const GlobalSlice = createSlice<
  ContentGlobal,
  SliceCaseReducers<ContentGlobal>
>({
  name: 'global',

  initialState: {
    mode: 'drawer',
    localFolder: 'D:/notebook',
  },

  reducers: {
    setMode(state, action: PayloadAction<ModeEnum>) {
      state.mode = action.payload
      db.set('content_mode', action.payload)
    },
    setLocalFolder(state, action: PayloadAction<string>) {
      state.localFolder = action.payload
      db.set('global_local_folder', action.payload)
    },
  },
})

export default GlobalSlice.reducer
