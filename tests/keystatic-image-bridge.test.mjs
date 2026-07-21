import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { after, before, test } from 'node:test';

import { createServer } from 'vite';

let config;
let server;

const migratedCollections = [
  'cocktailsMenu',
  'kitchenRawFire',
  'kitchenPlates',
  'brunchMenuItems',
  'eventCategoryCards',
  'spaceGalleryCards',
];

before(async () => {
  server = await createServer({
    appType: 'custom',
    configFile: false,
    server: { hmr: false, middlewareMode: true, ws: false },
  });
  config = (await server.ssrLoadModule('/keystatic.config.ts')).default;
});

after(async () => {
  await server?.close();
});

async function hydrate(field, storedValue, slug) {
  const filename = field.filename(storedValue, {
    slug,
    suggestedFilenamePrefix: undefined,
  });
  let asset;
  if (filename) {
    try {
      asset = new Uint8Array(await readFile(path.join(field.directory, slug ?? '', filename)));
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
  return {
    filename,
    value: field.parse(storedValue, { asset, slug }),
  };
}

function menuIndexPageHeroImageField() {
  return config.singletons.menuIndexPage.schema.blocks.element.values.PageHero.fields.image;
}

test('hydrates a singleton __IMAGE__ JPG token from the legacy image directory', async () => {
  const field = menuIndexPageHeroImageField();
  const result = await hydrate(
    field,
    '__IMAGE__louisiana-purchase-north-park-restaurant-and-bar-website',
  );

  assert.equal(result.filename, 'louisiana-purchase-north-park-restaurant-and-bar-website.jpg');
  assert.equal(result.value?.filename, result.filename);
  assert.equal(result.value?.extension, 'jpg');
  assert.ok(result.value?.data.byteLength > 0);
  assert.doesNotThrow(() => field.validate(result.value));
});

test('hydrates a migrated collection image from its slug-scoped directory', async () => {
  const field = config.collections.cocktailsMenu.schema.image;
  const result = await hydrate(
    field,
    'cms/cocktailsMenu/image/hurricane-pop/louisiana-purchase-hurricane-pop-cocktail-north-park-website.jpg',
    'hurricane-pop',
  );

  assert.equal(field.directory, 'src/assets/images/cms/cocktailsMenu/image');
  assert.equal(result.filename, 'louisiana-purchase-hurricane-pop-cocktail-north-park-website.jpg');
  assert.equal(result.value?.filename, result.filename);
  assert.ok(result.value?.data.byteLength > 0);
});

test('resolves the legacy WebP key with its real extension', async () => {
  const field = menuIndexPageHeroImageField();
  const result = await hydrate(
    field,
    '__IMAGE__louisiana-purchase-street-corner-exterior-north-park-website',
  );

  assert.equal(result.filename, 'louisiana-purchase-street-corner-exterior-north-park-website.webp');
  assert.equal(result.value?.extension, 'webp');
  assert.ok(result.value?.data.byteLength > 0);
});

test('round-trips newly saved cms values under src/assets/images/cms', () => {
  const field = menuIndexPageHeroImageField();
  const storedValue = 'cms/menuIndexPage/blocks/PageHero/image/new-hero.jpg';
  const bytes = new Uint8Array([1, 2, 3]);

  assert.equal(
    field.filename(storedValue, { slug: undefined, suggestedFilenamePrefix: undefined }),
    storedValue,
  );

  const parsed = field.parse(storedValue, { asset: bytes, slug: undefined });
  assert.equal(parsed?.filename, 'new-hero.jpg');

  const serialized = field.serialize(parsed, {
    slug: undefined,
    suggestedFilenamePrefix: undefined,
  });
  assert.equal(serialized.value, storedValue);
  assert.equal(serialized.asset?.filename, storedValue);
  assert.equal(
    path.posix.join(field.directory, serialized.asset.filename),
    'src/assets/images/cms/menuIndexPage/blocks/PageHero/image/new-hero.jpg',
  );
});

test('writes a new collection upload with its slug exactly once', () => {
  const field = config.collections.cocktailsMenu.schema.image;
  const slug = 'hurricane-pop';
  const filename = 'new-cocktail.jpg';
  const serialized = field.serialize(
    {
      data: new Uint8Array([1, 2, 3]),
      extension: 'jpg',
      filename,
    },
    { slug, suggestedFilenamePrefix: undefined },
  );
  const finalAssetPath = path.posix.join(
    field.directory,
    slug,
    serialized.asset.filename,
  );

  assert.equal(serialized.value, `cms/cocktailsMenu/image/${slug}/${filename}`);
  assert.equal(
    finalAssetPath,
    `src/assets/images/cms/cocktailsMenu/image/${slug}/${filename}`,
  );
  assert.equal(finalAssetPath.match(new RegExp(`/${slug}/`, 'g'))?.length, 1);
});

test('a genuinely missing required legacy asset remains invalid', async () => {
  const field = config.collections.eventCategoryCards.schema.image;
  const result = await hydrate(field, '__IMAGE__this-required-image-does-not-exist');

  assert.equal(result.value, null);
  assert.throws(() => field.validate(result.value), /Card Photo is required/);
});

test('all 32 migrated collection values resolve to files in their slug-scoped directories', async () => {
  let migratedCount = 0;

  for (const collection of migratedCollections) {
    const files = (await readdir(`src/content/${collection}`)).filter((file) => file.endsWith('.json'));
    for (const file of files) {
      const slug = path.basename(file, '.json');
      const data = JSON.parse(await readFile(`src/content/${collection}/${file}`, 'utf8'));
      assert.match(data.image, new RegExp(`^cms/${collection}/image/${slug}/[^/]+\\.(?:jpg|jpeg|png|webp|avif)$`));
      await access(path.join('src/assets/images', data.image));
      migratedCount++;
    }
  }

  assert.equal(migratedCount, 32);
});

test('representative migrated collection entries hydrate and validate in Keystatic', async () => {
  const samples = [
    ['cocktailsMenu', 'hurricane-pop'],
    ['kitchenRawFire', 'acme-oysters'],
    ['kitchenPlates', 'dooky-chase'],
    ['brunchMenuItems', 'catfish-n-grits'],
    ['eventCategoryCards', 'seasonal-menus'],
    ['spaceGalleryCards', 'marble-bar'],
  ];

  for (const [collection, slug] of samples) {
    const data = JSON.parse(await readFile(`src/content/${collection}/${slug}.json`, 'utf8'));
    const field = config.collections[collection].schema.image;
    const result = await hydrate(field, data.image, slug);
    assert.ok(result.value, `${collection}/${slug} did not hydrate`);
    assert.doesNotThrow(() => field.validate(result.value));
  }
});
