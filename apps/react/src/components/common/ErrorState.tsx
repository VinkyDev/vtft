import { AlertCircleIcon } from 'lucide-react'
import { memo } from 'react'
import { Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from 'ui'

interface ErrorStateProps {
  /** 错误提示文本 */
  message?: string
  /** 错误描述文本 */
  description?: string
  /** 重新加载回调 */
  onReload?: () => void
}

export const ErrorState = memo(({ message = '加载失败，请重试', description, onReload }: ErrorStateProps) => {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-red-950 text-red-400 border border-red-800">
          <AlertCircleIcon />
        </EmptyMedia>
        <EmptyDescription className="text-gray-400 text-md">{message}</EmptyDescription>
        {description && <EmptyDescription className="text-gray-600 text-xs">{description}</EmptyDescription>}
      </EmptyHeader>
      {onReload && (
        <EmptyContent>
          <Button onClick={onReload} variant="outline" size="sm">
            重新加载
          </Button>
        </EmptyContent>
      )}
    </Empty>
  )
})

ErrorState.displayName = 'ErrorState'
