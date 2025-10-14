import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    formatters: true,
  },
  {
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'node/no-process-env': 'off',
      'antfu/no-top-level-await': 'off',
    },
  },
)
