import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    formatters: true,
    ignores: [
      '**/node_modules/**',
      '**/*.tsbuildinfo',
      '**/dist/**',
      '*.md',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'node/no-process-env': 'off',
      'antfu/no-top-level-await': 'off',
    },
  },
)
