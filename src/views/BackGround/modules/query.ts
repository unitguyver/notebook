import { ConnectRequest, ConnectResponse } from '../data'

export type QueryResponse = any

export type QueryOptions = {
  url: string
  method?: 'GET' | 'POST'
  headers?: Headers
}

/**
 * @author guyver
 * @date 2021/11/15 17:30
 * @description 代理网络请求
 */
const query = async (options: QueryOptions): Promise<QueryResponse> => {
  const { url, method = 'GET', headers = {} } = options

  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers,
    })
      .then((response) => resolve(response.text()))
      .catch(() => reject(null))
  })
}

export default query
