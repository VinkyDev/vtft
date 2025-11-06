import type { ReactNode } from 'react'
import { CardSkeleton } from '../skeletons'

interface DataSkeletonProps {
  /** 是否加载中 */
  loading: boolean
  /** 数据是否为空 */
  isEmpty: boolean
  /** 空状态组件 */
  empty?: ReactNode
  /** 加载时的骨架屏 */
  skeleton?: ReactNode
  /** 内容 */
  children: ReactNode
}

/** 数据加载骨架屏包装组件 */
export function DataSkeleton({
  loading,
  isEmpty,
  empty,
  skeleton,
  children,
}: DataSkeletonProps) {
  if (loading) {
    return <>{skeleton || <CardSkeleton />}</>
  }

  if (isEmpty) {
    return <>{empty}</>
  }

  return <>{children}</>
}
