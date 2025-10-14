import type { BaseResult } from 'types'
import { IPC_EVENTS } from 'utils'

class ClipboardManager {
  async getClipboardText(): Promise<BaseResult<string>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.CLIPBOARD.GET)
  }

  async setClipboardText(text: string): Promise<BaseResult<void>> {
    return window.electron.ipcRenderer.invoke(IPC_EVENTS.CLIPBOARD.SET, text)
  }
}

export const Clipboard = new ClipboardManager()
