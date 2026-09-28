// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

import venueSettings from './src/content/venueSettings/settings.json' with { type: 'json' };

// Blog category archives (noindex) and paginated blog index pages (/blog/2, …)
// stay crawlable but are not listed in the sitemap.
const excludeFromSitemap = (page) => {
  const { pathname } = new URL(page);
  return !/^\/blog\/category\//.test(pathname) && !/^\/blog\/\d+\/?$/.test(pathname);
};

// https://astro.build/config
export default defineConfig({
  site: venueSettings.domain,
  trailingSlash: 'never',
  integrations: [sitemap({ filter: excludeFromSitemap }), keystatic(), react(), mdx()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});
