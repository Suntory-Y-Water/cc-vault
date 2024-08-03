/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  // prettierは他の設定の上書きを行うために、必ず最後に配置する。
  env: {
    'jest/globals': true,
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended', // jestプラグインを追加
    'prettier',
  ],
  plugins: ['jest'], // プラグインにjestを追加
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
