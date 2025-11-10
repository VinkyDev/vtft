import { spawn, execSync } from 'node:child_process'
import { error, info } from './logger.mjs'

/**
 * 执行命令配置
 * @typedef {Object} ExecOptions
 * @property {string} [cwd] - 工作目录
 * @property {boolean} [silent] - 是否静默执行（不打印命令）
 * @property {boolean} [showOutput] - 是否显示输出
 * @property {Object} [env] - 环境变量
 * @property {number} [timeout] - 超时时间（毫秒）
 */

/**
 * 同步执行命令
 * @param {string} command - 要执行的命令
 * @param {ExecOptions} options - 执行选项
 * @returns {string} 命令输出
 */
export function exec(command, options = {}) {
  const {
    cwd = process.cwd(),
    silent = false,
    showOutput = true,
    env = process.env,
  } = options

  if (!silent) {
    info(`> ${command}`)
  }

  try {
    const result = execSync(command, {
      cwd,
      env,
      encoding: 'utf-8',
      stdio: showOutput ? 'inherit' : 'pipe',
    })
    return result
  }
  catch (err) {
    error(`命令执行失败: ${command}`)
    throw err
  }
}

/**
 * 异步执行命令结果
 * @typedef {Object} SpawnResult
 * @property {number} code - 退出码
 * @property {string} stdout - 标准输出
 * @property {string} stderr - 标准错误输出
 * @property {boolean} success - 是否成功
 */

/**
 * 异步执行命令
 * @param {string} command - 命令
 * @param {string[]} args - 参数数组
 * @param {ExecOptions} options - 执行选项
 * @returns {Promise<SpawnResult>}
 */
export function spawnAsync(command, args = [], options = {}) {
  const {
    cwd = process.cwd(),
    silent = false,
    showOutput = false,
    env = process.env,
  } = options

  return new Promise((resolve, reject) => {
    if (!silent) {
      info(`> ${command} ${args.join(' ')}`)
    }

    const child = spawn(command, args, {
      cwd,
      env,
      shell: true,
      stdio: showOutput ? 'inherit' : 'pipe',
    })

    let stdout = ''
    let stderr = ''

    if (!showOutput) {
      child.stdout?.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr?.on('data', (data) => {
        stderr += data.toString()
      })
    }

    child.on('close', (code) => {
      resolve({
        code,
        stdout,
        stderr,
        success: code === 0,
      })
    })

    child.on('error', (err) => {
      reject(err)
    })
  })
}

/**
 * 检查命令是否存在
 * @param {string} command - 命令名称
 * @returns {boolean}
 */
export function commandExists(command) {
  try {
    execSync(`command -v ${command}`, { stdio: 'ignore' })
    return true
  }
  catch {
    return false
  }
}

/**
 * 获取命令输出（静默执行）
 * @param {string} command - 命令
 * @param {ExecOptions} options - 执行选项
 * @returns {string} 命令输出
 */
export function getOutput(command, options = {}) {
  return exec(command, {
    ...options,
    silent: true,
    showOutput: false,
  })
}

/**
 * 执行多个命令（串行）
 * @param {string[]} commands - 命令数组
 * @param {ExecOptions} options - 执行选项
 * @returns {Promise<void>}
 */
export async function execSequence(commands, options = {}) {
  for (const command of commands) {
    exec(command, options)
  }
}

/**
 * 执行多个命令（并行）
 * @param {string[]} commands - 命令数组
 * @param {ExecOptions} options - 执行选项
 * @returns {Promise<SpawnResult[]>}
 */
export async function execParallel(commands, options = {}) {
  const tasks = commands.map((command) => {
    const [cmd, ...args] = command.split(' ')
    return spawnAsync(cmd, args, options)
  })

  return Promise.all(tasks)
}
