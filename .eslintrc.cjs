/** @type {import('eslint').Linter.BaseConfig} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['*.cjs'],
  settings: {},
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-constant-condition': 'warn',
    'no-empty': 'warn',
    // 'jsx-a11y/click-events-have-key-events': 'off',
  },
};

module.exports = config;
