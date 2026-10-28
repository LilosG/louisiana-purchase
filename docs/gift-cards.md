# Gift cards

The `/gift-cards` page uses the existing `Layout`, `PageHero`, `AlternatingRow`, `SectionHeader`, `FourColumnGrid`, and `CTABand` components. Checkout stays on Toast; this site does not collect gift-card payment details.

## Editing

- **Keystatic → Website → Gift Cards:** page copy, SEO fields, photos, purchase label, delivery steps, and links to the two guides.
- **Keystatic → Site Settings → Venue / Business Data → Gift Cards:** the purchase and balance URLs. These are the single source for the page's vendor links. The retired `PUBLIC_GIFT_CARD_URL` setting is no longer used.
- **Keystatic → Navigation:** Gift Cards links to `/gift-cards` on desktop and mobile. About remains in the footer.
- **Keystatic → Blog Posts:** both guides use the existing MDX editor and category system. Optional Article Call to Action fields render the shared CTA band; leave all three required display values (heading, button text, destination) blank to omit it.

The new guide images use the existing slug-scoped `src/assets/images/cms/blog/image/<slug>/` convention. Their bytes reuse existing venue photographs. Astro generates responsive WebP images for these article heroes and archive cards; existing public-path blog image handling remains supported.

## Routes

- `/gift-cards`
- `/blog/restaurant-gift-cards-north-park-san-diego`
- `/blog/thank-you-gifts-san-diego-dinner-gift-card`

The gift page links to both guides; each guide links back to the gift page and to relevant dining content. Blog indexes, category archives, related-post lists, and the sitemap use the existing collection pipeline.

## Tracking and checks

The existing delegated analytics handler recognizes Toast's `/egiftcards/` URL as `gift_card_click`. Privacy opt-out and GPC behavior are unchanged. The regression test exercises the actual analytics script and the central purchase URL.

```bash
npx astro check
npm run build
node --test tests/gift-cards-cms.test.mjs tests/mobile-action-bar.test.mjs
```

The CMS tests hydrate both page images and both article images, validate them, and verify their serialized asset paths. The mobile-action-bar suite also checks gift purchase versus online-order events, privacy suppression, and the built public pages' action bars.

At implementation time, the full `npm test` suite has four pre-existing failures in `tests/keystatic-image-bridge.test.mjs`, reproduced on unchanged main `9d5ab6c`: legacy singleton image expectations, the removed `hurricane-pop` fixture, an old 32-item migration assertion, and representative entries referencing retired menu collections. These are separate from the passing gift-card and analytics checks.

The Toast purchase and balance destinations were opened and checked without submitting a purchase or card number. Visual review should cover the gift page, both articles, navigation, footer, keyboard access, and narrow screens before production release.
