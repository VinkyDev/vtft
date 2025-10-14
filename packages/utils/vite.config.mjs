import baseViteConfig from 'config/vite.config.base'
import { defineConfig, mergeConfig } from 'vite'

export default defineConfig((configEnv) => {
  const customConfig = {}

  return mergeConfig(
    baseViteConfig({
      pkgRoot: __dirname,
      configEnv,
    }),
    customConfig,
  )
})
