import { InboxIcon } from 'lucide-react'
import { memo } from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from 'ui'

interface EmptyStateProps {
  /** 空状态提示文本 */
  message: string
}

export const EmptyState = memo(({ message }: EmptyStateProps) => {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-gray-800 text-gray-400 border border-gray-600">
          <InboxIcon />
        </EmptyMedia>
        <EmptyDescription className="text-gray-400">{message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
})

EmptyState.displayName = 'EmptyState'
