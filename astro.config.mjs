// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import venueSettings from './src/content/venueSettings/settings.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: venueSettings.domain,
  trailingSlash: 'never',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
