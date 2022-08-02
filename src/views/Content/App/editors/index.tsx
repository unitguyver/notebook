import React, { useImperativeHandle, useRef, useEffect, useState } from 'react'
import Editor, { EditorIntance } from '@/hooks/editor'
import { editor } from 'monaco-editor'
import { connect } from 'react-redux'
import { ContentState } from '@/store'
import { message } from 'antd'
import './index.less'
import { EditorState } from '@/store/content/modules/editor'

export type EditorsIntance = {
  save(): void
}

export type EditorsProps = {
  current?: string

  actionRef?:
    | React.MutableRefObject<EditorsIntance | undefined>
    | React.RefObject<EditorsIntance | undefined>

  theme: editor.BuiltinTheme
  setTheme(payload: editor.BuiltinTheme): void

  esList: EditorState[]
  setEsList(payload: EditorState[]): void
}

type DragVars = {
  startX?: number
  startWidth: number
}

const themeColor = {
  vs: '#ffffff',
  'vs-dark': '#1e1e1e',
  'hc-black': '#000000',
}

const Editors: React.FC<EditorsProps> = (props) => {
  const { current, theme, actionRef, esList, setEsList } = props

  const eRefs = esList.reduce((result, eSatte) => {
    result[eSatte.name] = useRef<EditorIntance>()
    return result
  }, {} as Record<string, React.MutableRefObject<EditorIntance | undefined>>)

  const [width, setWidth] = useState<number>(800)
  const dragVars = useRef<DragVars>({
    startWidth: 800,
  }).current

  const setSaved = (name: string, saved: boolean) => {
    setEsList(
      esList.map((item) => {
        if (item.name === name) {
          return {
            ...item,
            saved,
          }
        }
        return item
      })
    )
  }

  useImperativeHandle(actionRef, () => ({
    save: async () => {
      if (current) {
        await eRefs[current].current?.save()
      }
    },
  }))

  useEffect(() => {
    /** 写在store里，编辑器不显示光标 */
    editor.setTheme(theme)
  }, [theme])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragVars.startX) {
        setWidth(Math.max(dragVars.startWidth + dragVars.startX - e.pageX, 300))
      }
    }
    const onMouseUp = (e: MouseEvent) => {
      dragVars.startX = undefined
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const onStickMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    dragVars.startX = e.pageX
    dragVars.startWidth = width
  }

  return (
    <div
      className="editor-drawer"
      style={{
        width: current ? width + 'px' : 0,
        backgroundColor: themeColor[theme],
      }}
    >
      <div className="editor-stick" onMouseDown={onStickMouseDown}></div>
      <div className="editor-container">
        {esList.map((eState) => (
          <Editor
            key={eState.name}
            actionRef={eRefs[eState.name]}
            visible={current === eState.name}
            ext={eState.ext}
            language={eState.language}
            setSaved={(saved) => setSaved(eState.name, saved)}
          />
        ))}
      </div>
    </div>
  )
}

export default connect(
  (state: ContentState) => ({
    theme: state.editor.theme,
    current: state.editor.current,
    esList: state.editor.esList,
  }),
  {
    setTheme: (payload: editor.BuiltinTheme) => ({
      type: 'editor/setTheme',
      payload,
    }),
    setEsList: (payload: EditorState[]) => ({
      type: 'editor/setEsList',
      payload,
    }),
  }
)(Editors)
