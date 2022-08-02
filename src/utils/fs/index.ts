import { Base64 } from 'js-base64'
import { contentHttp } from '@/utils/query'
import store from '@/store/content'

class FileManager {
  static success: (res: any) => void
  static fail: (err: any) => void

  static openFile = async () => {
    const fsHandler = await window.showOpenFilePicker()
    return fsHandler.getFile()
  }

  static saveFile = async (
    contents: string,
    config: {
      host: string
      ext: string
      opened?(): void
      writed?(): void
      closed?(): void
    }
  ) => {
    const { ext, host } = config

    const fsHandler = await window.showSaveFilePicker({
      suggestedName: `${Base64.encode(host + ext)}.${ext}`,
    })
    config.opened?.()

    const writable = await fsHandler.createWritable()
    await writable.write(contents)
    config.writed?.()

    await writable.close()
    config.closed?.()
  }

  static loadFile = async (info: {
    host: string
    ext: string
  }): Promise<string> => {
    const localFolder = store.getState().global.localFolder

    const { ext, host } = info
    const filePath = `file:///${localFolder}/${Base64.encode(
      host + ext
    )}.${ext}`

    const file = await contentHttp({
      url: filePath,
      method: 'GET',
    })

    return file as string
  }
}

export default FileManager
