import { GlobalShortcut } from 'bridge'
import { useState } from 'react'
import { Kbd } from 'ui'
import { useConfigStore } from '@/store'
import { formatShortcutKey } from '@/utils/formatShortcut'

/**
 * 快捷键设置组件
 */
export function ShortcutSetting() {
  const { toggleWindowShortcut, setToggleWindowShortcut } = useConfigStore()
  const [isRecording, setIsRecording] = useState(false)
  const [tempKeys, setTempKeys] = useState<string[]>([])

  // 处理键盘按下事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isRecording)
      return

    e.preventDefault()
    e.stopPropagation()

    const keys: string[] = []

    // 修饰键
    if (e.ctrlKey || e.metaKey)
      keys.push('CommandOrControl')
    if (e.shiftKey)
      keys.push('Shift')
    if (e.altKey)
      keys.push('Alt')

    // 主键（排除修饰键本身）
    const key = e.key
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
      keys.push(key.toUpperCase())
    }

    setTempKeys(keys)
  }

  // 处理键盘释放事件
  const handleKeyUp = async (e: React.KeyboardEvent) => {
    if (!isRecording)
      return

    e.preventDefault()
    e.stopPropagation()

    if (tempKeys.length >= 2) {
      const newShortcut = tempKeys.join('+')

      // 先取消注册旧快捷键
      if (toggleWindowShortcut) {
        await GlobalShortcut.unregister(toggleWindowShortcut, 'toggle-window-visibility')
      }

      // 保存新快捷键
      setToggleWindowShortcut(newShortcut)

      setIsRecording(false)
      setTempKeys([])
    }
  }

  // 开始录制快捷键
  const startRecording = () => {
    setIsRecording(true)
    setTempKeys([])
  }

  // 取消录制
  const cancelRecording = () => {
    setIsRecording(false)
    setTempKeys([])
  }

  // 重置为默认快捷键
  const resetToDefault = async () => {
    const defaultShortcut = 'CommandOrControl+Shift+H'

    // 先取消注册旧快捷键
    if (toggleWindowShortcut) {
      await GlobalShortcut.unregister(toggleWindowShortcut, 'toggle-window-visibility')
    }

    setToggleWindowShortcut(defaultShortcut)
    setIsRecording(false)
    setTempKeys([])
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full" />
            <h4 className="text-white text-sm font-semibold">显示/隐藏窗口</h4>
          </div>
          <p className="text-gray-400 text-xs ml-3">全局快捷键，可在任何应用中触发</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* 显示当前快捷键或录制中的快捷键 */}
          <div className="flex items-center gap-1.5 bg-black/40 px-4 py-2.5 rounded-lg border border-white/10">
            {isRecording
              ? (
                  tempKeys.length > 0
                    ? (
                        tempKeys.map((key, index) => (
                          <span key={index} className="flex items-center gap-1.5">
                            {index > 0 && <span className="text-gray-500 text-xs">+</span>}
                            <Kbd className="bg-blue-500/30 text-blue-200 border-blue-500/50 shadow-sm">
                              {formatShortcutKey(key)}
                            </Kbd>
                          </span>
                        ))
                      )
                    : (
                        <span className="text-gray-400 text-xs animate-pulse">按下快捷键...</span>
                      )
                )
              : (
                  toggleWindowShortcut.split('+').map((key, index) => (
                    <span key={index} className="flex items-center gap-1.5">
                      {index > 0 && <span className="text-gray-500 text-xs font-bold">+</span>}
                      <Kbd className="bg-gray-700/50 text-gray-200 border-gray-600/50">
                        {formatShortcutKey(key)}
                      </Kbd>
                    </span>
                  ))
                )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            {isRecording
              ? (
                  <button
                    onClick={cancelRecording}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600/50 transition-all duration-200"
                  >
                    取消
                  </button>
                )
              : (
                  <>
                    <button
                      onClick={startRecording}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600/80 hover:bg-blue-500/80 text-white border border-blue-500/50 transition-all duration-200 shadow-sm"
                    >
                      修改
                    </button>
                    <button
                      onClick={resetToDefault}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 border border-gray-600/50 transition-all duration-200"
                    >
                      重置
                    </button>
                  </>
                )}
          </div>
        </div>
      </div>

      {/* 录制状态时的输入框（隐藏但可以接收焦点） */}
      {isRecording && (
        <input
          autoFocus
          type="text"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={cancelRecording}
          className="absolute opacity-0 pointer-events-auto"
          style={{ width: 0, height: 0 }}
        />
      )}
    </div>
  )
}
