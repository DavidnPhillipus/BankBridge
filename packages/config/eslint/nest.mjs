import globals from 'globals';
import tseslint from 'typescript-eslint';
import base from './base.mjs';

/**
 * ESLint flat config for the NestJS API (Node environment + decorators).
 */
export default tseslint.config(...base, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
  rules: {
    // NestJS relies heavily on decorators + DI; these relaxations are idiomatic.
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
});
