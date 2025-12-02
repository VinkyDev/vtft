import { Search } from 'lucide-react'
import { useDeferredValue, useEffect, useState } from 'react'

interface SearchInputProps {
  /** 占位文案 */
  placeholder?: string
  /** 输入变化（已经过 useDeferredValue 处理后的值） */
  onSearchChange?: (value: string) => void
  /** 默认值 */
  defaultValue?: string
  /** 自定义输入框类名 */
  className?: string
}

/**
 * 基于拼音搜索场景封装的搜索输入框
 *
 * - 内部使用 useDeferredValue 做输入防抖，避免频繁筛选造成卡顿
 * - 对外只暴露经过 defer 处理后的搜索关键词
 */
export function SearchInput({
  placeholder = '搜索...',
  onSearchChange,
  defaultValue = '',
  className = '',
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const deferredValue = useDeferredValue(inputValue)

  useEffect(() => {
    const value = deferredValue.trim()
    onSearchChange?.(value)
  }, [deferredValue, onSearchChange])

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        className={`w-full h-6 sm:h-8 pl-7 pr-2 bg-black/20 border border-white/5 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 ${className}`}
      />
    </div>
  )
}
