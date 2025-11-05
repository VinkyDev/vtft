#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..');
const SERVER_DIR = resolve(PROJECT_ROOT, 'apps/server');
const DIST_DIR = resolve(SERVER_DIR, 'dist');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    log(`\n> ${command}`, 'blue');
    execSync(command, {
      stdio: 'inherit',
      cwd: SERVER_DIR,
      ...options,
    });
  } catch (error) {
    log(`\n❌ 命令执行失败: ${command}`, 'red');
    cleanup();
    process.exit(1);
  }
}

function cleanup() {
  try {
    execSync('node scripts/prepareServerPackage.mjs restore', {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
    });
  } catch (error) {
    // 忽略清理错误
  }
}

// 获取命令行参数
const args = process.argv.slice(2);
const imageName = args[0] || 'vtft-server';
const imageTag = args[1] || 'latest';
const fullImageName = `${imageName}:${imageTag}`;

log('\n🚀 开始构建 Server Docker 镜像...', 'green');

// 步骤 1: 检查 dist 目录
log('\n📦 检查构建产物...', 'yellow');
if (!existsSync(DIST_DIR)) {
  log('❌ 未找到 dist 目录,先构建 server...', 'red');
  exec('pnpm build', { cwd: SERVER_DIR });
} else {
  log('✓ 已找到构建产物', 'green');
}

// 步骤 2: 使用 prepareServerPackage 准备精简的 package.json
log('\n🔧 准备 package.json...', 'yellow');
try {
  execSync('node scripts/prepareServerPackage.mjs prepare', {
    stdio: 'inherit',
    cwd: PROJECT_ROOT,
  });
} catch (error) {
  log(`❌ 准备文件失败`, 'red');
  cleanup();
  process.exit(1);
}

// 步骤 3: 构建 Docker 镜像
log(`\n🐳 构建 Docker 镜像 ${fullImageName}`, 'yellow');
exec(`docker build -t ${fullImageName} .`);

// 清理临时文件
log('\n🔄 清理临时文件...', 'yellow');
cleanup();

// 步骤 4: 验证镜像
log('\n✅ 验证镜像...', 'yellow');
exec(`docker images ${imageName}`);

log('\n✨ Docker 镜像构建成功!', 'green');
log(`\n镜像名称: ${fullImageName}`, 'green');
log('\n快速命令:', 'yellow');
log(`  运行:   docker run -p 3000:3000 --name vtft-server --env-file apps/server/.env ${fullImageName}`, 'blue');
log(`  停止:   docker stop vtft-server`, 'blue');
log(`  删除:   docker rm vtft-server`, 'blue');
log(`  日志:   docker logs -f vtft-server`, 'blue');
log('\n推送到 Docker Hub:', 'yellow');
log(`  docker tag ${fullImageName} <your-username>/${imageName}:${imageTag}`, 'blue');
log(`  docker push <your-username>/${imageName}:${imageTag}`, 'blue');
