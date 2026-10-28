import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let config;
before(async () => {
  server = await createServer({ appType: 'custom', server: { hmr: false, middlewareMode: true, ws: false } });
  config = (await server.ssrLoadModule('/keystatic.config.ts')).default;
});
after(async () => { await server?.close(); });

async function hydrateImage(field, storedValue, slug) {
  const options = { slug, suggestedFilenamePrefix: undefined };
  const filename = field.filename(storedValue, options);
  const asset = new Uint8Array(await readFile(path.join(field.directory, slug ?? '', filename)));
  const parsed = field.parse(storedValue, { asset, slug });
  assert.ok(parsed?.data.byteLength);
  assert.doesNotThrow(() => field.validate(parsed));
  return { parsed, options };
}

test('gift page images hydrate and serialize through the existing CMS image fields', async () => {
  const page = JSON.parse(await readFile('src/content/giftCardsPage/page.json', 'utf8'));
  for (const section of ['hero', 'intro']) {
    const field = config.singletons.giftCardsPage.schema[section].fields.image;
    const { parsed, options } = await hydrateImage(field, page[section].image);
    const saved = field.serialize(parsed, options);
    assert.match(saved.value, new RegExp(`^cms/giftCardsPage/${section}/image/`));
    assert.equal(path.posix.join(field.directory, saved.asset.filename), `src/assets/images/${saved.value}`);
  }
});

test('both gift articles use slug-scoped CMS images that survive an editor save', async () => {
  for (const slug of ['restaurant-gift-cards-north-park-san-diego', 'thank-you-gifts-san-diego-dinner-gift-card']) {
    const source = await readFile(`src/content/blog/${slug}.mdx`, 'utf8');
    const storedValue = source.match(/^image: "([^"]+)"/m)[1];
    const field = config.collections.blog.schema.image;
    const { parsed, options } = await hydrateImage(field, storedValue, slug);
    const saved = field.serialize(parsed, options);
    assert.equal(saved.value, storedValue);
    assert.equal(path.posix.join(field.directory, slug, saved.asset.filename), `src/assets/images/${storedValue}`);
    assert.ok(config.collections.blog.schema.cta.fields.href);
  }
});

test('the new gift routes are not overridden by legacy Vercel redirects', async () => {
  const deployment = JSON.parse(await readFile('vercel.json', 'utf8'));
  const routes = ['/gift-cards', '/blog/restaurant-gift-cards-north-park-san-diego', '/blog/thank-you-gifts-san-diego-dinner-gift-card'];
  for (const route of routes) {
    assert.ok(!deployment.redirects.some((redirect) => redirect.source === route), route);
  }
});
