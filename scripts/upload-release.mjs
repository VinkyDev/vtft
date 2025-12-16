#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Minio from 'minio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'apps/electron/dist')

const config = {
  endpoint: process.env.MINIO_ENDPOINT,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucket: process.env.MINIO_BUCKET,
  releaseDir: 'releases',
}

const FILE_PATTERNS = [
  /^vtft-[\d.]+(-\w+)?-setup\.exe(\.blockmap)?$/,
  /^vtft-[\d.]+(-\w+)?\.(dmg|zip)(\.blockmap)?$/,
  /^vtft-[\d.]+(-\w+)?\.AppImage$/,
  /^latest(-mac|-linux)?\.yml$/,
]

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`
}

async function main() {
  if (!config.accessKey || !config.secretKey) {
    console.error('❌ 请设置环境变量 MINIO_ACCESS_KEY 和 MINIO_SECRET_KEY')
    process.exit(1)
  }

  if (!fs.existsSync(distDir)) {
    console.error(`❌ 构建目录不存在: ${distDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(distDir).filter(f => FILE_PATTERNS.some(p => p.test(f)))
  if (files.length === 0) {
    console.error('❌ 未找到需要上传的文件')
    process.exit(1)
  }

  const client = new Minio.Client({
    endPoint: config.endpoint,
    port: 443,
    useSSL: true,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  })

  console.log(`📦 上传 ${files.length} 个文件到 ${config.bucket}/${config.releaseDir}/\n`)

  for (const file of files) {
    const localPath = path.join(distDir, file)
    const remotePath = `${config.releaseDir}/${file}`
    const size = formatBytes(fs.statSync(localPath).size)

    await client.fPutObject(config.bucket, remotePath, localPath)
    console.log(`✅ ${file} (${size})`)
  }

  console.log(`\n✨ 上传完成: https://${config.endpoint}/${config.bucket}/${config.releaseDir}/`)
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
