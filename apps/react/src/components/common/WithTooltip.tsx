import type { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from 'ui'

interface WithTooltipProps {
  /** 子元素 */
  children: ReactNode
  /** 工具提示内容 */
  content: ReactNode
  /** 工具提示位置 */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** 是否显示工具提示 */
  show?: boolean
}

export function WithTooltip({ children, content, side = 'top', show = true }: WithTooltipProps) {
  if (!show) {
    return <>{children}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        className="bg-black/90 text-white border-white/10"
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
