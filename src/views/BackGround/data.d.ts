export type ConnectRequest<T = Record<string, any>> = {
  id: number
  data: T
}

export type ResponseStatusEnum =
  | 1 // 请求成功
  | -1 // 请求失败
  | -2 // 链接未定义

export type ConnectResponse<T = Record<string, any>> = {
  id: number
  status: ResponseStatusEnum
  message?: string
  data?: T
  error?: any
}
