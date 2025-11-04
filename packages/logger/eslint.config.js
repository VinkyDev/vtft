import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
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
      'no-console': 'off',
      'no-restricted-syntax': 'off',
    },
  },
)
