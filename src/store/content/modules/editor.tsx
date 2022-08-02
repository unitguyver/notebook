import { createSlice, SliceCaseReducers, PayloadAction } from '@reduxjs/toolkit'
import db from '@/utils/db'
import { editor } from 'monaco-editor'

export type EditorState = {
  name: string
  saved: boolean
  ext: string

  icon: string
  language: string
}

export type ContentEditorState = {
  theme: editor.BuiltinTheme
  host: string

  current?: string
  esList: EditorState[]
}

export const EditorSlice = createSlice<
  ContentEditorState,
  SliceCaseReducers<ContentEditorState>
>({
  name: 'editor',

  initialState: {
    theme: 'vs',
    host: window.location.host,

    esList: [
      {
        name: 'note',
        saved: true,
        ext: 'md',
        icon: 'SnippetsOutlined',
        language: 'markdown',
      },
      {
        name: 'css',
        saved: true,
        ext: 'css',
        icon: 'FormOutlined',
        language: 'css',
      },
      {
        name: 'js',
        saved: true,
        ext: 'js',
        icon: 'CodeOutlined',
        language: 'javascript',
      },
    ],
  },

  reducers: {
    setTheme(state, action: PayloadAction<editor.BuiltinTheme>) {
      state.theme = action.payload
      db.set('content_editor_theme', action.payload)
    },
    setHost(state, action: PayloadAction<string>) {
      state.host = action.payload
    },
    setCurrent(state, action: PayloadAction<string | undefined>) {
      state.current = action.payload
    },
    setEsList(state, action: PayloadAction<EditorState[]>) {
      state.esList = [...action.payload]
    },
  },
})

export default EditorSlice.reducer
