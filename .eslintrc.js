/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  // prettierは他の設定の上書きを行うために、必ず最後に配置する。
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
