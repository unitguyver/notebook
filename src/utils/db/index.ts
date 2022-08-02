const db = {
  set(key: string, value: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => resolve(true))
    })
  },

  get(key: string, defaultValue?: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.sync.get({ [key]: '' }, (data) => {
        const value = data[key]
        if (value !== undefined) {
          resolve(value)
        } else {
          resolve(defaultValue)
        }
      })
    })
  },
}

export default db
