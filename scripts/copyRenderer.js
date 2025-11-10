import { join } from 'node:path'
import { cp, rm, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { PROJECT_ROOT, success, error, info, section } from './utils/index.mjs'

/**
 * 复制 React 渲染进程文件到 Electron 输出目录
 */
async function copyRenderer() {
  await section('复制渲染进程文件', async () => {
    const rendererDir = join(PROJECT_ROOT, 'apps/electron/out/renderer')
    const sourceDir = join(PROJECT_ROOT, 'apps/react/dist')

    // 检查源目录是否存在
    if (!existsSync(sourceDir)) {
      throw new Error(`源目录不存在: ${sourceDir}`)
    }

    // 删除旧的渲染进程目录
    if (existsSync(rendererDir)) {
      info('删除旧的渲染进程文件...')
      await rm(rendererDir, { recursive: true, force: true })
    }

    // 创建目标目录
    await mkdir(rendererDir, { recursive: true })

    // 复制文件
    info(`从 ${sourceDir} 复制到 ${rendererDir}`)
    await cp(sourceDir, rendererDir, { recursive: true })

    success('✨ 渲染进程文件复制成功')
  })
}

copyRenderer().catch((err) => {
  error(`复制失败: ${err.message}`)
  process.exit(1)
})
