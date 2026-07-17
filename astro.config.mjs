// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import { CANONICAL_DOMAIN } from './src/data/venue.ts';

// https://astro.build/config
export default defineConfig({
  site: CANONICAL_DOMAIN,
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});