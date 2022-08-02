import { createSlice, SliceCaseReducers, PayloadAction } from '@reduxjs/toolkit'

export type ModeEnum = 'fixed' | 'drawer'

export type ContentGlobal = {
  mode: ModeEnum
}

export const GlobalSlice = createSlice<
  ContentGlobal,
  SliceCaseReducers<ContentGlobal>
>({
  name: 'global',

  initialState: {
    mode: 'drawer',
  },

  reducers: {
    setMode(state, action: PayloadAction<ModeEnum>) {
      state.mode = action.payload
    },
  },
})

export default GlobalSlice.reducer
