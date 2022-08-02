export const PORT = process.env.WS_PORT

export const Message = {
  FileChange: 'file-change',
  Reload: 'reload',
}

export const isDev = process.env.NODE_ENV === 'development'
