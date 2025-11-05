#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, unlinkSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..');
const SERVER_DIR = resolve(PROJECT_ROOT, 'apps/server');
const DIST_DIR = resolve(SERVER_DIR, 'dist');
const DEPLOY_DIR = resolve(SERVER_DIR, '.deploy');
const PACKAGE_JSON_PATH = resolve(SERVER_DIR, 'package.json');
const PACKAGE_JSON_BACKUP = resolve(SERVER_DIR, 'package.json.backup');

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

function restorePackageJson() {
  if (existsSync(PACKAGE_JSON_BACKUP)) {
    copyFileSync(PACKAGE_JSON_BACKUP, PACKAGE_JSON_PATH);
    unlinkSync(PACKAGE_JSON_BACKUP);
    log('\n✓ 已恢复原始 package.json', 'green');
  }
}

function cleanup() {
  restorePackageJson();
  // 清理 deploy 目录
  if (existsSync(DEPLOY_DIR)) {
    rmSync(DEPLOY_DIR, { recursive: true, force: true });
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

// 步骤 2: 使用 pnpm deploy 准备精简的 package.json
log('\n🔧 pnpm deploy...', 'yellow');
try {
  // 清理可能存在的旧 deploy 目录
  if (existsSync(DEPLOY_DIR)) {
    rmSync(DEPLOY_DIR, { recursive: true, force: true });
  }

  // 使用 pnpm deploy 部署 server 子包
  execSync(`pnpm deploy --filter=server --prod --legacy ${DEPLOY_DIR}`, {
    stdio: 'inherit',
    cwd: PROJECT_ROOT,
  });
  log('✓ 部署完成', 'green');

  // 备份原始 package.json
  copyFileSync(PACKAGE_JSON_PATH, PACKAGE_JSON_BACKUP);

  // 从 deploy 目录读取并处理 package.json
  const deployPkg = resolve(DEPLOY_DIR, 'package.json');
  if (existsSync(deployPkg)) {
    // 读取 catalog 配置
    const workspaceYaml = readFileSync(resolve(PROJECT_ROOT, 'pnpm-workspace.yaml'), 'utf-8');
    const catalog = {};
    const catalogMatch = workspaceYaml.match(/catalog:\s*([\s\S]*?)(?=\n\S|\n*$)/);
    if (catalogMatch) {
      const catalogContent = catalogMatch[1];
      const lines = catalogContent.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        const match = line.match(/^\s*['"]?([^:'"]+)['"]?\s*:\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          catalog[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
        }
      });
    }

    // 读取并处理 package.json
    const pkg = JSON.parse(readFileSync(deployPkg, 'utf-8'));

    // 移除 workspace 依赖(这些已经被 tsup 打包进 dist 了)
    const workspaceDeps = ['crawler', 'db', 'logger', 'types'];
    let removedCount = 0;
    workspaceDeps.forEach(dep => {
      if (pkg.dependencies?.[dep]) {
        delete pkg.dependencies[dep];
        removedCount++;
      }
      if (pkg.devDependencies?.[dep]) {
        delete pkg.devDependencies[dep];
      }
    });

    // 替换 catalog: 依赖为实际版本
    let catalogCount = 0;
    ['dependencies', 'devDependencies'].forEach(depType => {
      if (pkg[depType]) {
        Object.keys(pkg[depType]).forEach(dep => {
          if (pkg[depType][dep]?.startsWith('catalog:') && catalog[dep]) {
            pkg[depType][dep] = catalog[dep];
            catalogCount++;
          }
        });
      }
    });

    // 写入处理后的 package.json
    writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2));
    log(`  移除 ${removedCount} 个 workspace 依赖`, 'green');
    log(`  替换 ${catalogCount} 个 catalog 依赖`, 'green');
  }
} catch (error) {
  log(`❌ 准备文件失败: ${error.message}`, 'red');
  cleanup();
  process.exit(1);
}

// 步骤 3: 构建 Docker 镜像
log(`\n🐳 构建 Docker 镜像 ${fullImageName}`, 'yellow');
cleanup();
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
