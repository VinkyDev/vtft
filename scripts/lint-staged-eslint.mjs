#!/usr/bin/env node
import { join } from 'node:path'
import { execSync } from 'node:child_process'

/**
 * 根据文件路径分组并执行 eslint
 * 每个子项目使用自己的 eslint.config.js
 */

const files = process.argv.slice(2)

if (files.length === 0) {
  process.exit(0)
}

// 按子项目分组文件
const filesByProject = new Map()

for (const file of files) {
  // 提取子项目路径 (apps/xxx 或 packages/xxx)
  const match = file.match(/^((?:apps|packages)\/[^/]+)\//)

  if (match) {
    const projectPath = match[1]
    if (!filesByProject.has(projectPath)) {
      filesByProject.set(projectPath, [])
    }
    filesByProject.get(projectPath).push(file)
  }
}

// 对每个子项目执行 eslint
let hasError = false

for (const [projectPath, projectFiles] of filesByProject) {
  const configPath = join(projectPath, 'eslint.config.js')
  const cachePath = `./node_modules/.cache/eslint/${projectPath.replace('/', '-')}`

  const command = [
    'eslint',
    '--fix',
    '--cache',
    '--cache-strategy content',
    `--cache-location ${cachePath}`,
    '--report-unused-disable-directives',
    `--config ${configPath}`,
    ...projectFiles,
  ].join(' ')

  try {
    execSync(command, { stdio: 'inherit' })
  }
  catch (error) {
    hasError = true
  }
}

if (hasError) {
  process.exit(1)
}
