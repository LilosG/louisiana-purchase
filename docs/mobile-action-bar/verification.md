# Mobile Reserve / Call bar

Implemented on `feature/mobile-reserve-call-bar`, based on current `origin/main` (`f3dc383`). The working tree was clean before editing; origin is `https://github.com/LilosG/louisiana-purchase.git`, default branch `main`. No AGENTS.md was present in the repository or its parent directories. Coco Maya's MobileStickyCTA and BaseLayout were read as references only.

## Implementation

`MobileActionBar.astro` is rendered once by the shared public Layout. All 36 built public HTML pages (including blog, event detail pages, privacy and 404) have the two semantic links. No framework hydration, dependencies or page edits. Visibility uses SiteNav's 1280px desktop breakpoint. The existing viewport already includes `viewport-fit=cover`.

Actions have a 56px minimum height plus `env(safe-area-inset-bottom)`. A shared CSS reserve supplies body padding, scroll padding and the privacy notice offset; its text allowance supports wrapped labels. Decorative SVGs, real hrefs and inset focus outlines support access without site JavaScript. The bar uses z-index overlay (20), below drawer (39), navigation (40), privacy notice (9999), and native dialog top layer. Privacy actions can wrap at 320px.

Colors from the active Tailwind 4 global @theme: gold `#C9A84C`, obsidian `#0A0806`, parchment `#F2EBE0`. Contrast: gold/obsidian 8.75:1; parchment/obsidian 16.89:1. Typography matches the existing mobile Reserve a Table CTA: DM Sans Variable, 500 weight, 0.625rem, uppercase, 0.24em tracking. Installed versions: Astro 6.4.4, Tailwind 4.3.0; npm/package-lock.

## Destinations

Canonical source: `src/content/venueSettings/settings.json`, consumed via the existing content singleton. The bar preserves the phone environment override used by existing navigation/contact data; no such override is set in the local environment. `.env.example` contains a demo phone, not the venue's authoritative number.

Reservation URL (all existing provider/campaign parameters retained):

https://www.opentable.com/r/louisiana-purchase-sd-reservations-san-diego?restref=1039495&lang=en-US&ot_source=Restaurant%20website&utm_source=louisianapurchasesd.com&utm_medium=website&utm_campaign=reservations

Phone: `tel:+18586836828` — (858) 683-6828.

The live [Louisiana Purchase contact page](https://louisianapurchasesd.com/contact) agrees with this phone and reservation URL. Opening its [OpenTable reservation link](https://www.opentable.com/r/louisiana-purchase-sd-reservations-san-diego?restref=1039495&lang=en-US&ot_source=Restaurant%20website&utm_source=louisianapurchasesd.com&utm_medium=website&utm_campaign=reservations) identifies Louisiana Purchase SD, confirming venue ID 1039495. No reservation or call was completed.

## Analytics

Extended the existing GA4 gtag delegated click listener. No competing component listener, GA installation or GTM container was added. Existing reservation_click retains reservation_system: opentable, link_url and page_path. Added phone_click for tel links with link_url and page_path. Both bar links supply cta_location: mobile_bottom_bar. These measure activations only.

The existing once-only initialization guard and delegation handle repeated initialization and replaced link elements. There is no Astro client router/view transition integration in this site. GPC and stored opt out suppress these business events, including opt out after initialization. Missing/throwing analytics does not cancel navigation. The existing configuration and URL parameters are preserved.

External follow-up: in GA4 Admin → Custom definitions, check for an existing event-scoped dimension for cta_location; if absent, create “CTA location” with event parameter `cta_location`. Validate events in GA4 DebugView after a reviewed deployment. No GTM mapping is required by this repository's direct gtag integration. External account configuration and DebugView receipt were not verified.

## Verification (2026-10-06)

- `npm run build`: PASS. Existing missing Google Places API key produces the existing null rating fallback. Build warnings cover large CMS chunks and local Node 26 versus Vercel Node 24.
- `node --test tests/mobile-action-bar.test.mjs`: 5/5 PASS, including rendered integration/destinations across all 36 routes, single-event dispatch under repeated initialization, existing reservation parameters, consent suppression and unavailable analytics.
- `npm test`: 9/13 PASS. The four existing Keystatic image tests also fail on an untouched main checkout: legacy image hydration, migrated image hydration, migrated collection paths, and missing hurricane-pop.json fixture.
- `npm run astro -- check`: existing keystatic.config.ts:537 TS2353 error (`validation` on select), plus existing LocalSEO and unused siteName hints. No new component errors. The same source error is present in main.
- Formatting: available Prettier passes package.json and the new test. Astro parser/plugin is not installed; no lint script exists. global.css formatting fails on untouched main too; no whole-file reformat or dependency changes. `git diff --check` passes.
- Chromium 154 production build simulation: homepage, contact, dinner menu, private events and blog at 320, 375, 390, 430px; no horizontal overflow, equal halves, 56px actions. Visible at 1279px, hidden with zero body reserve at 1280px and 1440px.
- Full scroll: footer bottom aligns above the bar; footer links remain accessible. Menu covers the bar and remains operable. Promotion feed fixture exercises the existing native dialog: modal top layer, focus inside, close works. Privacy controls remain above the bar and wrap without overflow at 320px.
- 200% root text at 320px: bar and page reserve both 112px, labels fit, focus outline visible. Existing page heading enlargement behavior was not redesigned.
- Chromium safe-area override of 34px: bar and page reserve both 90px; colored halves extend through the inset. This is emulation, not physical iPhone testing.
- JavaScript-disabled mobile context: both semantic links render with exact destinations and 56px touch targets; reservation default navigation verified with the external response intercepted. Telephone OS handoff is not available in this browser.
- Analytics: original shared inline script injected into a local test response with a synthetic measurement ID, Google script blocked. Programmatic browser link activation gives exactly one business event per link through contact → menu → contact navigation; the site did not prevent default. Opt out prevents further events. This confirms local dispatch, not GA4 receipt.
- Private event page iframe and surrounding scroll reserve inspected. Toast's external iframe stayed unloaded, so its internal fields/submission controls and keyboard interaction could not be verified. Physical mobile keyboard, telephone app handoff and physical device checks remain for review.

## Screenshots

Production renders, inspected visually:

- [Homepage 390px](home-390.png)
- [Contact 375px](contact-375.png)
- [Footer 390px](footer-390.png)
- [Open menu 390px](menu-390.png)
- [Privacy controls 320px](consent-320.png)
- [200% text and focus 320px](enlarged-text-320.png)
- [JavaScript disabled 320px](no-js-320.png)
- [34px safe area 390px](safe-area-390.png)
