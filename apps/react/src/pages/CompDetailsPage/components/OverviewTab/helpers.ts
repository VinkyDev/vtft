const ROWS = 4
const COLS = 7

export { COLS, ROWS }

export function getRowCol(n: number) {
  if (n < 1 || n > 28) {
    throw new Error('数字必须在 1 到 28 之间')
  }
  const row = 4 - Math.floor((n - 1) / 7) - 1
  const col = (n - 1) % 7
  return { row, col }
}
