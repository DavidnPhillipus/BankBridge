import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import base from './base.mjs';

/**
 * ESLint flat config for the Next.js 15 / React 19 web app.
 */
export default tseslint.config(
  ...base,
  {
    files: ['**/*.{ts,tsx,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // React 19 + Next automatic runtime => no import React in scope needed.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
);
