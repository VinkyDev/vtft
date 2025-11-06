import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getDirname(metaUrl: string) {
  try {
    return dirname(fileURLToPath(metaUrl))
  }
  catch {
    return __dirname // CJS fallback
  }
}
