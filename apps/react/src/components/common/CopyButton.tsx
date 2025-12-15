import { Check, Copy } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { cn } from 'utils'

interface CopyButtonProps {
  /** 要复制的文本 */
  text: string
  /** 额外的 className */
  className?: string
  /** 图标大小 className */
  iconClassName?: string
  /** 显示文字标签 */
  label?: string
  /** 复制成功后回调 */
  onCopied?: () => void
  /** 点击事件是否阻止冒泡 */
  stopPropagation?: boolean
}

/**
 * 复制按钮组件
 * 点击复制文本，成功后显示 Check 图标动画
 */
export const CopyButton = memo(({
  text,
  className,
  iconClassName = 'size-3.5',
  label,
  onCopied,
  stopPropagation = false,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation()
    }

    if (!text)
      return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopied?.()

      // 2秒后恢复
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
    catch {
      // 失败时静默处理
    }
  }, [text, onCopied, stopPropagation])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1 transition-colors',
        className,
      )}
      disabled={!text}
    >
      <span className="relative">
        <Copy
          className={cn(
            iconClassName,
            'transition-all duration-300 ease-out',
            copied
              ? 'scale-0 opacity-0'
              : 'scale-100 opacity-100',
          )}
        />
        <Check
          className={cn(
            iconClassName,
            'absolute inset-0 text-emerald-400 transition-all duration-300 ease-out',
            copied
              ? 'scale-100 opacity-100'
              : 'scale-0 opacity-0',
          )}
        />
      </span>
      {label && (
        <span className={cn(
          'transition-colors duration-300',
          copied ? 'text-emerald-400' : '',
        )}
        >
          {label}
        </span>
      )}
    </button>
  )
})

CopyButton.displayName = 'CopyButton'
