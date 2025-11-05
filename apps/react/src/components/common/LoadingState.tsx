import { memo } from 'react'

interface LoadingStateProps {
  /** 加载提示文本 */
  message?: string
}

const LoadingState = memo(({ message = '加载中...' }: LoadingStateProps) => {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  )
})

LoadingState.displayName = 'LoadingState'
