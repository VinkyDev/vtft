/**
 * 将时间转换为相对时间描述
 * - 1小时内显示"x分钟前"
 * - 1小时到12小时之间显示"x小时前"
 * - 12小时到24小时之间显示"1天内"
 * - 大于24小时显示"1天前"
 */
export function formatRelativeTime(time: Date | string | number): string {
  const date = time instanceof Date ? time : new Date(time)
  const now = Date.now()
  const diff = now - date.getTime()

  // 转换为分钟
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (minutes < 1) {
    return '刚刚'
  }

  if (minutes < 60) {
    return `${minutes}分钟前`
  }

  if (hours < 12) {
    return `${hours}小时前`
  }

  if (hours < 24) {
    return '1天内'
  }

  return '1天前'
}
