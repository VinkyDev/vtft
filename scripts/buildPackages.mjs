import { spawn } from 'node:child_process'
import { styleText } from 'node:util'


const BUILD_LEVELS = [
  ['types'],
  ['utils'],
  ['logger', 'bridge'],
  ['db', 'react-helper'],
  ['crawler'],
]

const SKIP_PACKAGES = ['ui', 'config']

function buildPackage(packageName) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    console.log(styleText('cyan', `[${packageName}]`), 'Building...')

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
      const duration = ((Date.now() - startTime) / 1000).toFixed(2)

      if (code === 0) {
        console.log(
          styleText('green', `[${packageName}]`),
          styleText('green', `✓ Built successfully in ${duration}s`),
        )
        resolve({ packageName, success: true, duration })
      }
      else {
        console.error(
          styleText('red', `[${packageName}]`),
          styleText('red', `✗ Build failed in ${duration}s`),
        )
        if (stderr)
          console.error(styleText('red', stderr))
        if (stdout)
          console.error(stdout)
        reject(new Error(`${packageName} build failed`))
      }
    })

    child.on('error', (error) => {
      console.error(
        styleText('red', `[${packageName}]`),
        styleText('red', `✗ Build error: ${error.message}`),
      )
      reject(error)
    })
  })
}

async function buildLevel(packages) {
  const validPackages = packages.filter(pkg => !SKIP_PACKAGES.includes(pkg))

  if (validPackages.length === 0)
    return []

  console.log(
    styleText('yellow', '\n▶ Building:'),
    styleText('bold', validPackages.join(', ')),
  )

  try {
    const results = await Promise.all(
      validPackages.map(pkg => buildPackage(pkg)),
    )
    return results
  }
  catch (error) {
    // 如果某个包构建失败，立即停止
    throw error
  }
}

async function buildAll() {
  const overallStartTime = Date.now()
  console.log(styleText('bold', '🚀 Starting parallel package builds...\n'))

  const allResults = []

  try {
    for (let i = 0; i < BUILD_LEVELS.length; i++) {
      const level = BUILD_LEVELS[i]
      const results = await buildLevel(level)
      allResults.push(...results)
    }

    const totalDuration = ((Date.now() - overallStartTime) / 1000).toFixed(2)
    const packageCount = allResults.length

    console.log(
      styleText('green', `\n✓ All packages built successfully!`),
    )
    console.log(
      styleText('bold', `  📦 ${packageCount} packages built in ${totalDuration}s`),
    )

    console.log(styleText('gray', '\n  Build times:'))
    allResults.forEach(({ packageName, duration }) => {
      console.log(styleText('gray', `    • ${packageName.padEnd(15)} ${duration}s`))
    })
  }
  catch (error) {
    console.error(
      styleText('red', `\n✗ Build failed: ${error.message}`),
    )
    process.exit(1)
  }
}

buildAll()
