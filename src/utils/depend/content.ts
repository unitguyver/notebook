import { dependStyle } from './index'
import FileManager from '@/utils/fs'
import Bridge, { MType } from '../bridge'

export const buildLocalJsBlob = async () => {
  const host = window.location.host

  try {
    const jsFileData = await FileManager.loadFile({
      host,
      ext: 'js',
    })
    const jsFile = new File([jsFileData], 'guyver-notebook-app-content.js', {
      type: 'text/javascript',
    })
    return URL.createObjectURL(jsFile)
  } catch (e) {
    //
    console.log(e)
  }
}

export const buildLocalCssBlob = async () => {
  const host = window.location.host

  try {
    const cssFileData = await FileManager.loadFile({
      host,
      ext: 'css',
    })
    const cssFile = new File([cssFileData], 'guyver-notebook-app-content.css', {
      type: 'text/css',
    })
    return URL.createObjectURL(cssFile)
  } catch (e) {
    //
    console.log(e)
  }
}
