import { QueryOptions, QueryResponse } from '@/views/BackGround/modules/query'
import { ConnectRequest, ConnectResponse } from '@/views/BackGround/data'
import headers from './headers.json'

class Connent {
  httpConnentionId: number = 0
  httpThreads: Record<
    number,
    {
      resolve: (res?: QueryResponse) => void
      reject: (err: any) => void
    }
  > = {}

  $conn: chrome.runtime.Port

  constructor(name: string) {
    this.$conn = chrome.runtime.connect({ name })
    this.$conn.onMessage.addListener(this.onMessage.bind(this))
  }

  onMessage(response: ConnectResponse<QueryResponse>) {
    const { id, status, data, error } = response
    if (this.httpThreads[id]) {
      if (status === 1) {
        this.httpThreads[response.id].resolve(data)
      } else {
        this.httpThreads[response.id].reject(error)
      }
      delete this.httpThreads[response.id]
    }
  }

  $http(opts: QueryOptions) {
    return new Promise((resolve, reject) => {
      const id = ++this.httpConnentionId

      const request: ConnectRequest<QueryOptions> = {
        id,
        data: opts,
      }
      this.$conn.postMessage(request)

      this.httpThreads[id] = { resolve, reject }
    })
  }
}

const contentContent = new Connent('net-content')

export const contentHttp = contentContent.$http.bind(contentContent)
