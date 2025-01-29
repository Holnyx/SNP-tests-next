import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    rules: {
      // 🔹 Автоматическое расположение хуков перед любыми функциями
      'react-hooks/rules-of-hooks': 'error',

      // 🔹 Следование рекомендациям по deps в useEffect/useCallback/useMemo
      'react-hooks/exhaustive-deps': 'warn',

      // 🔹 Оптимизированный порядок кода внутри React-компонента
      'react/sort-comp': [
        'error',
        {
          order: [
            'static-methods',
            'state',
            'instance-variables',
            'lifecycle',
            'everything-else',
            'render',
          ],
        },
      ],

      // 🔹 Сортировка импорта (альтернативный вариант)
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: [
            ['react', 'next'],
            ['external', 'builtin'],
            'parent',
            'sibling',
            'index',
          ],
        },
      ],

      // 🔹 Сортировка свойств объектов (опционально)
      'perfectionist/sort-objects': [
        'error',
        {
          type: 'natural',
          order: 'asc',
        },
      ],
    },
  },
];
