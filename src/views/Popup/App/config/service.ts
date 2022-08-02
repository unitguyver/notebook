import { popupStore } from '@/store'
import { ConfigEntity } from './data'

const getHost = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs[0]) {
        const { url = '' } = tabs[0]
        const host = /^(https?:\/\/.[^\/]+)(\/?.*?)$/.exec(url)?.[1]
        host ? resolve(host) : reject()
      } else {
        reject()
      }
    })
  })
}

export default {
  getConfig: async (): Promise<ConfigEntity> => {
    const localFolder = popupStore.getState().global.localFolder
    const host = await getHost()

    return {
      localFolder,
      host,
    }
  },
  updateConfig: async (key: keyof ConfigEntity, value: any) => {
    if (key === 'localFolder') {
      popupStore.dispatch({
        type: 'global/setLocalFolder',
        payload: value,
      })
    }
  },
}
