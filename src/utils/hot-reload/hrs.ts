/** hot-reload-server */
import { isDev, Message } from './data'

if (isDev) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message === Message.Reload) {
      chrome.tabs.query({ active: true }).then(() => {
        chrome.runtime.reload()
        chrome.tabs.reload()
      })
    }
  })
}

export {}
