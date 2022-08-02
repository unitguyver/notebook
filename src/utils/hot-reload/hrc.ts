/** hot-reload-client */
import { isDev, PORT, Message } from './data'

if (isDev) {
  const ws = new WebSocket(`ws://localhost:${PORT}`)
  ws.addEventListener('message', (event) => {
    if (event.data === Message.FileChange) {
      chrome?.runtime?.sendMessage?.(Message.Reload)
    }
  })
}

export {}
