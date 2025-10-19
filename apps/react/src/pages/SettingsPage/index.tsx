import { ScrollArea } from 'ui'
import { ShortcutSetting } from './components'

/**
 * 设置页面
 */
export function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" type="scroll">
        <div className="px-4 py-4 space-y-6">
          {/* 快捷键设置区域 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              <h3 className="text-white font-semibold text-base">快捷键</h3>
            </div>
            <ShortcutSetting />
          </section>
        </div>
      </ScrollArea>
    </div>
  )
}
