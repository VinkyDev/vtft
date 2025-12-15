import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'react/no-array-index-key': 'off',
  },
})
