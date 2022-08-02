import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import {
  CloseOutlined,
  SnippetsOutlined,
  NodeIndexOutlined,
  BgColorsOutlined,
  SaveOutlined,
  AppstoreOutlined,
  PoweroffOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { ContentState } from '@/store'
import { ModeEnum } from '@/store/content/modules/global'
import { editor } from 'monaco-editor'
import { EditorState } from '@/store/content/modules/editor'
import { createIcon } from '@/utils/icon'

import './index.less'

const themes: {
  value: editor.BuiltinTheme
  style: CSSProperties
}[] = [
  {
    value: 'vs',
    style: {
      backgroundColor: '#ffffff',
      color: '#000000',
      borderColor: '#000000',
    },
  },
  {
    value: 'vs-dark',
    style: {
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
      borderColor: '#ffffff',
    },
  },
  {
    value: 'hc-black',
    style: {
      backgroundColor: '#000000',
      color: '#ffffff',
      borderColor: '#ffffff',
    },
  },
]

type ToolbarProps = {
  save(): void | Promise<void>

  mode: ModeEnum
  setMode(payload: ModeEnum): void
  theme: editor.BuiltinTheme
  setTheme(payload: editor.BuiltinTheme): void

  ce?: string
  setCe(payload?: string): void

  esList: EditorState[]
}

type ToolItem = {
  name: string
  icon: React.ReactNode
  style?: CSSProperties
  onClick?: () => Promise<void> | void
  extraRender?: React.ReactNode
  activeRender?: React.ReactNode
}

type ToolGroup = {
  name: string
  activeIcon: React.ReactNode
  inactiveIcon: React.ReactNode
  onClick?: () => Promise<void> | void
  list?: (ToolItem | undefined)[]
  extraRender?: React.ReactNode
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { theme, setTheme, save, ce, setCe, esList } = props

  const [openingControl, setOpeningControl] = useState<string>()
  const [openingTool, setOpeningTool] = useState<string>()

  useEffect(() => {
    setOpeningTool(undefined)
  }, [openingControl])

  /** 工具栏 */
  const toolbar: (ToolGroup | undefined)[] = [
    ce
      ? {
          name: 'close',
          activeIcon: <PoweroffOutlined />,
          inactiveIcon: <PoweroffOutlined />,
          onClick: () => setCe(undefined),
        }
      : undefined,
    ce
      ? {
          name: 'action',
          activeIcon: <CloseOutlined />,
          inactiveIcon: <AppstoreOutlined />,
          list: [
            {
              name: 'host',
              icon: <NodeIndexOutlined />,
            },
            {
              name: 'theme',
              icon: <BgColorsOutlined />,
              style: themes.filter((item) => item.value === theme)[0].style,
              activeRender: openingTool === 'theme' && (
                <div className="theme-list">
                  {themes.map((item, index) => (
                    <Button
                      key={index}
                      className={`theme-${++index}`}
                      style={item.style}
                      onClick={() => setTheme(item.value)}
                      type="primary"
                      shape="circle"
                      size="large"
                      icon={<BgColorsOutlined />}
                    />
                  ))}
                </div>
              ),
            },
            {
              name: 'save',
              icon: <SaveOutlined />,
              onClick: save,
            },
          ],
        }
      : undefined,
    {
      name: 'editor',
      activeIcon: <CloseOutlined />,
      inactiveIcon: <SnippetsOutlined />,
      extraRender: openingControl !== 'editor' &&
        esList.some((e) => !e.saved) && <div className="tool-warning" />,
      list: esList.map((item) => ({
        name: item.name,
        icon: item.icon,
        style:
          ce === item.name
            ? {
                backgroundColor: '#52c41a',
              }
            : {},
        onClick: () => {
          if (ce === item.name) {
            setCe(undefined)
          } else {
            setCe(item.name)
          }
        },
        extraRender: !item.saved && <div className="tool-warning" />,
      })),
    },
  ]

  return (
    <div className="fixed-toolbar-group">
      {toolbar.map((group) => {
        if (group) {
          const { name, activeIcon, inactiveIcon, list = [] } = group

          return (
            <div key={name} className="fixed-toolbar">
              {openingControl === name && (
                <div className="toolbar">
                  {list.map((tool, index) => {
                    if (tool) {
                      const { name: toolName } = tool

                      return (
                        <div key={toolName} className={`tool-icon-${++index}`}>
                          <Button
                            style={tool.style}
                            onClick={() => {
                              if (openingTool === toolName) {
                                setOpeningTool(undefined)
                              } else {
                                setOpeningTool(toolName)
                              }
                              tool.onClick?.()
                            }}
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={createIcon(tool.icon)}
                          />
                          {tool.extraRender}
                          {openingTool === toolName && tool.activeRender}
                        </div>
                      )
                    }
                  })}
                </div>
              )}
              <div className="tool-icon-switch">
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  icon={openingControl === name ? activeIcon : inactiveIcon}
                  onClick={() => {
                    if (openingControl === name) {
                      setOpeningControl(undefined)
                    } else {
                      setOpeningControl(name)
                    }
                    group.onClick?.()
                  }}
                />
                {group.extraRender}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
}

export default connect(
  (state: ContentState) => ({
    mode: state.global.mode,
    theme: state.editor.theme,
    ce: state.editor.current,
    esList: state.editor.esList,
  }),
  {
    setMode: (payload: ModeEnum) => ({
      type: 'global/setMode',
      payload,
    }),
    setTheme: (payload: editor.BuiltinTheme) => ({
      type: 'editor/setTheme',
      payload,
    }),
    setCe: (payload?: string) => ({
      type: 'editor/setCurrent',
      payload,
    }),
  }
)(Toolbar)
