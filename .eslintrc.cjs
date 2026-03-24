module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { 
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_'
    }],
    'no-console': 'warn',
    'no-debugger': 'warn',
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    '*.config.js',
    '*.config.cjs',
    '*.config.mjs',
  ],
}
