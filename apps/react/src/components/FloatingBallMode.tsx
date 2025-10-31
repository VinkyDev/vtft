import { Overlay, Window } from 'bridge'

import logo from '@/assets/logo.png'
import { useDraggable } from '@/hooks'
import { useConfigStore } from '@/store/configStore'

/**
 * 悬浮球模式专用组件
 * 为 40x40 的小窗口设计，显示应用 logo
 * 支持拖动整个窗口，点击切换到标准模式并居中
 */
export function FloatingBallMode() {
  const { setWindowMode } = useConfigStore()

  const { onMouseDown, checkIfMoved } = useDraggable({
    onDrag: (dx, dy) => Window.drag(dx, dy),
    onDragStart: async () => {
      await Window.startDrag()
      await Overlay.show()
    },
    onDragEnd: async (mouseX, mouseY) => {
      const result = await Window.endDrag(mouseX, mouseY)
      if (result.success && result.data) {
        setWindowMode(result.data)
      }
      await Overlay.hide()
    },
    threshold: 3,
  })

  const handleClick = async (e: React.MouseEvent) => {
    // 如果发生了拖动，阻止点击事件
    if (checkIfMoved()) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // 切换到标准模式并居中
    const result = await Window.switchToStandardAndCenter()
    if (result.success && result.data) {
      setWindowMode(result.data)
    }
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-move bg-transparent"
      onMouseDown={onMouseDown}
    >
      <button
        onClick={handleClick}
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
