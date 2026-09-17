import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import cspell from '@cspell/eslint-plugin';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '*.config.js',
      '*.config.mjs',
      'lib/**/*.js',
      'lib/**/*.d.ts',
      'docs/**/*.js',
      'src/bundled.jsx',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
      parserOptions: {
        project: 'tsconfig.eslint.json',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier,
      '@cspell': cspell,
    },
    settings: {
      react: { version: 'detect' },
      // Lint peer-dep primitives as the elements they render.
      'jsx-a11y': { components: { Button: 'button' } },
      'import/resolver': {
        typescript: {
          project: 'tsconfig.eslint.json',
        },
      },
    },
    rules: {
      // Prettier
      'prettier/prettier': 'error',

      // React
      'react/require-default-props': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prefer-stateless-function': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-useless-fragment': [2, { allowExpressions: true }],
      'react/prop-types': 'off',

      // React hooks
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',

      // jsx-a11y
      ...jsxA11y.configs.recommended.rules,
      'jsx-a11y/control-has-associated-label': 'error',
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'jsx-a11y/no-autofocus': 'error',
      // Scrollable regions must be keyboard focusable (WCAG 2.1.1).
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['log'], allowExpressionValues: true },
      ],

      // TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',

      // Code quality
      'prefer-const': 'error',
      'max-len': [
        'error',
        120,
        2,
        {
          ignoreUrls: true,
          ignoreComments: false,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'object-curly-newline': 'off',
      'padded-blocks': 'off',
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 5],
      'max-params': ['error', 4],
      complexity: ['error', 20],

      // Spelling
      '@cspell/spellchecker': 'error',

      // Import
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/stories/**/*.*', '**/.storybook/**/*.*', 'spec/**/*.*'],
          peerDependencies: true,
        },
      ],
    },
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['spec/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
);
