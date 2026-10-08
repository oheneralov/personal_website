module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: {
    react: { version: 'detect' },
    'import/resolver': { node: { extensions: ['.js', '.jsx'] } },
  },
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
  rules: {
    // The automatic JSX runtime makes importing React in every file unnecessary.
    'react/react-in-jsx-scope': 'off',
    // defaultProps on function components is deprecated; default arguments replace it.
    'react/require-default-props': ['error', { functions: 'defaultArguments' }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.{js,jsx}', 'vite.config.js'] },
    ],
  },
};
