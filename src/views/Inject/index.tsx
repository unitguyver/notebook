import Bridge, { MType } from '@/utils/bridge'
import { dependScript, dependStyle } from '@/utils/depend'

/**
 * 引入资源文件
 */
Bridge.onMessage((message) => {
  const { type, value } = message
  if (message.type === MType.Depend) {
    dependScript(value.js)
    dependStyle(value.css)
  }
})

export {}
