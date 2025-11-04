import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: [
          'types',
          'utils',
          'logger',
        ],
      }),
    ],
    resolve: {
      alias: {
        types: resolve('../../packages/types/src'),
        utils: resolve('../../packages/utils/src'),
        logger: resolve('../../packages/logger/src'),
      },
    },
    build: {
      rollupOptions: {
        external: [
          'electron',
        ],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
})
