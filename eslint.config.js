import nuxt from '@nuxt/eslint-config';

export default [
  ...nuxt,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'prettier/prettier': ['warn']
    },
  },
];