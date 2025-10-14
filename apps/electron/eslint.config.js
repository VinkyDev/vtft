import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    formatters: true,
    ignores: ['out', '**/*.d.ts'],
  },
  {
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      'ts/no-floating-promises': 'off',
    },
  },
)
