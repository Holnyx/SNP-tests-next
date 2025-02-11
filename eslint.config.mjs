import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import configPrettier from 'eslint-config-prettier';
import pluginJs from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  configPrettier,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      import: pluginImport,
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
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
              pattern: '{./*.module.*,classnames}',
              group: 'sibling',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          distinctGroup: true,
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'no-undef': 'error',
    },
  },
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
];
