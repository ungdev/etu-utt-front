import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';

export default defineConfig([
  js.configs.recommended,
  ...nextVitals,
  {
    name: 'prettier',
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    name: 'typescript',
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'after-used', vars: 'all', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    }
  },
  {
    name: 'react',
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      'react/require-default-props': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    rules: {
      'no-console': 'warn',
      'no-alert': 'error',
      'no-redeclare': 'off',
      'linebreak-style': ['warn', 'unix'],
      'import/default': 'off',
      '@next/next/no-img-element': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
  globalIgnores(['.next/**/*', '**/*.mjs', '**/*.js'])
]);
