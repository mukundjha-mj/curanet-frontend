import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      unicorn,
    },
    rules: {
      'react-refresh/only-export-components': ['error', {
        allowConstantExport: true,
        allowExportNames: ['useSidebar'],
      }],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/components/**/*.tsx', 'src/pages/**/*.tsx'],
    rules: {
      'unicorn/filename-case': ['error', {
        case: 'kebabCase',
      }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportNamedDeclaration > FunctionDeclaration[id.name!=/^(?:[A-Z][A-Za-z0-9]*|use[A-Z][A-Za-z0-9]*)$/]',
          message: 'Exported names in TSX files must be PascalCase components or useX hooks.',
        },
        {
          selector: 'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name!=/^(?:[A-Z][A-Za-z0-9]*|use[A-Z][A-Za-z0-9]*)$/]',
          message: 'Exported names in TSX files must be PascalCase components or useX hooks.',
        },
      ],
    },
  },
])
