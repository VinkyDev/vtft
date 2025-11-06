import type { ReactNode } from 'react'
import type { FallbackProps } from 'react-helper'
import { ErrorBoundary, ErrorBoundaryScopeEnum } from 'react-helper'
import { ErrorState } from '../common/ErrorState'

interface GlobalErrorBoundaryProps {
  children: ReactNode
}

/**
 * 全局错误兜底组件
 */
function GlobalErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ErrorState
        message="应用出错了"
        description="应用遇到了一个错误，请尝试重新加载"
        onReload={resetErrorBoundary}
      />
    </div>
  )
}

/**
 * 全局错误边界组件
 * 捕获所有未处理的错误并显示友好的错误界面
 */
export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      errorBoundaryName="GlobalErrorBoundary"
      errorBoundaryScope={ErrorBoundaryScopeEnum.Page}
      FallbackComponent={GlobalErrorFallback}
      onReset={() => {
        window.location.href = '/'
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
