import type { LibConfig, RslibConfig } from '@rslib/core'

export const nodeLibConfig: LibConfig = {
  format: 'esm',
  syntax: ['node 18'],
  dts: true,
}

export function createNodeLibConfig(
  entry: string | Record<string, string | string[]> = './src/index.ts',
): RslibConfig {
  const sourceEntry = typeof entry === 'string' ? { index: entry } : entry

  return {
    source: {
      entry: sourceEntry,
    },
    lib: [nodeLibConfig],
    output: {
      sourceMap: true,
    },
  }
}

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
      sourceMap: true,
    },
  }
}
