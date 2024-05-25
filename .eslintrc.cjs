module.exports = {
  extends: ['mantine', 'plugin:@next/next/recommended', 'plugin:jest/recommended'],
  plugins: [
    'testing-library',
    'jest',
    "react",
    "react-hooks",
    "simple-import-sort",
  ],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "quotes": ["error", "single"]
  },
};
