import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from '@rslib/core'
import { nodeLibConfig } from 'config/rslib.config'

function getExternalDeps() {
  const pkgPath = resolve(__dirname, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const deps = pkg.dependencies || {}
  return Object.keys(deps).filter(name => !deps[name]?.startsWith('workspace:'))
}

const externalDeps = getExternalDeps()

export default defineConfig({
  lib: [{
    ...nodeLibConfig,
    dts: false,
    autoExternal: false,
  }],
  resolve: {
    alias: {
      db: resolve(__dirname, '../../packages/db/dist'),
      logger: resolve(__dirname, '../../packages/logger/dist'),
      utils: resolve(__dirname, '../../packages/utils/dist'),
      scraper: resolve(__dirname, '../../packages/scraper/dist'),
    },
  },
  output: {
    sourceMap: false,
    externals: {
      ...Object.fromEntries(externalDeps.map(dep => [dep, dep])),
      'kerberos': 'commonjs kerberos',
      '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
      '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
      'gcp-metadata': 'commonjs gcp-metadata',
      'snappy': 'commonjs snappy',
      'aws4': 'commonjs aws4',
      'mongodb-client-encryption': 'commonjs mongodb-client-encryption',
    },
  },
})
