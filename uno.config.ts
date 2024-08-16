// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerDirectives,
} from 'unocss';

export default defineConfig({
  presets: [
    presetAttributify({
      prefix: 'un-',
      prefixedOnly: true, // <--
    }),
    presetUno(),
  ],
  transformers: [transformerDirectives()],
});
