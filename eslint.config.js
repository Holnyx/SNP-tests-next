import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

import pluginJs from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  configPrettier,
  {
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
      import: pluginImport,
      'unused-imports': pluginUnusedImports,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          reservedFirst: true,
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Встроенные модули (fs, path и т. д.)
            'external', // Внешние библиотеки (react, redux, motion, uuid)
            'internal', // Внутренние компоненты (../)
            'parent', // Родительские папки (../../)
            'sibling', // Файлы из той же директории (./)
            'index', // index.js в той же папке
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '{react,**react**,**/react,next/**,**next**}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '{@/components/**,../*}',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'parent',
              position: 'after',
            },
            {
              pattern: '{./*.module.*,classnames}', // Объединяем стили и classnames
              group: 'sibling',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react, next'],
          'newlines-between': 'always', // Пустая строка между группами
          alphabetize: {
            order: 'asc', // Импорты внутри групп сортируются по алфавиту
            caseInsensitive: true, // Игнорировать регистр букв
          },
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'prettier/prettier': 'error',
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: false,
        },
      ],
      'no-undef': 'error',
    },
  },
];
