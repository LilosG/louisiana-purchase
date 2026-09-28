// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

import { readdirSync, readFileSync } from 'node:fs';
import venueSettings from './src/content/venueSettings/settings.json' with { type: 'json' };

// lastmod for blog posts, read at build time from each post's frontmatter
// (updatedDate when set, otherwise date). Static pages have no reliable date
// source, so they get no lastmod.
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
/** @type {Map<string, string>} */
const blogLastmod = new Map();
for (const file of readdirSync(BLOG_DIR)) {
  if (!file.endsWith('.mdx')) continue;
  const frontmatter = readFileSync(new URL(file, BLOG_DIR), 'utf8').split(/^---\s*$/m)[1] ?? '';
  /** @param {string} name */
  const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2})`, 'm'))?.[1];
  const date = field('updatedDate') ?? field('date');
  if (date) blogLastmod.set(file.replace(/\.mdx$/, ''), new Date(`${date}T00:00:00Z`).toISOString());
}
/** @param {import('@astrojs/sitemap').SitemapItem} item */
const serializeSitemapItem = (item) => {
  const slug = new URL(item.url).pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  if (slug && blogLastmod.has(slug)) item.lastmod = blogLastmod.get(slug);
  return item;
};

// Blog category archives (noindex) and paginated blog index pages (/blog/2, …)
// stay crawlable but are not listed in the sitemap.
/** @param {string} page */
const excludeFromSitemap = (page) => {
  const { pathname } = new URL(page);
  return !/^\/blog\/category\//.test(pathname) && !/^\/blog\/\d+\/?$/.test(pathname) && !/\.txt$/.test(pathname);
};

// https://astro.build/config
export default defineConfig({
  site: venueSettings.domain,
  trailingSlash: 'never',
  integrations: [sitemap({ filter: excludeFromSitemap, serialize: serializeSitemapItem }), keystatic(), react(), mdx()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});
