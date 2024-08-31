module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      'vue/no-multiple-template-root': 'off', 
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
        },
      ],
    },
  };