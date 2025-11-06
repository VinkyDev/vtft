import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const getDirname = (metaUrl: string) => {
  try {
    return dirname(fileURLToPath(metaUrl))
  } catch {
    return __dirname // CJS fallback
  }
}
