import React, { useEffect, useState, useImperativeHandle, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { connect } from 'react-redux'
import { ContentState } from '@/store'
import FileManager from '@/utils/fs'
import { message } from 'antd'

const { editor } = monaco

let EDITOR_ID_CODE = 1

export type EditorIntance = {
  save: () => void | Promise<void>
}

type EditorProps = {
  visible: boolean
  ext: string
  language: string

  setSaved?(val: boolean): void

  actionRef?:
    | React.MutableRefObject<EditorIntance | undefined>
    | React.RefObject<EditorIntance | undefined>

  host: string
}

const Editor: React.FC<EditorProps> = (props) => {
  const { visible, language, host, ext } = props
  const { actionRef, setSaved } = props

  const contextRef = useRef<HTMLDivElement>(null)
  const [context, setContext] = useState<monaco.editor.IStandaloneCodeEditor>()

  const saveFileToLocal = async (contents: string) => {
    await FileManager.saveFile(contents, {
      host,
      ext,
      opened: () => {
        // message.loading('正在保存')
      },
      writed: () => {
        message.success('保存成功')
        setSaved?.(true)
      },
    })
  }

  useImperativeHandle(actionRef, () => ({
    save: async () => {
      const value = context?.getValue() || ''
      await saveFileToLocal(value)
    },
  }))

  useEffect(() => {
    if (visible) {
      if (!context) {
        if (contextRef.current) {
          /**
           * 初始化编辑器
           */
          const _context = editor.create(contextRef.current, {
            automaticLayout: true,
            language,
          })
          /**
           * onDidChangeModelContent
           */
          _context.onDidChangeModelContent(() => setSaved?.(false))
          /**
           * Ctrl + S
           */
          _context.addAction({
            id: ext + EDITOR_ID_CODE++,
            label: 'save',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
            run: async () => {
              const value = _context.getValue() || ''
              await saveFileToLocal(value)
            },
          })
          setContext(_context)
        }
      }
    }
  }, [visible, context])

  useEffect(() => {
    if (context) {
      FileManager.loadFile({
        ext,
        host,
      }).then((data) => {
        context.setValue(data)
        setSaved?.(true)
      })
    }
  }, [context, host])

  return (
    <div
      ref={contextRef}
      className="content-monaco-editor"
      style={{
        display: visible ? 'block' : 'none',
      }}
    ></div>
  )
}

export default connect(
  (state: ContentState) => ({
    host: state.editor.host,
  }),
  {}
)(Editor)
