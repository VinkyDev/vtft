import { useMemoizedFn } from 'ahooks'
import { Overlay, Window } from 'bridge'
import { useState } from 'react'

import logo from '@/assets/logo.png'
import { useDraggable } from '@/hooks'
import { useConfigStore } from '@/store/configStore'

export function FloatingBallMode() {
  const { setWindowMode } = useConfigStore()
  const [isSwitching, setIsSwitching] = useState(false)

  const handleDrag = useMemoizedFn((dx: number, dy: number) => {
    Window.drag(dx, dy)
  })

  const handleDragStart = useMemoizedFn(async () => {
    await Window.startDrag()
    await Overlay.show()
  })

  const handleDragEnd = useMemoizedFn(async (mouseX: number, mouseY: number) => {
    const result = await Window.endDrag(mouseX, mouseY)
    if (result.success && result.data) {
      setWindowMode(result.data)
    }
    await Overlay.hide()
  })

  const { onMouseDown, checkIfMoved } = useDraggable({
    onDrag: handleDrag,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  })

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (checkIfMoved()) {
      e.preventDefault()
      return
    }

    setIsSwitching(true)
    try {
      const result = await Window.switchToStandardAndCenter()
      if (result.success && result.data) {
        setWindowMode(result.data)
      }
    }
    finally {
      setIsSwitching(false)
    }
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-move bg-transparent z-60 pointer-events-auto"
      onMouseDown={onMouseDown}
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={handleClick}
        type="button"
        className="pointer-events-auto"
        style={{
          opacity: isSwitching ? 0 : 1,
          pointerEvents: isSwitching ? 'none' : 'auto',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-full h-full object-contain relative z-10 transform scale-125"
            draggable={false}
          />
        </div>
      </button>
    </div>
  )
}
