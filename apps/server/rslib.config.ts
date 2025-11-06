import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rslib/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getWorkspaceInternals(pkgPath: string) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const deps = pkg.dependencies || {}
  const devDeps = pkg.devDependencies || {}

  const workspaceDeps = Object.keys({
    ...deps,
    ...devDeps,
  }).filter((name) => {
    const version = deps[name] || devDeps[name]
    return typeof version === 'string' && version.startsWith('workspace:')
  })

  return workspaceDeps
}

export default defineConfig(() => {
  const pkgPath = join(__dirname, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  const workspaceDeps = getWorkspaceInternals(pkgPath)

  const externals = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'playwright',
  ]

  const alias: Record<string, string> = {}
  for (const name of workspaceDeps) {
    alias[name] = resolve(__dirname, `../../packages/${name}/dist`)
  }

  return {
    source: {
      entry: {
        index: 'src/index.ts',
      },
    },
    resolve: {
      alias,
    },
    output: {
      distPath: {
        root: 'dist',
      },
      cleanDistPath: true,
      sourceMap: true,
      externals,
      minify: false,
    },
    lib: [
      {
        format: 'esm' as const,
        syntax: ['node 18'],
        autoExternal: false,
      },
    ],
    dts: false,
  }
})
