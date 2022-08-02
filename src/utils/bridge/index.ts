export enum MType {
  Depend = 'depend',
}

type BridgeMessage = {
  id?: number
  type: MType
  value: any
}

class Bridge {
  static $mId = 0
  static readonly $id = 'guyver-notebook-bridge'

  static appendTo = (container: HTMLElement) => {
    const bridge = document.createElement('input')
    bridge.id = Bridge.$id
    bridge.style.display = 'none'
    container.appendChild(bridge)
  }

  static getNode = () => {
    const bridge = document.getElementById(Bridge.$id)
    return bridge as HTMLInputElement
  }

  static setValue(value: string) {
    const bridge = Bridge.getNode()
    bridge.value = value

    bridge.click()
  }

  static getValue() {
    const bridge = Bridge.getNode()
    return bridge.value
  }

  static onMessage = ($listener: (val: BridgeMessage) => void) => {
    Bridge.getNode().addEventListener('click', () => {
      const newVal = Bridge.getValue()
      if (newVal) {
        const message: BridgeMessage = JSON.parse(newVal)
        $listener(message)
      }
    })
  }

  static sendMessage = (message: BridgeMessage) => {
    message.id = ++Bridge.$mId
    Bridge.setValue(JSON.stringify(message))
  }
}

export default Bridge
