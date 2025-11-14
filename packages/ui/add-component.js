#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COMPONENTS_DIR = path.join(__dirname, 'src/components')
const INDEX_FILE = path.join(__dirname, 'src/components/index.ts')

function runCommand(command) {
  try {
    console.log(`执行命令: ${command}`)
    execSync(command, { stdio: 'inherit', cwd: __dirname })
  } catch (error) {
    console.error(`命令执行失败: ${error.message}`)
    process.exit(1)
  }
}

function fixImports() {
  console.log('修复导入路径...')
  
  const files = fs.readdirSync(COMPONENTS_DIR)
    .filter(file => file.endsWith('.tsx') && file !== 'index.ts')
  
  files.forEach(file => {
    const filePath = path.join(COMPONENTS_DIR, file)
    let content = fs.readFileSync(filePath, 'utf8')
    
    const oldImport = 'import { cn } from "ui/lib/utils"'
    const newImport = 'import { cn } from "utils"'
    
    if (content.includes(oldImport)) {
      content = content.replace(oldImport, newImport)
      fs.writeFileSync(filePath, content)
      console.log(`已修复导入: ${file}`)
    }
  })
}

function updateIndexFile(componentName) {
  console.log('更新组件索引文件...')
  
  let indexContent = ''
  if (fs.existsSync(INDEX_FILE)) {
    indexContent = fs.readFileSync(INDEX_FILE, 'utf8')
  }
  
  const exportLine = `export * from './${componentName}'`
  
  if (!indexContent.includes(exportLine)) {
    if (indexContent.trim() && !indexContent.endsWith('\n')) {
      indexContent += '\n'
    }
    indexContent += exportLine + '\n'
    fs.writeFileSync(INDEX_FILE, indexContent)
    console.log(`已添加导出: ${exportLine}`)
  } else {
    console.log(`导出已存在: ${exportLine}`)
  }
}

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0].startsWith('-')) {
    console.error('请提供组件名称')
    console.log('用法: node add-component.js <组件名称>')
    process.exit(1)
  }
  
  const componentName = args[0]
  
  console.log(`正在添加组件: ${componentName}`)
  
  // 执行 shadcn add 命令
  runCommand(`pnpm dlx shadcn@latest add ${componentName}`)
  
  // 修复导入路径
  fixImports()
  
  // 更新索引文件
  updateIndexFile(componentName)
  
  console.log(`✅ 组件 ${componentName} 添加完成！`)
}

main()