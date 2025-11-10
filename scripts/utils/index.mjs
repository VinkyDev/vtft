/**
 * 脚本工具库统一导出
 * @module scripts/utils
 */

// 日志工具
export {
  log,
  info,
  success,
  warn,
  error,
  debug,
  logWithTag,
  logWithTime,
  newline,
  separator,
  section,
  progress,
  table,
  Timer,
} from './logger.mjs'

// 命令执行工具
export {
  exec,
  spawnAsync,
  commandExists,
  getOutput,
  execSequence,
  execParallel,
} from './exec.mjs'

// 文件系统工具
export {
  removeRecursive,
  cleanPatterns,
  getSubDirectories,
  getFiles,
  ensureDir,
  copyFileAsync,
  exists,
  readJSON,
  writeJSON,
  readText,
  writeText,
} from './fs.mjs'

// 交互提示工具
export {
  prompt,
  confirm,
  select,
  input,
  multiSelect,
  password,
  pause,
} from './prompt.mjs'

// 路径工具
export { PROJECT_ROOT } from './path.mjs'
