import React, { useState } from 'react'
import { Card } from 'antd'
import Config from './config'
import Account from './account'

const tabList = [
  {
    key: 'config',
    tab: '配置',
  },
  {
    key: 'account',
    tab: '账号',
  },
]

const App: React.FC = () => {
  const [current, setCurrent] = useState<string>('config')

  return (
    <Card
      tabList={tabList}
      activeTabKey={current}
      onTabChange={setCurrent}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {current === 'config' && <Config />}
      {current === 'account' && <Account />}
    </Card>
  )
}

export default App
