import { default as contentStore } from './content'
import { default as newtabStore } from './newtab'
import { default as popupStore } from './popup'
import { default as panelStore } from './panel'

export { contentStore }
export type ContentDispatch = typeof contentStore.dispatch
export type ContentState = ReturnType<typeof contentStore.getState>

export { newtabStore }
export type NewTabDispatch = typeof newtabStore.dispatch
export type NewTabState = ReturnType<typeof newtabStore.getState>

export { popupStore }
export type PopupDispatch = typeof popupStore.dispatch
export type PopupState = ReturnType<typeof popupStore.getState>

export { panelStore }
export type PanelDispatch = typeof panelStore.dispatch
export type PanelState = ReturnType<typeof panelStore.getState>
