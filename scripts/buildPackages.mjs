import { spawn } from 'node:child_process'
import { info, success, error, logWithTag, table, Timer, newline } from './utils/index.mjs'

const BUILD_LEVELS = [
  ['types'],
  ['utils'],
  ['logger', 'bridge'],
  ['db', 'react-helper', 'api-client'],
  ['crawler'],
]

const SKIP_PACKAGES = ['ui', 'config']

/**
 * 构建单个包
 * @param {string} packageName - 包名
 * @returns {Promise<{packageName: string, success: boolean, duration: string}>}
 */
function buildPackage(packageName) {
  return new Promise((resolve, reject) => {
    const timer = new Timer()
    logWithTag(packageName, 'Building...', 'info')

    const child = spawn('pnpm', ['--filter', packageName, 'build'], {
      stdio: 'pipe',
      shell: true,
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      const duration = timer.elapsed()

      if (code === 0) {
        logWithTag(packageName, `✓ Built successfully in ${duration}s`, 'success')
        resolve({ packageName, success: true, duration })
      }
      else {
        logWithTag(packageName, `✗ Build failed in ${duration}s`, 'error')
        if (stderr)
          error(stderr)
        if (stdout)
          console.error(stdout)
        reject(new Error(`${packageName} build failed`))
      }
    })

    child.on('error', (err) => {
      logWithTag(packageName, `✗ Build error: ${err.message}`, 'error')
      reject(err)
    })
  })
}

/**
 * 构建一个层级的包（并行）
 * @param {string[]} packages - 包名数组
 * @returns {Promise<Array>}
 */
async function buildLevel(packages) {
  const validPackages = packages.filter(pkg => !SKIP_PACKAGES.includes(pkg))

  if (validPackages.length === 0)
    return []

  newline()
  info(`▶ Building: ${validPackages.join(', ')}`)

  try {
    const results = await Promise.all(
      validPackages.map(pkg => buildPackage(pkg)),
    )
    return results
  }
  catch (err) {
    // 如果某个包构建失败，立即停止
    throw err
  }
}

/**
 * 构建所有包
 */
async function buildAll() {
  const timer = new Timer()
  info('🚀 Starting parallel package builds...')

  const allResults = []

  try {
    for (const level of BUILD_LEVELS) {
      const results = await buildLevel(level)
      allResults.push(...results)
    }

    const totalDuration = timer.elapsed()
    const packageCount = allResults.length

    newline()
    success('✓ All packages built successfully!')
    info(`  📦 ${packageCount} packages built in ${totalDuration}s`)

    newline()
    info('  Build times:')
    table(
      allResults.map(({ packageName, duration }) => ({
        label: packageName,
        value: `${duration}s`,
      })),
    )
  }
  catch (err) {
    newline()
    error(`✗ Build failed: ${err.message}`)
    process.exit(1)
  }
}

buildAll()
