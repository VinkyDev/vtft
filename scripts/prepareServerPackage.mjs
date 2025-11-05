#!/usr/bin/env node

/**
 * 准备 server 的 package.json 用于 Docker 构建
 * 1. 使用 pnpm deploy 部署 server 子包
 * 2. 移除 workspace 依赖
 * 3. 替换 catalog 依赖为实际版本
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, unlinkSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = resolve(__dirname, '..');
const SERVER_DIR = resolve(PROJECT_ROOT, 'apps/server');
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

function preparePackage() {
  try {
    // 清理可能存在的旧 deploy 目录
    if (existsSync(DEPLOY_DIR)) {
      rmSync(DEPLOY_DIR, { recursive: true, force: true });
    }

    // 使用 pnpm deploy 部署 server 子包
    log('执行 pnpm deploy...', 'blue');
    execSync(`pnpm deploy --filter=server --prod --legacy ${DEPLOY_DIR}`, {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
    });
    log('✓ 部署完成', 'green');

    // 备份原始 package.json
    copyFileSync(PACKAGE_JSON_PATH, PACKAGE_JSON_BACKUP);

    // 从 deploy 目录读取并处理 package.json
    const deployPkg = resolve(DEPLOY_DIR, 'package.json');
    if (!existsSync(deployPkg)) {
      throw new Error('未找到部署后的 package.json');
    }

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

    // 移除所有 workspace 依赖
    let removedCount = 0;
    const removedDeps = [];

    ['dependencies', 'devDependencies'].forEach(depType => {
      if (pkg[depType]) {
        Object.entries(pkg[depType]).forEach(([name, version]) => {
          if (version.startsWith('workspace:')) {
            delete pkg[depType][name];
            removedCount++;
            removedDeps.push(name);
          }
        });
      }
    });

    // 添加 playwright (tsup external 依赖)
    if (!pkg.dependencies.playwright) {
      pkg.dependencies.playwright = '1.49.1';
      log(`  添加 playwright 依赖`, 'green');
    }

    // 替换 catalog: 依赖为实际版本
    let catalogCount = 0;
    ['dependencies', 'devDependencies'].forEach(depType => {
      if (pkg[depType]) {
        Object.keys(pkg[depType]).forEach(dep => {
          if (pkg[depType][dep] === 'catalog:' && catalog[dep]) {
            pkg[depType][dep] = catalog[dep];
            catalogCount++;
          }
        });
      }
    });

    // 写入处理后的 package.json
    writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2));
    if (removedCount > 0) {
      log(`  移除 ${removedCount} 个 workspace 依赖: ${removedDeps.join(', ')}`, 'green');
    }
    log(`  替换 ${catalogCount} 个 catalog 依赖`, 'green');

    return { success: true };
  } catch (error) {
    log(`❌ 准备失败: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

function restorePackage() {
  try {
    if (existsSync(PACKAGE_JSON_BACKUP)) {
      copyFileSync(PACKAGE_JSON_BACKUP, PACKAGE_JSON_PATH);
      unlinkSync(PACKAGE_JSON_BACKUP);
      log('✓ 已恢复原始 package.json', 'green');
    }
    if (existsSync(DEPLOY_DIR)) {
      rmSync(DEPLOY_DIR, { recursive: true, force: true });
    }
    return { success: true };
  } catch (error) {
    log(`❌ 恢复失败: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

function cleanup() {
  if (existsSync(DEPLOY_DIR)) {
    rmSync(DEPLOY_DIR, { recursive: true, force: true });
  }
}

// 命令行接口
const command = process.argv[2];

if (command === 'prepare') {
  const result = preparePackage();
  process.exit(result.success ? 0 : 1);
} else if (command === 'restore') {
  const result = restorePackage();
  process.exit(result.success ? 0 : 1);
} else if (command === 'cleanup') {
  cleanup();
  log('✓ 清理完成', 'green');
  process.exit(0);
} else {
  console.log('用法: node prepareServerPackage.mjs <command>');
  console.log('命令:');
  console.log('  prepare  - 准备 package.json');
  console.log('  restore  - 恢复原始 package.json');
  console.log('  cleanup  - 清理临时文件');
  process.exit(1);
}
