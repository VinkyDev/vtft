import { memo } from 'react'

interface EmptyStateProps {
  /** 空状态提示文本 */
  message: string
}

export const EmptyState = memo(({ message }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  )
})

EmptyState.displayName = 'EmptyState'
