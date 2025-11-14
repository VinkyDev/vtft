import type { LibConfig, RslibConfig } from '@rslib/core'

/**
 * 通用的 Node.js 库配置
 * 适用于大部分后端/工具包
 */
export const nodeLibConfig: LibConfig = {
  format: 'esm',
  syntax: ['node 18'],
  dts: true,
}

/**
 * 创建基础的 rslib 配置
 * @param entry - 入口文件路径,默认为 './src/index.ts'
 * @param lib - 库配置数组,默认使用 nodeLibConfig
 */
export function createRslibConfig(
  entry: string | Record<string, string | string[]> = './src/index.ts',
  lib: LibConfig[] = [nodeLibConfig],
): RslibConfig {
  const sourceEntry = typeof entry === 'string' ? { index: entry } : entry

  return {
    source: {
      entry: sourceEntry,
    },
    lib,
  }
}

/**
 * 创建 Node.js 库的默认配置
 * @param entry - 入口文件路径,默认为 './src/index.ts'
 */
export function createNodeLibConfig(
  entry: string | Record<string, string | string[]> = './src/index.ts',
): RslibConfig {
  return createRslibConfig(entry, [nodeLibConfig])
}

/**
 * 创建 React 库的配置
 * 需要在使用方自行导入和配置 @rsbuild/plugin-react
 * @param entry - 入口文件路径
 * @param bundle - 是否打包,默认 false
 */
export function createReactLibConfig(
  entry: string | Record<string, string | string[]> = { index: ['./src/**'] },
  bundle = false,
): Omit<RslibConfig, 'plugins'> {
  const sourceEntry = typeof entry === 'string' ? { index: entry } : entry

  return {
    source: {
      entry: sourceEntry,
    },
    lib: [
      {
        bundle,
        dts: true,
        format: 'esm',
      },
    ],
    output: {
      target: 'web',
    },
  }
}
