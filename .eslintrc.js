module.exports = {
  root: true,
  extends: ['@stacks/eslint-config', 'plugin:prettier/recommended'],
  parserOptions: {
    project: 'tsconfig.test.json',
  },
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-unused-vars': [2],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    '@typescript-eslint/restrict-plus-operands': [0],
    '@typescript-eslint/no-non-null-assertion': [0],
    '@typescript-eslint/no-loss-of-precision': [0],
  },
};
