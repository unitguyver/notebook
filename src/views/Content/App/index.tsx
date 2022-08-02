import React, { useEffect, useRef, useState } from 'react'
import Editors, { EditorsIntance } from './editors'
import Toolbar from './toolbar'
import { message } from 'antd'
import './index.less'

const App: React.FC = () => {
  const editorsRef = useRef<EditorsIntance>()
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    message.config({
      getContainer: () => messageRef.current || document.body,
    })
  }, [])

  return (
    <>
      <div id="notebook-message" ref={messageRef}></div>
      <Editors actionRef={editorsRef} />
      <Toolbar save={() => editorsRef.current?.save()} />
    </>
  )
}

export default App
