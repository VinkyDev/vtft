import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'
import { createReactLibConfig } from 'config/rslib.config'

export default defineConfig({
  ...createReactLibConfig(),
  plugins: [pluginReact()],
})
