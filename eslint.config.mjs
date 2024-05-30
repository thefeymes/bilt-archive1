// eslint.config.mjs
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    unocss: true,
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
    },
    // this won't work https://github.com/eslint/eslint/issues/17400
    // ignores: ['docs/'],
  },
  {
    ignores: ['docs/'],
  }
);
