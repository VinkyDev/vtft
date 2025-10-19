/**
 * 根据操作系统格式化快捷键显示
 * @param key 快捷键名称
 * @returns 格式化后的显示名称
 */
export function formatShortcutKey(key: string): string {
  const isMac = navigator.platform.toUpperCase().includes('MAC')

  const keyMap: Record<string, string> = {
    CommandOrControl: isMac ? '⌘' : 'Ctrl',
    Shift: isMac ? '⇧' : 'Shift',
    Alt: isMac ? '⌥' : 'Alt',
    Control: 'Ctrl',
    Meta: isMac ? '⌘' : 'Win',
  }

  return keyMap[key] || key
}
