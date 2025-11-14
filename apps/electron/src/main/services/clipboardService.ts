import type { BaseResult } from 'types'
import { clipboard } from 'electron'
import { ResultUtil } from 'utils'

export class ClipboardService {
  async getClipboardText(): Promise<BaseResult<string>> {
    try {
      const text = clipboard.readText()
      return ResultUtil.success(text)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }

  async setClipboardText(text: string): Promise<BaseResult<void>> {
    try {
      clipboard.writeText(text)
      return ResultUtil.success(undefined)
    }
    catch (error) {
      return ResultUtil.error(error)
    }
  }
}
