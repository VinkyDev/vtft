#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import * as Minio from 'minio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

dotenv.config({ path: path.join(projectRoot, '.env') })

const distDir = path.resolve(projectRoot, 'apps/electron/dist')

const config = {
  endpoint: process.env.MINIO_ENDPOINT,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucket: process.env.MINIO_BUCKET,
  releaseDir: 'releases',
}

const MAX_RETRIES = 3
const RETRY_DELAY = 5000
const CONCURRENCY = 3

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function uploadWithRetry(client, bucket, remotePath, localPath, fileName, fileSize) {
  let lastError

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const startTime = Date.now()
      const retryTag = attempt > 1 ? ` [重试 ${attempt}/${MAX_RETRIES}]` : ''
      console.log(`⏳ ${fileName} (${formatBytes(fileSize)})${retryTag}`)

      await client.fPutObject(bucket, remotePath, localPath)

      const duration = ((Date.now() - startTime) / 1000).toFixed(1)
      const speed = formatBytes(fileSize / (Date.now() - startTime) * 1000) + '/s'
      console.log(`✅ ${fileName} - ${duration}s - ${speed}`)
      return true
    }
    catch (error) {
      lastError = error
      console.error(`❌ ${fileName}: ${error.message}`)
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY)
      }
    }
  }

  throw new Error(`${fileName} 上传失败: ${lastError?.message}`)
}

async function runWithConcurrency(tasks, concurrency) {
  const results = []
  const executing = new Set()

  for (const task of tasks) {
    const promise = task().finally(() => executing.delete(promise))
    executing.add(promise)
    results.push(promise)

    if (executing.size >= concurrency) {
      await Promise.race(executing)
    }
  }

  return Promise.allSettled(results)
}

async function main() {
  if (!config.accessKey || !config.secretKey) {
    console.error('❌ 请设置 MINIO_ACCESS_KEY 和 MINIO_SECRET_KEY')
    process.exit(1)
  }

  if (!fs.existsSync(distDir)) {
    console.error(`❌ 构建目录不存在: ${distDir}`)
    process.exit(1)
  }

  const allFiles = fs.readdirSync(distDir).filter(f => FILE_PATTERNS.some(p => p.test(f)))
  if (allFiles.length === 0) {
    console.error('❌ 未找到需要上传的文件')
    process.exit(1)
  }

  const latestFiles = allFiles.filter(f => f.startsWith('latest'))
  const releaseFiles = allFiles.filter(f => !f.startsWith('latest'))

  const getFileInfo = file => ({
    file,
    localPath: path.join(distDir, file),
    size: fs.statSync(path.join(distDir, file)).size,
  })

  const releaseInfos = releaseFiles.map(getFileInfo)
  const latestInfos = latestFiles.map(getFileInfo)

  const client = new Minio.Client({
    endPoint: config.endpoint,
    port: 443,
    useSSL: true,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  })

  const totalSize = [...releaseInfos, ...latestInfos].reduce((sum, f) => sum + f.size, 0)
  console.log(`\n📦 上传 ${allFiles.length} 个文件 (${formatBytes(totalSize)}) 到 ${config.bucket}/${config.releaseDir}/\n`)

  const startTime = Date.now()
  const createTask = ({ file, localPath, size }) => () =>
    uploadWithRetry(client, config.bucket, `${config.releaseDir}/${file}`, localPath, file, size)

  const releaseResults = await runWithConcurrency(releaseInfos.map(createTask), CONCURRENCY)

  const releaseFailed = releaseResults.filter(r => r.status === 'rejected')
  if (releaseFailed.length > 0) {
    console.error(`\n❌ ${releaseFailed.length} 个文件上传失败，跳过 latest.yml 上传`)
    releaseFailed.forEach(r => console.error(`   - ${r.reason?.message || r.reason}`))
    process.exit(1)
  }

  console.log(`\n📋 上传版本清单文件...`)
  const latestResults = await runWithConcurrency(latestInfos.map(createTask), CONCURRENCY)

  const latestFailed = latestResults.filter(r => r.status === 'rejected')
  if (latestFailed.length > 0) {
    console.error(`\n❌ latest.yml 上传失败`)
    latestFailed.forEach(r => console.error(`   - ${r.reason?.message || r.reason}`))
    process.exit(1)
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n✅ ${allFiles.length} 个文件上传成功 (${totalDuration}s)`)
  console.log(`🔗 https://${config.endpoint}/${config.bucket}/${config.releaseDir}/`)
}

main().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
