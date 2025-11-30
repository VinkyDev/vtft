import { cn } from 'utils'

interface SkeletonBaseProps extends React.ComponentProps<'div'> {
  /** 是否使用 shimmer 效果 */
  shimmer?: boolean
}

export function SkeletonBase({ className, shimmer = true, ...props }: SkeletonBaseProps) {
  if (shimmer) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-md bg-white/10',
          'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer',
          'before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent',
          'before:blur-sm',
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-md bg-white/10 animate-skeleton-pulse',
        className,
      )}
      {...props}
    />
  )
}
