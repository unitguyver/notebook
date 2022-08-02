import query from './modules/query'
import '@/utils/hot-reload/hrs'

import { ConnectRequest, ConnectResponse } from './data'

chrome.runtime.onConnect.addListener((connect) => {
  connect.onMessage.addListener(async (request: ConnectRequest<any>) => {
    const { id, data } = request
    const response: ConnectResponse<any> = {
      id,
      status: -1,
    }
    if (/^net/.test(connect.name)) {
      try {
        response.status = 1
        response.data = await query(data)
      } catch (e) {
        //
      }
    } else {
      response.status = -2
      response.error = '链接未定义'
    }
    connect.postMessage(response)
  })
})

export {}
