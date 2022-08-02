import { Base64 } from 'js-base64'
import { contentHttp } from '@/utils/query'
import store from '@/store/content'

class FileManager {
  static hasFileSystem = window.hasOwnProperty('showOpenFilePicker')

  static fileSystem = chrome.runtime.connect({ name: 'file' })
  static success: (res: any) => void
  static fail: (err: any) => void

  static openFile = async () => {
    if (FileManager.hasFileSystem) {
      const fsHandler = await window.showOpenFilePicker()
      return fsHandler.getFile()
    } else {
      return new Promise((resolve, reject) => {
        FileManager.success = resolve
        FileManager.fail = reject
        FileManager.fileSystem.postMessage('open')
      })
    }
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
    if (FileManager.hasFileSystem) {
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
    } else {
      return new Promise((resolve, reject) => {
        FileManager.success = resolve
        FileManager.fail = reject
        FileManager.fileSystem.postMessage('save')
      })
    }
  }

  static loadFile = async (info: {
    host: string
    ext: string
  }): Promise<string> => {
    const localFolder = store.getState().global.localFolder

    const { ext, host } = info
    const filePath = `${localFolder}/${Base64.encode(host + ext)}.${ext}`

    const file = await contentHttp({
      url: filePath,
      method: 'GET',
    })

    return file as string
  }
}

if (!FileManager.hasFileSystem) {
  FileManager.fileSystem.onMessage.addListener(function (response) {
    const { status, data } = response
    if (status === 200) {
      FileManager.success(data)
    } else {
      FileManager.fail(data)
    }
  })
}

export default FileManager
