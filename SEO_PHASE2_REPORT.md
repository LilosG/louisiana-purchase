# Louisiana Purchase — Phase 2 SEO / Local SEO / AEO / GEO Implementation Report

**Date:** 2026-09-28 · **Scope:** Work Packages WP1–WP14 of the Phase 2 spec, nothing else.

## 1. Branch, commits, push

- **Branch:** `seo/phase2`
- **Base / production branch:** `main`. `git remote show origin` reports `HEAD branch: main`, and local `main` tracks `origin/main` (`branch.main.merge refs/heads/main`). The repo has no Vercel `git` branch config in `vercel.json` and no `.vercel/project.json`, so `main` (the origin default branch) is the production branch. `seo/phase2` was created from `main` at `b5f33af`.
- **Commits (one per WP):**

| WP | Commit | Summary |
|---|---|---|
| WP1 | `cd5f146` | Heading-component architecture |
| WP2 | `38d9dac` | Money-page H1s |
| WP3 | `8811e2e` | Topical H2/H3 hierarchy, dinner category H3 / dish H4 |
| WP4 | `150f159` | Title suffix logic, WP4 titles, meta descriptions, `ogImageAlt` |
| WP5 | `8776995` | Single JSON-LD `@graph`, shared Menu/FAQ builders |
| WP6 | `bcb6770` | Brunch consolidation, `brunchDays` field |
| WP7 | `a03a9e7` | Patio slug rename, full-restaurant-buyout page, 80+ guests |
| WP8 | `83860c1` | Live Google rating stat |
| WP9 | `d03e321` | Gift Cards link resolution |
| WP10 | `3ffc916` | Alt handling, alts, spelling, blog hero dimensions |
| WP11 | `c17de6b` | Blog consolidation, competitor removal, money-page links |
| WP12 | `80f2487` | Related posts, category links, archive indexing |
| WP13 | `c589c29` | Sitemap `lastmod`, `/llms.txt`, 404 |
| WP14 | final commit on the branch (also contains this report) | NAP / data consistency |

- **Push:** pushed once to `origin/seo/phase2` after the Section 4 verification passed. Nothing was merged and nothing was pushed to `main`.

### Core mechanism added (used by several WPs)

`src/content/siteData.ts` now resolves `{{TOKEN}}` placeholders in every Keystatic singleton and collection entry at build time (venueSettings itself is returned verbatim). Tokens are derived only from `venueSettings`, the `cocktailsMenu` collection and `src/data/google-rating.json`: address parts, formatted phone / `tel:` link, `mapsUrl`, Instagram handle (from the URL), happy-hour days/window/start, per-day hours and an hours sentence, earliest opening time, event capacity (`80+ guests`), brunch days/start/availability sentence, Signature Cocktails count, and the Google rating. A string that is exactly `{{TOKEN}}` gets the raw value. Unknown placeholders such as the private-event template's `{{eventType}}` are left alone. The Keystatic field shapes are unchanged: tokens sit inside existing text fields.

## 2. Per-WP changes and Phase 1 corrections

### WP1 — Heading-component architecture
Files: `SiteFooter.astro`, `FourColumnGrid.astro`, `MenuShowcase.astro`, `AlternatingRow.astro`, `PageHero.astro`, `SectionHeader.astro`, `PromotionModal.astro`, new `ui/LocationHeading.astro`, pages `contact`, `the-space`, `events`, `brunch`.
- Footer column labels changed from `h3` to `p`, with the same classes and ids, so they are still the `aria-labelledby` targets. The global `h1–h6` rule supplied `line-height: 1.15`, so that line-height was added to `.site-footer__col-heading` in the component's own scoped CSS to keep rendering identical.
- `FourColumnGrid` gets `headingLevel?: 2|3|4` (default 3) and `AlternatingRow` gets `headingLevel?: 2|3` (default 2), both with the same classes. `MenuShowcase` passes `headingLevel` through and also gets `categoryHeadingLevel` (used for WP3).
- The promotion dialog's empty `<h2 data-promotion-title>` is now `<p>`. The existing script fills it through the data attribute, and `.promotion-title` already sets every typographic property.
- Whitespace: `PageHero`, `SectionHeader` and `AlternatingRow` now emit an explicit `' '` between `title` and the `titleItalic` block span. The two inline `<br />` headings (`/events` "Be the First␣to Know" and `/brunch` "Private Brunch␣Events") and the location heading get `{' '}` before `<br />`. That space is visually collapsed and keeps plain-text extraction correct. The verification script's run-together detector flags all four baseline cases and zero after the change.
- The duplicated location heading from `/contact` and `/the-space` is now one `LocationHeading` component sourced from `venueSettings.address`.

### WP2 — H1s
Values are stored in each page's existing Keystatic hero fields (`title` / `titleItalic`) or in the `privateEventTypes.title` field. No new field was needed. The two-part design is kept. The private-event hero image alt was changed from `{{title}} at Louisiana Purchase North Park San Diego` to `{{title}} — Louisiana Purchase`, because the new titles already include the location.

### WP3 — H2/H3 hierarchy
All rewrites are content changes in the Keystatic singletons, except `/menu/dinner`, which now calls `MenuShowcase … categoryHeadingLevel={3} headingLevel={4}`. MenuShowcase groups items under their existing `menuStructure` category labels. The homepage "Visit Us in North Park, San Diego" body now reads `{{VENUE_STREET}} at {{VENUE_CROSS_STREET_SHORT}}` / `{{VENUE_CITY_LINE}}`. On `/contact`, the handle is body text derived from `venueSettings.social.instagram`: "Follow @louisianapurchasesd on Instagram …". CTA-band headings are unchanged. Every page has one H1 and no skipped levels (verification check 2).

### WP4 — Titles and meta descriptions
- `LocalSEO.astro`: the suffix is `localSeo.titleSuffix` (now `Louisiana Purchase`), joined with ` | `. It is appended only when the title doesn't already contain the brand and the result is 65 characters or fewer. This fixes all blog titles with no per-post edits. The longest title on the site is now 65 characters.
- New `ogImageAlt` prop, which defaults to the page title and feeds `og:image:alt` and `twitter:image:alt`.
- Titles and descriptions are set in each page's Keystatic SEO/Layout fields and in `privateEventTypes.metaTitle` / `description`. Descriptions that mention hours, street, phone or capacity use tokens. `/privacy` description is now 157 characters.

### WP5 — Structured data
New `src/content/schema.ts` holds `MENU_PAGES`, `buildMenuSchema()`, `menuStubs()` and `buildFaqSchema()`, and `getMenuData()` in `siteData.ts` is shared with `MenuShowcase`. `LocalSEO.astro` now emits one `<script type="application/ld+json">` with a single `@graph` containing:
- Organization `#gph`, from `gphNetwork.ts`: `GRIND_AND_PROSPER_URL`, plus a new `GRIND_AND_PROSPER_NAME` constant. **That file is meant to be copied identically into every GPH repo, so the new constant should be synced to the sister sites.**
- Restaurant `#restaurant`, with `parentOrganization` pointing to `#gph`.
- WebSite `#website`, with `publisher` pointing to `#restaurant`.
- WebPage `{url}#webpage`, with `isPartOf`, `about`, `breadcrumb` and `mainEntity`.
- BreadcrumbList `{url}#breadcrumb`.
- Lightweight Menu reference nodes (see below) and the page entities.

Restaurant changes: `servesCuisine` is now `Creole, Louisiana, Southern American, New Orleans, Cajun`. The "Live Jazz" amenity is now "Live Music". `24:00` is emitted as `23:59` in the schema only. `hasMenu` is an array of `@id` references. `sameAs` adds the OpenTable profile with its query string stripped, derived from `reservationsUrl`. `aggregateRating` and the `google-rating.json` import were removed. Page entities:
- Full `Menu` → `MenuSection` → `MenuItem` on `/menu/dinner`, `/menu/cocktails` and `/brunch`, with no offers or prices.
- `/menu` has `WebPage.hasPart` pointing to the three menu `@id`s.
- The `FoodEstablishment` blocks on `/brunch` and `/happy-hour` were removed.
- `FAQPage` on `/brunch`, built by the same builder as `/happy-hour`, `/private-events` and the subpages.
- `EventVenue` has `@id` and `containedInPlace` pointing to `#restaurant`.
- `BlogPosting` has `publisher` and `author` pointing to `#restaurant`, `isPartOf` pointing to `#website`, and `mainEntityOfPage` pointing to the WebPage.
- `/privacy` gets a BreadcrumbList.

`hasMenu` references cross-page Menu entities. So every `@id` reference resolves inside each page's graph, every graph also carries three minimal `Menu` reference nodes (`@id`, `name`, `url`). On the three menu pages the full entity replaces its stub, so no duplicate `@id` appears in any graph. The `/menu` hub carries only the reference nodes, never a full menu.
The unused `happyHourPage.seo.schemaName` / `schemaDescription` fields were removed. They fed only the deleted FoodEstablishment and contained a hard-typed time window.

**Phase 1 errors found:**
- **F07 / RC9 are wrong.** Baseline `/menu/dinner` already emitted `{"@type":"Menu","name":"Louisiana Purchase — Dinner Menu",…,"url":".../menu/dinner"}`, as Phase 1's own §6 table shows. RC9 and §7 also say `/menu/cocktails` and `/menu/brunch` built Menu "from the same menuStructure/collection data". In fact all three baseline Menu blocks were name/description/url stubs with no `MenuSection` or `MenuItem`. Evidence: `grep '"@type":"Menu"' dist-before/client/menu/dinner/index.html`.

### WP6 — Brunch consolidation
- `/menu/brunch` was deleted, together with its `menuBrunchPage` singleton, which was removed from `content.config.ts`, `keystatic.config.ts` and the Keystatic navigation. A 301 from `/menu/brunch` to `/brunch` was added to `vercel.json`. Unique content: the page only duplicated `/brunch`'s three items, stats and CTA. Its one distinct string, the Menu description "Louisiana Purchase's weekend Creole brunch menu in North Park, San Diego", is now the `/brunch` Menu schema description. The `/brunch` links that pointed at `/menu/brunch` now go to the on-page menu (`#brunch-menu-heading`) or to `/menu`. Blog links now point to `/brunch`.
- The `/menu` hub's only brunch link is a new third card, "Weekend Brunch Menu", linking to `/brunch`. It uses the existing, previously unused `cards/2` image already in the repo, and fills the empty third column of the 3-column grid. Brunch stays out of primary nav.
- New Keystatic field `venueSettings.brunchDays`: a multiselect of weekdays with default and stored value Saturday and Sunday. It generates `{{BRUNCH_DAYS}}`, `{{BRUNCH_START}}` / `{{BRUNCH_START_TIME}}` and `{{BRUNCH_AVAILABILITY}}` from those days' `regularHours` opening time, for example "Brunch favorites are on the menu from noon on Saturdays and Sundays." No end time is ever stated.
- `venueSettings.brunchHours` was removed, since after WP5 nothing depended on it. The 12–3 PM window was removed from `/brunch` (eyebrow, stat, facts, CTA), from `brunchFaqs/days`, from the unrendered home and `/menu` brunch blocks, and from two blog posts (`12 PM–3 PM`, `10 AM–2 PM`).

### WP7 — Private events
- `privateEventTypes/north-park-rooftop-buyout.json` was renamed to `north-park-patio-buyout.json` (id and slug). A 301 was added, and the hub cards are generated from the collection. `rooftop` appears 0 times in `dist/` and 0 times in site content. The only remaining repo occurrence is the required redirect `source` in `vercel.json`.
- New `privateEventTypes/north-park-full-restaurant-buyout.json` has the same field set and order as its siblings and uses the same template. It appears on the hub, in the sitemap and in `/llms.txt`.
- Capacity copy now comes from `{{EVENT_CAPACITY}}` (`80+ guests`) or `{{EVENT_CAPACITY_SHORT}}` (`80+`), derived from `venueSettings.eventCapacity.fullVenue`. This covers the homepage "Up to 80 Guests", `/about`, `/events`, `/the-space`, the `/private-events` stats, facts and body, the `/brunch` benefits, the birthday (`2–80+`), corporate (`20–80+`) and patio (`30–80+`) ranges, and blog copy that stated other full-venue figures: "(60+ guests)", "(120+ guests)" and "up to 150 guests" ×2 (Host an event), now 80+ guests. This last fix is in the final commit.

### WP8 — Live Google rating
`scripts/fetch-google-rating.mjs` already ran in `npm run build` (`node scripts/fetch-google-rating.mjs && astro build`), so no `prebuild` was needed. It now:
- logs a warning and writes `{"rating":null,"count":0}` when `GOOGLE_PLACES_API_KEY` is missing or the request fails, including a 10-second timeout, and never fails the build;
- defaults the Place ID to `venueSettings.mapsPlaceId`, so `GOOGLE_PLACE_ID` is optional.

The homepage stat is now `{{GOOGLE_RATING}}` (for example `4.7★ (1,234)`), labelled "Google Rating" and linked to `{{VENUE_MAPS_URL}}`. `StatBar` skips stats whose value is empty, and its grid classes follow the remaining count. Both paths were tested: with a sample rating the stat renders in a 4-column grid, and with null it is absent and the grid is 3 columns. There is no client-side fetching. The unused hard-coded `venueSettings.googleRating: "4.6"` was removed. `.env.example` is updated.

### WP9 — Gift Cards
`giftCardLink()` in `siteData.ts` returns `PUBLIC_GIFT_CARD_URL` when set, otherwise `/contact`. The footer adds `target`/`rel` only for an external URL. `.env.example` documents the variable, and its example value is now empty because no URL exists yet. `env.d.ts` marks it optional. Nothing was added to `vercel.json`. **Phase 1 F11 confirmed:** the baseline link had no `href`.

### WP10 — Images
- `imageAlt ?? ''` is now used in `PageHero`, `CTABand`, `AlternatingRow` and the two page-level `<Image>`s (`/events` updates and `/the-space` location). `FourColumnGrid` and the blog templates already fall back with `||`.
- **Phase 1 error (F12/RC6):** the baseline build had **zero** `<img>` elements without an `alt` attribute. The flagged hero and CTA images render a valueless `alt`, which is equivalent to `alt=""` and correct for these `aria-hidden` background images. They come from blocks that have no `imageAlt` key at all (`undefined` → default `''`). No content stores a `null` alt. The nullish fix was still applied as specified.
- Cocktail alts were rewritten from each item's own name and ingredients: 7PM Friday, Mango Guava Spritz, Gin and Juice, Kool Aid Man, Doggy Style, plus Praline Old Fashioned, whose alt was a duplicate of Gin and Juice's. The Dooky Chase, Alligator Cheesecake and Wings alts now follow `{Name} — {description} at Louisiana Purchase in North Park`. Menu-item alts are unique (check 6).
- Spelling fixes: Prailine → Praline, biters → bitters (Praline Old Fashioned, Mango Guava Spritz), Martel → Martell (7PM Friday, French Margarita, blog), Purcahse → Purchase (Paloma alt), Praline Old Fashion → Praline Old Fashioned (12 instances in `top-new-orleans-cocktails…`, including the frontmatter description and FAQs). `cocktailsMenu/prailine-old-fashioned.json` and its slug-scoped image folder were renamed to `praline-old-fashioned`, since this is not a URL.
- Blog heroes stay in `/public/images`. Intrinsic `width`/`height` are read at build time with `sharp` (already a dependency), and `fetchpriority="high"` was added. Every blog post with a hero image now has dimensions.

### WP11 — Blog consolidation
- `/blog/north-park-happy-hour-guide` is kept (`updatedDate: 2026-09-28`, same frontmatter shape). It merges two sections from `best-happy-hour-north-park`: "What to Order at Louisiana Purchase" (spelling fixed) and "Getting to Louisiana Purchase". It also merges the location FAQ. The first paragraph now links "[happy hour at Louisiana Purchase in North Park](/happy-hour)" and states Monday through Friday, 3–5 PM, matching `venueSettings.happyHour`. Mismatches were corrected: "final 15 minutes … 5:45 PM" became "4:45 PM at Louisiana Purchase", and "30th and University" became University Ave and 23rd St. `/blog/best-happy-hour-north-park` redirects with a 301.
- `/blog/top-creole-restaurants-san-diego-local-guide` is kept (`updatedDate: 2026-09-28`). **These sections were removed:**
  - Puesto, The Taco Stand and Catania's;
  - every competitor line in "Best for Specific Occasions", "Logistics and Hours" and "Planning Your Visit";
  - the competitor names in the description and intro.

  Merged from `best-creole-restaurants-north-park-san-diego`: "What Makes It Real Creole Cooking" (with the unverified "red beans and rice" replaced by dishes on the menu), "The North Park Setting" and the group-dinner FAQ. LP facts that contradicted venueSettings were removed or corrected: "Open Tuesday–Sunday, 5 p.m.–close", "Closed Mondays", "Washington Street", "lot behind the restaurant", "$16–$28 entrées / $12–$14 cocktails" and "groups of 20–100+". Hours now point to `/contact`. `/blog/best-creole-restaurants-north-park-san-diego` redirects with a 301.
- Every remaining post now links to its money page with descriptive anchors. Links added: Cajun → `/menu/dinner`, Creole cocktails → `/menu/cocktails`, Creole vs Cajun → `/menu/dinner`, date night → `/menu/dinner`. Title-tag-style anchors such as "Birthday Dinner Restaurants North Park San Diego | Louisiana Purchase" were replaced with descriptive anchors ("birthday dinner venue in North Park"). Trailing-slash internal links, which 308 under `trailingSlash: false`, were normalized. Six links in `private-event-cost…` pointed at the wrong domain `louisianapurchase.com`; one of them also used a wrong path. They are now relative links.
- Competitor mentions in the other posts were **not** edited. They are listed in Section 7.

### WP12 — Internal linking and archives
- `blog/[slug].astro` gets a "Related Posts" block: 3 posts, same category first, then newest, excluding the current post (`relatedPosts()` in `siteData.ts`). The category badge links to `/blog/category/{slug}`.
- Category archives use `noindex, follow`. The `noindex` prop now emits `noindex, follow`; nothing used it before. Only categories that have posts get pages: Brunch and Events are no longer generated.
- The sitemap `filter` excludes `/blog/category/*` and `/blog/N`, which stay crawlable.

### WP13 — Sitemap, llms.txt, 404
- `@astrojs/sitemap` `serialize` sets `lastmod` for blog posts from `updatedDate`, falling back to `date`, read from frontmatter at build time. Static pages have no `lastmod`.
- `src/pages/llms.txt.ts` is prerendered at build and uses no runtime. It is generated from `venueSettings`, `localSeo`, the page singletons' SEO fields and `privateEventTypes`, and covers name, description, address, neighborhood, phone, email, maps, cuisine, amenities, hours (including happy hour and brunch availability), reservation and order URLs, the main pages, private events and social links.
- `src/pages/404.astro` uses `Layout`, `noindex, follow`, and links to Home, Menu, Reserve a Table and Contact. The adapter's `.vercel/output/config.json` route `{"src":"^/.*$","dest":"/404.html","status":404}` keeps the live status at 404. `robots.txt` is unchanged.

### WP14 — NAP and data consistency
- Homepage phone CTA is now `{{VENUE_PHONE}}` → `(858) 683-6828` with `{{VENUE_PHONE_TEL}}`. The homepage StatBar maps link and every "Get Directions" link now use `{{VENUE_MAPS_URL}}` (the Place-ID URL). `maps.google.com/?q=` occurrences in `src/`: 0.
- Cocktail counts: every hard-coded "20+" claim is now `{{SIGNATURE_COCKTAIL_COUNT}}` (11), computed from the `cocktailsMenu` collection and labelled "Signature Cocktails". The duplicate hard-typed "4+ Signature Cocktails" stat on `/menu/cocktails` was removed. **Phase 1 §12 miscounted the collection as 12 files; it has 11.**
- `SiteNav` reads the phone from `venueSettings`, using the shared `formatPhone`. The duplicate `navigation.phoneFallback` field was removed.
- `privacy.astro` reads name, address, email and phone from `venueSettings`.
- Fonts: all 33 `@font-face` rules in the built CSS already have `font-display: swap` (from `@fontsource`). Nothing was changed.
- Hard-coded strings replaced with the data source:

  - home StatBar 1: 20+ Cocktails -> computed count
  - home StatBar 1: Location link -> mapsUrl
  - home StatBar 2: 20+ Craft Cocktails -> computed count
  - home Visit Us: 7 hard-typed hours facts -> venueSettings.displayHours
  - home Visit Us: maps.google.com/?q= link -> venueSettings.mapsUrl
  - home Visit Us: phone CTA +18586836828 -> formatted venue phone
  - menu StatBar: 20+ -> computed count
  - menu kitchen row: fact ('Kitchen', 'From 12 PM') -> From {{EARLIEST_OPEN}}
  - menu bar row: fact ('Selection', '20+ Cocktails') -> {{SIGNATURE_COCKTAIL_COUNT}} Signature Cocktails
  - dinner stat 12 PM -> earliest regularHours open
  - dinner CTA subtitle street -> token
  - cocktails stat 20+ On the Menu -> computed count
  - cocktails stat "4+ Signature Cocktails" removed (duplicated hard-typed count)
  - brunch setting row: fact ('Address', '2305 University Ave') -> {{VENUE_STREET}}
  - brunch setting row: maps.google.com/?q= link -> venueSettings.mapsUrl
  - happy hour ritual row: fact ('Hours', '3 PM – 5 PM') -> {{HAPPY_HOUR_WINDOW}}
  - happy hour ritual row: fact ('Days', 'Monday – Friday') -> {{HAPPY_HOUR_DAYS}}
  - happy hour bar row: fact ('Address', '2305 University Ave') -> {{VENUE_STREET}}
  - happy hour bar row: maps.google.com/?q= link -> venueSettings.mapsUrl
  - happy hour: hero eyebrow/subtitle, stats, facts, CTA subtitle hours -> venueSettings.happyHour tokens
  - happyHourFaqs/days.json: "Happy Hour runs Monday – Friday, 3 PM – 5 PM. Louisiana Purchase is op…" -> tokens
  - happyHourFaqs/what.json: "Happy Hour at Louisiana Purchase runs Monday through Friday from 3 PM …" -> tokens
  - happyHourFaqs/location.json: "Louisiana Purchase is located at 2305 University Ave in North Park, Sa…" -> tokens
  - brunchFaqs/location.json: "Louisiana Purchase is located at 2305 University Ave in North Park, Sa…" -> tokens
  - privateEventsFaqs/parking: street -> token
  - private event template: fact ('Location', 'North Park, San Diego') -> {{VENUE_NEIGHBORHOOD}}, {{VENUE_CITY}}
  - private event template: fact ('Address', '2305 University Ave') -> {{VENUE_STREET}}
  - the-space: address / cross-street strings in image alts -> tokens (corrects "Louisiana St" to venueSettings.crossStreet)
  - contact CTA band: maps.google.com/?q= link -> venueSettings.mapsUrl
  - about story row: fact ('Address', '2305 University Ave') -> {{VENUE_STREET}}
  - about bar row: fact ('Selection', '20+ Cocktails') -> {{SIGNATURE_COCKTAIL_COUNT}} Signature Cocktails
  - about card eyebrow 20+ Cocktails -> computed count
  - about neighborhood row: fact ('Address', '2305 University Ave') -> {{VENUE_STREET}}
  - about neighborhood row: fact ('Neighborhood', 'North Park, San Diego') -> {{VENUE_NEIGHBORHOOD}}, {{VENUE_CITY}}
  - about neighborhood row: fact ('Zip Code', '92104') -> {{VENUE_ZIP}}
  - about neighborhood row: maps.google.com/?q= link -> venueSettings.mapsUrl
  - navigation.phoneFallback (duplicate of venueSettings.phoneFallback) removed; SiteNav reads venueSettings
  - the-space / contact hero alts: "corner of University Ave and Louisiana St" → {{VENUE_CROSS_STREET}} (corrected to venueSettings: University Ave & 23rd St)
  - spaceGalleryCards/entrance: "University Ave and 23rd St, North Park" (alt + body) → {{VENUE_CROSS_STREET}}, {{VENUE_NEIGHBORHOOD}}
  - home / the-space / about image alts containing "2305 University Ave North Park San Diego" → {{VENUE_STREET}}, {{VENUE_NEIGHBORHOOD}}, {{VENUE_CITY}}
  - about "The Full Experience" subtitle "at 2305 University Ave" and neighborhood-row "corner of University Ave and 23rd St" → tokens
  - brunch setting row "corner of University Ave and 23rd St" → {{VENUE_CROSS_STREET}}
  - menuIndexPage unrendered brunch row "craft cocktails from noon" → {{BRUNCH_START}}
  - SiteNav.astro: navigation.phoneFallback → venueSettings.phoneFallback; local formatPhone → shared siteData.formatPhone
  - privacy.astro: hard-typed "2305 University Ave, North Park, San Diego, CA 92104", info@… and (858) 683-6828 → venueSettings
  - Blog NAP corrections (static MDX text, see below): "30th and University" (Cajun, Host an event) → University Ave and 23rd St; "location on 30th Street" (Gumbo) → University Ave; LP happy hour "4–6 PM weekdays" (Small plates) → Monday through Friday 3–5 PM

- Blog MDX hours/address text that already **matches** venueSettings was left as static text. The external pipeline writes plain MDX, and `{{TOKEN}}` braces are MDX expressions. Occurrences: `best-cajun-restaurants…` (FAQ + "Planning Your Visit" weekly hours, "2305 University Ave, North Park, San Diego, CA 92104", happy hour 3–5 PM ×3, brunch-from-noon sentence), `north-park-happy-hour-guide` (3–5 PM ×4), `top-creole…` (brunch-from-noon sentence), `best-creole-small-plates…` (3–5 PM). If venueSettings changes, these need a manual edit.

## 3. Before → after

### H1

| URL | Before | After |
|---|---|---|
| `/` | Louisiana Purchase | Louisiana Purchase — Creole Restaurant & Cocktail Bar in North Park, San Diego |
| `/menu` | The Menu Louisiana Purchase | Creole Dinner & Cocktail Menu — North Park, San Diego |
| `/menu/dinner` | Dinner Louisiana Purchase | Creole Dinner Menu in North Park, San Diego |
| `/menu/cocktails` | Cocktails Louisiana Purchase | New Orleans Cocktail Menu in North Park, San Diego |
| `/brunch` | Weekend Brunch in North Park | Weekend Creole Brunch in North Park, San Diego |
| `/happy-hour` | Happy Hour North Park's Finest | Happy Hour in North Park, San Diego |
| `/events` | Events & Happenings | Events & Live Music in North Park, San Diego |
| `/private-events` | Private Events Worth Remembering | Private Events & Buyouts in North Park, San Diego |
| `/private-events/north-park-birthday-dinner-venue` | Birthday Dinner Venue in North Park | Birthday Dinner Venue in North Park, San Diego |
| `/private-events/north-park-private-dining-room` | Private Dining Room in North Park | Private Dining Room in North Park, San Diego |
| `/private-events/north-park-patio-buyout` | Patio Buyout in North Park San Diego | Patio Buyout in North Park, San Diego |
| `/private-events/north-park-full-restaurant-buyout` | (new page) | Full Restaurant Buyout in North Park, San Diego |
| `/private-events/san-diego-brunch-private-event` | Private Brunch Event San Diego | Private Brunch Events in North Park, San Diego |
| `/private-events/san-diego-corporate-dinner-venue` | Corporate Dinner Venue San Diego | Corporate Dinner Venue in North Park, San Diego |
| `/the-space` | The Space A Room That Earns Its Place | The Space — Restaurant, Bar & Patio in North Park, San Diego |
| `/about` | Louisiana Purchase A Genuine Place | About Louisiana Purchase — Creole Dining in North Park, San Diego Since 2018 |
| `/contact` | Contact Us We'd Love to Hear From You | Contact Louisiana Purchase — North Park, San Diego |
| `/menu/brunch` | Brunch Louisiana Purchase | (removed — 301 to /brunch) |

### H2 (money pages, document order; unchanged CTA-band headings included for completeness)

| URL | Before | After |
|---|---|---|
| `/` | Where New Orleans Found Its Way to North Park | New Orleans Creole Dining Found Its Way to North Park |
| `/` | Cocktails Built for the French Quarter Soul | New Orleans Craft Cocktails Built for the French Quarter Soul |
| `/` | Food Worth Staying For | Creole Kitchen by Chef Quinnton Austin Food Worth Staying For |
| `/` | 2305 University Ave University Ave & 23rd St | Visit Us in North Park, San Diego |
| `/menu` | Two Programs. One Kitchen. | Creole Dinner & Cocktail Menus Two Programs. One Kitchen. |
| `/menu` | Cocktails Built for the French Quarter | New Orleans Cocktail Bar Built for the French Quarter |
| `/menu/dinner` | Raw, Fire, & Elevated Plates | Creole Dinner Menu Raw, Fire & Elevated Plates |
| `/menu/cocktails` | Cocktails Built for the French Quarter | Signature New Orleans Cocktails Built for the French Quarter |
| `/brunch` | Not Just Brunch. An Afternoon Event. | Weekend Brunch in North Park Not Just Brunch. An Afternoon Event. |
| `/happy-hour` | More Than a Discount. A Daily Ceremony. | North Park Happy Hour More Than a Discount. A Daily Ceremony. |
| `/happy-hour` | The Bar at Louisiana Purchase | Happy Hour at the Bar & Patio at Louisiana Purchase |
| `/events` | Every Night Is An Event Here | New Orleans Events in North Park Every Night Is An Event Here |
| `/events` | Be the First to Know | Event Updates on Instagram Be the First to Know |
| `/events` | Planning a Private Event or Celebration? | Planning a Private Event or Celebration in North Park? |
| `/private-events` | Every Occasion, Elevated | Private Event Types Every Occasion, Elevated |
| `/private-events` | From First Inquiry to Your Event | How to Book a Private Event From First Inquiry to Your Event |
| `/private-events` | Three Distinct Event Spaces | Three Private Event Spaces in North Park |
| `/private-events` | Tell Us About Your Event | Private Event Inquiry Tell Us About Your Event |
| `/private-events/north-park-birthday-dinner-venue` | Louisiana Purchase Sets the Scene | Your Birthday Celebration in North Park Louisiana Purchase Sets the Scene |
| `/private-events/north-park-birthday-dinner-venue` | Everything You Need for a Perfect Event | Private Event Services Everything You Need for a Perfect Event |
| `/private-events/north-park-birthday-dinner-venue` | Tell Us About Your Birthday Celebration | Birthday Celebration Inquiry Tell Us About Your Birthday Celebration |
| `/private-events/north-park-patio-buyout` | Louisiana Purchase Sets the Scene | Your Patio Buyout in North Park Louisiana Purchase Sets the Scene |
| `/private-events/north-park-patio-buyout` | Everything You Need for a Perfect Event | Private Event Services Everything You Need for a Perfect Event |
| `/private-events/north-park-patio-buyout` | Tell Us About Your Patio Buyout | Patio Buyout Inquiry Tell Us About Your Patio Buyout |
| `/the-space` | The Geometric Timber Ceiling & Marble Bar | The Dining Room Geometric Timber Ceiling & Marble Bar |
| `/the-space` | Open Air Dining in North Park | Patio & Outdoor Seating Open Air Dining in North Park |
| `/the-space` | The Venue in Detail | Restaurant & Patio Gallery |
| `/the-space` | Your Event. Our Space. | Private Events & Buyouts Your Event. Our Space. |
| `/about` | Where New Orleans Found North Park | The Story of Louisiana Purchase Where New Orleans Found North Park |
| `/about` | An Obsessive Cocktail Program | New Orleans Craft Cocktails An Obsessive Cocktail Program |
| `/about` | The Full Experience | Dinner, Cocktails & Private Events |
| `/contact` | @LouisianaPurchaseBar | Follow Louisiana Purchase on Instagram |

Private-event subpages share one template, so every subpage changed the same way (shown above for the birthday and patio pages; `{Event Type}` varies). The full-restaurant-buyout page is new and uses the same template.

### H3 / H4 changes

| Page | Before | After |
|---|---|---|
| all pages (footer) | `h3` Explore / Hours / Reservations | `p` (same classes; still the `aria-labelledby` targets) |
| `/` (promotion dialog) | empty `h2 data-promotion-title` before the H1 | `p` (filled by the existing script) |
| `/menu` | h3 Dinner / h3 Cocktails | h3 Dinner Menu / h3 Cocktail Menu (+ new h3 Weekend Brunch Menu card linking to /brunch) |
| `/menu/dinner` | 20 dish names as h3 directly under the h2 | h3 Oxtail Kingdom / Creole Soul Bangers / Gulf / Fry House (from `menuStructure`), dish names as h4 |
| `/`, `/menu/cocktails` | h3 Prailine Old Fashioned | h3 Praline Old Fashioned |
| `/private-events` hub cards | h3 Private Dining Room in North Park, Corporate Dinner Venue San Diego, Birthday Dinner Venue in North Park, Private Brunch Event San Diego, Patio Buyout in North Park San Diego | h3 = the new subpage H1s (… in North Park, San Diego), plus h3 Full Restaurant Buyout in North Park, San Diego |
| blog posts | — | h2 Related Posts + three h3 post titles |

Site-wide: the footer column labels `<h3>Explore</h3>`, `<h3>Hours</h3>`, `<h3>Reservations</h3>` became `<p>` (same classes, still the `aria-labelledby` targets) on every page, and the homepage promotion dialog's empty `<h2 data-promotion-title>` became a `<p>`. Blog posts gained `h2: Related Posts` + three `h3` post titles.

### Titles

| URL | Before (chars) | After (chars) |
|---|---|---|
| `/` | Louisiana Purchase — Creole Dining & Craft Cocktails \| North Park, San Diego (76) | Creole Restaurant in North Park, San Diego \| Louisiana Purchase (63) |
| `/404` | (none) | Page Not Found \| Louisiana Purchase (35) |
| `/about` | About Louisiana Purchase — Creole Dining in North Park San Diego (64) | About Our North Park Creole Restaurant \| Louisiana Purchase (59) |
| `/blog` | Blog — Louisiana Purchase \| North Park, San Diego (49) | Blog \| Louisiana Purchase (25) |
| `/blog/2` | Blog — Louisiana Purchase \| North Park, San Diego (49) | Blog \| Louisiana Purchase (25) |
| `/blog/best-creole-restaurants-north-park-san-diego` | Best Creole Restaurants North Park San Diego \| Louisiana Purchase (65) | (removed) |
| `/blog/best-creole-small-plates-san-diego-2026-local-guide` | Best Creole Small Plates San Diego \| North Park — Louisiana Purchase \| North Park, San Diego (92) | Best Creole Small Plates San Diego \| North Park (47) |
| `/blog/best-happy-hour-north-park` | Best Happy Hour in North Park \| Louisiana Purchase (50) | (removed) |
| `/blog/category/brunch` | Brunch — Blog — Louisiana Purchase \| North Park, San Diego (58) | (removed) |
| `/blog/category/cocktails` | Cocktails — Blog — Louisiana Purchase \| North Park, San Diego (61) | Cocktails — Blog \| Louisiana Purchase (37) |
| `/blog/category/dinner` | Dinner — Blog — Louisiana Purchase \| North Park, San Diego (58) | Dinner — Blog \| Louisiana Purchase (34) |
| `/blog/category/events` | Events — Blog — Louisiana Purchase \| North Park, San Diego (58) | (removed) |
| `/blog/category/north-park-guide` | North Park Guide — Blog — Louisiana Purchase \| North Park, San Diego (68) | North Park Guide — Blog \| Louisiana Purchase (44) |
| `/blog/category/private-events` | Private Events — Blog — Louisiana Purchase \| North Park, San Diego (66) | Private Events — Blog \| Louisiana Purchase (42) |
| `/blog/creole-cocktails-showdown-north-park-comparison-guide` | Creole Cocktails North Park: Order Guide — Louisiana Purchase \| North Park, San Diego (85) | Creole Cocktails North Park: Order Guide \| Louisiana Purchase (61) |
| `/blog/gumbo-showdown-san-diego-comparison-guide` | Best Gumbo San Diego \| Creole & Cajun Restaurants — Louisiana Purchase \| North Park, San Diego (94) | Best Gumbo San Diego \| Creole & Cajun Restaurants (49) |
| `/blog/top-creole-restaurants-san-diego-local-guide` | Creole Restaurants San Diego \| Best Authentic Options — Louisiana Purchase \| North Park, San Diego (98) | Creole Restaurants San Diego \| Best Authentic Options (53) |
| `/brunch` | Weekend Brunch in North Park San Diego \| Louisiana Purchase (59) | Weekend Creole Brunch in North Park \| Louisiana Purchase (56) |
| `/contact` | Contact Louisiana Purchase \| North Park San Diego (49) | Contact & Directions, North Park San Diego \| Louisiana Purchase (63) |
| `/events` | Events & Happenings at Louisiana Purchase \| North Park San Diego (64) | Events & Live Music in North Park \| Louisiana Purchase (54) |
| `/happy-hour` | Happy Hour in North Park San Diego \| Louisiana Purchase (55) | Happy Hour in North Park, San Diego \| Louisiana Purchase (56) |
| `/menu` | Menu — Creole Dining & Craft Cocktails \| Louisiana Purchase North Park (70) | Creole Menu in North Park, San Diego \| Louisiana Purchase (57) |
| `/menu/brunch` | Brunch Menu — Weekend Creole Brunch \| Louisiana Purchase North Park (67) | (removed) |
| `/menu/cocktails` | Cocktail Menu — Craft Bar Program \| Louisiana Purchase North Park (65) | New Orleans Cocktails in North Park \| Louisiana Purchase (56) |
| `/menu/dinner` | Dinner Menu — Elevated Creole Kitchen \| Louisiana Purchase North Park (69) | Creole Dinner Menu, North Park San Diego \| Louisiana Purchase (61) |
| `/private-events` | Private Events & Venue Buyouts in North Park San Diego \| Louisiana Purchase (75) | Private Events & Buyouts in North Park \| Louisiana Purchase (59) |
| `/private-events/north-park-birthday-dinner-venue` | Birthday Dinner Restaurants North Park San Diego \| Louisiana Purchase (69) | Birthday Dinner Venue in North Park \| Louisiana Purchase (56) |
| `/private-events/north-park-full-restaurant-buyout` | (none) | Full Restaurant Buyout in North Park \| Louisiana Purchase (57) |
| `/private-events/north-park-patio-buyout` | (none) | Patio Buyout in North Park, San Diego \| Louisiana Purchase (58) |
| `/private-events/north-park-private-dining-room` | Private Dining Room Rental in North Park San Diego \| Louisiana Purchase (71) | Private Dining Room in North Park, San Diego \| Louisiana Purchase (65) |
| `/private-events/north-park-rooftop-buyout` | Patio & Outdoor Venue Buyout North Park San Diego \| Louisiana Purchase (70) | (removed) |
| `/private-events/san-diego-brunch-private-event` | Private Brunch Events in San Diego \| Louisiana Purchase (55) | Private Brunch Events in North Park \| Louisiana Purchase (56) |
| `/private-events/san-diego-corporate-dinner-venue` | Corporate Dinner Venues in San Diego \| Louisiana Purchase North Park (68) | Corporate Dinner Venue in North Park \| Louisiana Purchase (57) |
| `/the-space` | The Space — Louisiana Purchase Venue & Interior \| North Park San Diego (70) | Restaurant, Bar & Patio in North Park \| Louisiana Purchase (58) |

### Meta descriptions

| URL | Before (chars) | After (chars) |
|---|---|---|
| `/` | Fire-charred oysters, Praline Old Fashioneds, and elevated Creole cuisine in North Park, San Diego. Chef Quinnton Austin's Louisiana kitchen, open daily. (153) | Creole restaurant and New Orleans cocktail bar in North Park, San Diego, with Chef Quinnton Austin's Creole kitchen, craft cocktails, patio and private events. (159) |
| `/404` | (none) | The page you're looking for isn't here. Find the menu, reservations and contact details for Louisiana Purchase in North Park, San Diego. (136) |
| `/about` | Chef Quinnton Austin's elevated Creole kitchen and craft cocktail program in North Park, San Diego. French Quarter-inspired dining, open daily since 2018. (154) | About Louisiana Purchase, a Creole restaurant and cocktail bar in North Park, San Diego since 2018, home to Chef Quinnton Austin's New Orleans-inspired kitchen. (160) |
| `/blog/best-creole-restaurants-north-park-san-diego` | Looking for real Creole cooking in North Park? Here's what sets Louisiana Purchase apart, from the gumbo to the late-night bar scene. (133) | (removed) |
| `/blog/best-happy-hour-north-park` | Louisiana Purchase runs happy hour Monday through Friday, 3–5 PM, with craft cocktails and Creole plates on University Ave in North Park. Here's what to order. (159) | (removed) |
| `/blog/category/brunch` | Brunch guides and stories from Louisiana Purchase in North Park, San Diego. (75) | (removed) |
| `/blog/category/events` | Events guides and stories from Louisiana Purchase in North Park, San Diego. (75) | (removed) |
| `/blog/top-creole-restaurants-san-diego-local-guide` | Discover authentic Creole restaurants in San Diego. Compare Louisiana Purchase, The Taco Stand, and other local spots for genuine New Orleans cuisine in North Park. (164) | Where to find authentic Creole cooking in San Diego: what sets Louisiana Purchase in North Park apart, from the dark-roux gumbo to the New Orleans bar program. (159) |
| `/blog/top-new-orleans-cocktails-san-diego-local-guide` | Discover authentic New Orleans cocktails in San Diego. Louisiana Purchase leads with Voo Doo Carre and Praline Old Fashion in North Park. (137) | Discover authentic New Orleans cocktails in San Diego. Louisiana Purchase leads with Voo Doo Carre and Praline Old Fashioned in North Park. (139) |
| `/brunch` | Weekend brunch at Louisiana Purchase — North Park's most indulgent Saturday and Sunday ritual. Creole brunch plates, craft cocktails, and an open patio from 12 PM. Reserve your table. (183) | Weekend Creole brunch at Louisiana Purchase in North Park, San Diego: chicken and waffles, shrimp and grits, catfish and grits, plus New Orleans cocktails. (155) |
| `/contact` | Contact Louisiana Purchase in North Park, San Diego. Reservations, private event inquiries, general questions, and directions to 2305 University Ave. (149) | Contact Louisiana Purchase in North Park, San Diego: directions to 2305 University Ave, hours, phone (858) 683-6828, reservations and event inquiries. (150) |
| `/events` | Mardi Gras, seasonal menus, live music, and limited-time experiences at Louisiana Purchase in North Park, San Diego. Year-round events at San Diego's premier Creole restaurant. (176) | Events and live music on select nights at Louisiana Purchase in North Park, San Diego, plus Mardi Gras, seasonal menus and New Orleans cocktail features. (153) |
| `/happy-hour` | Louisiana Purchase's Happy Hour — North Park's best happy hour deals. Discounted craft cocktails, draft beer, and Creole bites every Monday through Friday, 3 PM to 5 PM. Walk-ins welcome. (187) | Happy hour at Louisiana Purchase in North Park, San Diego, Monday – Friday, 3 PM – 5 PM: craft cocktails, draft beer, house wine and Creole bites. (146) |
| `/menu` | Chef Quinnton Austin's elevated Creole dinner and 20+ craft cocktails at Louisiana Purchase in North Park, San Diego. Fire-forward, deeply rooted, open daily. (158) | Explore the Creole dinner and New Orleans cocktail menus at Louisiana Purchase in North Park, San Diego, from Chef Quinnton Austin's kitchen and craft bar. (155) |
| `/menu/brunch` | Louisiana Purchase's weekend Creole brunch menu in North Park, San Diego. Drop Top Chicken Flock, Catfish N' Grits, and Shrimp N' Grits — served Saturday and Sunday from noon. (175) | (removed) |
| `/menu/cocktails` | French Quarter-rooted craft cocktails at Louisiana Purchase, North Park, San Diego — Palomas, Watermelon Margaritas, Hurricane Pops. 20+ signature drinks, open daily. (166) | New Orleans cocktail menu at Louisiana Purchase in North Park, San Diego: the Hurricane, Praline Old Fashioned, frozen drinks and more signature cocktails. (155) |
| `/menu/dinner` | Chef Quinnton Austin's Creole dinner menu at Louisiana Purchase, North Park, San Diego. Fire-charred oysters, BBQ shrimp, slow-built gumbo — served daily. (154) | Creole dinner menu at Louisiana Purchase in North Park, San Diego: oxtail, seafood gumbo, Gulf catfish, fried favorites and more from Chef Quinnton Austin. (155) |
| `/privacy` | How Louisiana Purchase collects, uses, and protects your information. (69) | How Louisiana Purchase, a Creole restaurant in North Park, San Diego, collects, uses and protects your information, and the privacy choices available to you. (157) |
| `/private-events` | Host an unforgettable private event at Louisiana Purchase in North Park, San Diego. Corporate dinners, birthday celebrations, brunch buyouts, and full venue rental for up to 80 guests. (184) | Private events and buyouts at Louisiana Purchase in North Park, San Diego: patio and full-restaurant buyouts, private dining and custom menus for 80+ guests. (157) |
| `/private-events/north-park-birthday-dinner-venue` | Celebrate your birthday in style at Louisiana Purchase. Private tables, custom cocktail menus, and an opulent Creole dining atmosphere in North Park, San Diego. (160) | Celebrate your birthday at Louisiana Purchase in North Park, San Diego, with private tables, custom cocktail menus and an opulent Creole dining atmosphere. (155) |
| `/private-events/north-park-full-restaurant-buyout` | (none) | Book a full restaurant buyout at Louisiana Purchase in North Park, San Diego, for 80+ guests: the dining room, bar and outdoor patio, all yours. (144) |
| `/private-events/north-park-patio-buyout` | (none) | Book a patio buyout at Louisiana Purchase in North Park, San Diego: our lush outdoor patio, exclusively yours for cocktail receptions and rehearsal dinners. (156) |
| `/private-events/north-park-private-dining-room` | Reserve Louisiana Purchase's intimate velvet-accented private dining room for corporate dinners, milestone celebrations, and executive events in North Park, San Diego. (167) | Reserve Louisiana Purchase's intimate, velvet-accented private dining room in North Park, San Diego, for corporate dinners and milestone celebrations. (150) |
| `/private-events/north-park-rooftop-buyout` | Reserve Louisiana Purchase's hidden lush patio for an exclusive outdoor event. Perfect for cocktail receptions, rehearsal dinners, and intimate corporate gatherings in North Park, San Diego. (190) | (removed) |
| `/private-events/san-diego-brunch-private-event` | Book a private brunch experience at Louisiana Purchase in North Park. Creole brunch plates, craft cocktails, and an exclusive patio setting — exclusively yours. (160) | Book a private brunch at Louisiana Purchase in North Park, San Diego, with Creole brunch plates, craft cocktails and an exclusive patio setting for your group. (159) |
| `/private-events/san-diego-corporate-dinner-venue` | Host your next corporate dinner at Louisiana Purchase — an upscale Creole dining venue in North Park, San Diego. Custom menus, curated cocktail pairings, and dedicated event staff. (180) | Host your next corporate dinner at Louisiana Purchase, an upscale Creole restaurant in North Park, San Diego, with custom menus and dedicated event staff. (154) |
| `/the-space` | A French Quarter-inspired dining room in North Park, San Diego — marble bar, candlelit tables, open patio. Private events up to 80 guests at 2305 University Ave. (161) | Restaurant, bar and patio in North Park, San Diego: Louisiana Purchase's timber-ceilinged dining room, marble bar and fern-framed outdoor patio seating. (152) |

## 4. Schema samples (full `@graph`, from the final build)

#### `/`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://louisianapurchasesd.com/#gph",
      "name": "Grind & Prosper Hospitality",
      "url": "https://grindprosper.com/"
    },
    {
      "@type": "Restaurant",
      "@id": "https://louisianapurchasesd.com/#restaurant",
      "name": "Louisiana Purchase",
      "description": "An opulent French Quarter-inspired cocktail lounge and Creole dining destination in North Park, San Diego. Renowned for fire-charred oysters, craft Praline Old Fashioneds, and Chef Quinnton Austin's elevated Louisiana culinary program.",
      "url": "https://louisianapurchasesd.com",
      "telephone": "+18586836828",
      "email": "info@louisianapurchasesd.com",
      "priceRange": "$$$",
      "image": "https://louisianapurchasesd.com/og-image.jpg",
      "logo": {
        "@type": "ImageObject",
        "url": "https://louisianapurchasesd.com/logo.png"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2305 University Ave",
        "addressLocality": "San Diego",
        "addressRegion": "CA",
        "postalCode": "92104",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 32.7474,
        "longitude": -117.1293
      },
      "hasMap": "https://www.google.com/maps/search/?api=1&query_place_id=ChIJlSyxhVlV2YARu0db_R-gqJE",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Monday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Tuesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Wednesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Thursday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Friday",
          "opens": "12:00",
          "closes": "23:59"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Saturday",
          "opens": "12:00",
          "closes": "22:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Sunday",
          "opens": "12:00",
          "closes": "20:00"
        }
      ],
      "servesCuisine": [
        "Creole",
        "Louisiana",
        "Southern American",
        "New Orleans",
        "Cajun"
      ],
      "hasMenu": [
        {
          "@id": "https://louisianapurchasesd.com/menu/dinner#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/menu/cocktails#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/brunch#menu"
        }
      ],
      "acceptsReservations": true,
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Credit Card",
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Full Bar",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Outdoor Seating",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Private Dining Room",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Live Music",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Reservations",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Cocktail Bar",
          "value": true
        }
      ],
      "areaServed": [
        {
          "@type": "Place",
          "name": "North Park"
        },
        {
          "@type": "City",
          "name": "San Diego"
        }
      ],
      "parentOrganization": {
        "@id": "https://louisianapurchasesd.com/#gph"
      },
      "sameAs": [
        "https://www.instagram.com/louisianapurchasesd/",
        "https://www.facebook.com/LouisianaPurchaseSD/",
        "https://www.google.com/maps/place/?q=place_id:ChIJlSyxhVlV2YARu0db_R-gqJE",
        "https://www.opentable.com/r/louisiana-purchase-sd-reservations-san-diego"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://louisianapurchasesd.com/#website",
      "url": "https://louisianapurchasesd.com/",
      "name": "Louisiana Purchase",
      "inLanguage": "en-US",
      "publisher": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://louisianapurchasesd.com/#webpage",
      "url": "https://louisianapurchasesd.com/",
      "name": "Creole Restaurant in North Park, San Diego | Louisiana Purchase",
      "description": "Creole restaurant and New Orleans cocktail bar in North Park, San Diego, with Chef Quinnton Austin's Creole kitchen, craft cocktails, patio and private events.",
      "inLanguage": "en-US",
      "isPartOf": {
        "@id": "https://louisianapurchasesd.com/#website"
      },
      "about": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      }
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/dinner#menu",
      "name": "Louisiana Purchase — Dinner Menu",
      "url": "https://louisianapurchasesd.com/menu/dinner"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/cocktails#menu",
      "name": "Louisiana Purchase — Cocktail Menu",
      "url": "https://louisianapurchasesd.com/menu/cocktails"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/brunch#menu",
      "name": "Louisiana Purchase — Brunch Menu",
      "url": "https://louisianapurchasesd.com/brunch"
    }
  ]
}
```

#### `/menu/dinner`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://louisianapurchasesd.com/#gph",
      "name": "Grind & Prosper Hospitality",
      "url": "https://grindprosper.com/"
    },
    {
      "@type": "Restaurant",
      "@id": "https://louisianapurchasesd.com/#restaurant",
      "name": "Louisiana Purchase",
      "description": "An opulent French Quarter-inspired cocktail lounge and Creole dining destination in North Park, San Diego. Renowned for fire-charred oysters, craft Praline Old Fashioneds, and Chef Quinnton Austin's elevated Louisiana culinary program.",
      "url": "https://louisianapurchasesd.com",
      "telephone": "+18586836828",
      "email": "info@louisianapurchasesd.com",
      "priceRange": "$$$",
      "image": "https://louisianapurchasesd.com/og-image.jpg",
      "logo": {
        "@type": "ImageObject",
        "url": "https://louisianapurchasesd.com/logo.png"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2305 University Ave",
        "addressLocality": "San Diego",
        "addressRegion": "CA",
        "postalCode": "92104",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 32.7474,
        "longitude": -117.1293
      },
      "hasMap": "https://www.google.com/maps/search/?api=1&query_place_id=ChIJlSyxhVlV2YARu0db_R-gqJE",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Monday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Tuesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Wednesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Thursday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Friday",
          "opens": "12:00",
          "closes": "23:59"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Saturday",
          "opens": "12:00",
          "closes": "22:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Sunday",
          "opens": "12:00",
          "closes": "20:00"
        }
      ],
      "servesCuisine": [
        "Creole",
        "Louisiana",
        "Southern American",
        "New Orleans",
        "Cajun"
      ],
      "hasMenu": [
        {
          "@id": "https://louisianapurchasesd.com/menu/dinner#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/menu/cocktails#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/brunch#menu"
        }
      ],
      "acceptsReservations": true,
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Credit Card",
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Full Bar",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Outdoor Seating",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Private Dining Room",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Live Music",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Reservations",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Cocktail Bar",
          "value": true
        }
      ],
      "areaServed": [
        {
          "@type": "Place",
          "name": "North Park"
        },
        {
          "@type": "City",
          "name": "San Diego"
        }
      ],
      "parentOrganization": {
        "@id": "https://louisianapurchasesd.com/#gph"
      },
      "sameAs": [
        "https://www.instagram.com/louisianapurchasesd/",
        "https://www.facebook.com/LouisianaPurchaseSD/",
        "https://www.google.com/maps/place/?q=place_id:ChIJlSyxhVlV2YARu0db_R-gqJE",
        "https://www.opentable.com/r/louisiana-purchase-sd-reservations-san-diego"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://louisianapurchasesd.com/#website",
      "url": "https://louisianapurchasesd.com/",
      "name": "Louisiana Purchase",
      "inLanguage": "en-US",
      "publisher": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://louisianapurchasesd.com/menu/dinner#webpage",
      "url": "https://louisianapurchasesd.com/menu/dinner",
      "name": "Creole Dinner Menu, North Park San Diego | Louisiana Purchase",
      "description": "Creole dinner menu at Louisiana Purchase in North Park, San Diego: oxtail, seafood gumbo, Gulf catfish, fried favorites and more from Chef Quinnton Austin.",
      "inLanguage": "en-US",
      "isPartOf": {
        "@id": "https://louisianapurchasesd.com/#website"
      },
      "about": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      },
      "breadcrumb": {
        "@id": "https://louisianapurchasesd.com/menu/dinner#breadcrumb"
      },
      "mainEntity": {
        "@id": "https://louisianapurchasesd.com/menu/dinner#menu"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://louisianapurchasesd.com/menu/dinner#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://louisianapurchasesd.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Menu",
          "item": "https://louisianapurchasesd.com/menu"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Dinner",
          "item": "https://louisianapurchasesd.com/menu/dinner"
        }
      ]
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/cocktails#menu",
      "name": "Louisiana Purchase — Cocktail Menu",
      "url": "https://louisianapurchasesd.com/menu/cocktails"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/brunch#menu",
      "name": "Louisiana Purchase — Brunch Menu",
      "url": "https://louisianapurchasesd.com/brunch"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/dinner#menu",
      "name": "Louisiana Purchase — Dinner Menu",
      "description": "Chef Quinnton Austin's elevated Creole dinner menu at Louisiana Purchase in North Park, San Diego.",
      "url": "https://louisianapurchasesd.com/menu/dinner",
      "inLanguage": "en-US",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Oxtail Kingdom",
          "description": "We run oxtail in SD.",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Oxtail Plate",
              "description": "8oz braised oxtail · smoked gouda mac · sweet potato cornbread"
            },
            {
              "@type": "MenuItem",
              "name": "Lamb and Oxtail Dirty Rice",
              "description": "4 bones · oxtail dirty rice · chimichurri · mint oil"
            }
          ]
        },
        {
          "@type": "MenuSection",
          "name": "Creole Soul Bangers",
          "description": "Chef Q's full vision. The heavy hitters.",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Dragos",
              "description": "2 fried lobster tails · linguine · cajun cream sauce · charred lemon"
            },
            {
              "@type": "MenuItem",
              "name": "Steak Monica",
              "description": "14oz ribeye · crawfish cream sauce · grated parmesan"
            },
            {
              "@type": "MenuItem",
              "name": "Uptown Seafood Gumbo",
              "description": "jumbo shrimp · crawfish · andouille · dark roux · okra · rice"
            },
            {
              "@type": "MenuItem",
              "name": "Gator Bites",
              "description": "6oz fried alligator · cajun fries · honey mustard crystal sauce"
            },
            {
              "@type": "MenuItem",
              "name": "Catfish Etouffee",
              "description": "blackened or fried · crawfish etouffee · creole rice"
            },
            {
              "@type": "MenuItem",
              "name": "Blackened Salmon",
              "description": "8oz salmon · herb rice · cajun butter"
            },
            {
              "@type": "MenuItem",
              "name": "Creole Shrimp Pasta",
              "description": "gulf shrimp · roasted tomato basil cream · parm"
            },
            {
              "@type": "MenuItem",
              "name": "Shrimp and Grits",
              "description": "gulf shrimp · crawfish cream · creole grits · bacon · green onion"
            },
            {
              "@type": "MenuItem",
              "name": "Acme Oysters",
              "description": "chargrilled gulf oysters, garlic lemon butter, parmesan"
            },
            {
              "@type": "MenuItem",
              "name": "Alligator Cheesecake",
              "description": "savory · alligator · andouille · gouda · crawfish cream"
            }
          ]
        },
        {
          "@type": "MenuSection",
          "name": "Gulf",
          "description": "Gulf shrimp. Whole catfish fillets.",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Lemon Pepper Catfish",
              "description": "whole fillet · lemon pepper crust · cornbread · 1 side · LP tartar"
            },
            {
              "@type": "MenuItem",
              "name": "Combo Basket",
              "description": "1⁄2 catfish fillet · 5 shrimp · cajun fries · hot honey · LP tartar"
            },
            {
              "@type": "MenuItem",
              "name": "Hot Honey Fried Shrimp",
              "description": "5 jumbo shrimp · cajun fries · hot honey · tartar"
            },
            {
              "@type": "MenuItem",
              "name": "Catfish and Chips",
              "description": "4oz catfish · cajun fries · hot honey · LP tartar"
            }
          ]
        },
        {
          "@type": "MenuSection",
          "name": "Fry House",
          "description": "Brined. Breaded. Fried to order.",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Dooky Chase",
              "description": "4 whole wings · biscuit · 1 side — homage to leah chase"
            },
            {
              "@type": "MenuItem",
              "name": "Chopped Tender Fries",
              "description": "3 tenders · fries · cheddar · LP sauce · green onion"
            },
            {
              "@type": "MenuItem",
              "name": "Tenders",
              "description": "choice of sauce · cajun fries (parm fries +3)"
            },
            {
              "@type": "MenuItem",
              "name": "Wings",
              "description": "10 - 15 - drums and flats · choice of sauce · fries 7 SAUCES · PICK YOURS · TRY A DIFFERENT ONE NEXT TIME LEMON PEPPER · LP WET · COGNAC BBQ · CRAWFISH PARM · LP HOTS · CAJUN SPICE · GHOST"
            }
          ]
        }
      ]
    }
  ]
}
```

#### `/brunch`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://louisianapurchasesd.com/#gph",
      "name": "Grind & Prosper Hospitality",
      "url": "https://grindprosper.com/"
    },
    {
      "@type": "Restaurant",
      "@id": "https://louisianapurchasesd.com/#restaurant",
      "name": "Louisiana Purchase",
      "description": "An opulent French Quarter-inspired cocktail lounge and Creole dining destination in North Park, San Diego. Renowned for fire-charred oysters, craft Praline Old Fashioneds, and Chef Quinnton Austin's elevated Louisiana culinary program.",
      "url": "https://louisianapurchasesd.com",
      "telephone": "+18586836828",
      "email": "info@louisianapurchasesd.com",
      "priceRange": "$$$",
      "image": "https://louisianapurchasesd.com/og-image.jpg",
      "logo": {
        "@type": "ImageObject",
        "url": "https://louisianapurchasesd.com/logo.png"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2305 University Ave",
        "addressLocality": "San Diego",
        "addressRegion": "CA",
        "postalCode": "92104",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 32.7474,
        "longitude": -117.1293
      },
      "hasMap": "https://www.google.com/maps/search/?api=1&query_place_id=ChIJlSyxhVlV2YARu0db_R-gqJE",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Monday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Tuesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Wednesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Thursday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Friday",
          "opens": "12:00",
          "closes": "23:59"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Saturday",
          "opens": "12:00",
          "closes": "22:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Sunday",
          "opens": "12:00",
          "closes": "20:00"
        }
      ],
      "servesCuisine": [
        "Creole",
        "Louisiana",
        "Southern American",
        "New Orleans",
        "Cajun"
      ],
      "hasMenu": [
        {
          "@id": "https://louisianapurchasesd.com/menu/dinner#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/menu/cocktails#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/brunch#menu"
        }
      ],
      "acceptsReservations": true,
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Credit Card",
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Full Bar",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Outdoor Seating",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Private Dining Room",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Live Music",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Reservations",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Cocktail Bar",
          "value": true
        }
      ],
      "areaServed": [
        {
          "@type": "Place",
          "name": "North Park"
        },
        {
          "@type": "City",
          "name": "San Diego"
        }
      ],
      "parentOrganization": {
        "@id": "https://louisianapurchasesd.com/#gph"
      },
      "sameAs": [
        "https://www.instagram.com/louisianapurchasesd/",
        "https://www.facebook.com/LouisianaPurchaseSD/",
        "https://www.google.com/maps/place/?q=place_id:ChIJlSyxhVlV2YARu0db_R-gqJE",
        "https://www.opentable.com/r/louisiana-purchase-sd-reservations-san-diego"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://louisianapurchasesd.com/#website",
      "url": "https://louisianapurchasesd.com/",
      "name": "Louisiana Purchase",
      "inLanguage": "en-US",
      "publisher": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://louisianapurchasesd.com/brunch#webpage",
      "url": "https://louisianapurchasesd.com/brunch",
      "name": "Weekend Creole Brunch in North Park | Louisiana Purchase",
      "description": "Weekend Creole brunch at Louisiana Purchase in North Park, San Diego: chicken and waffles, shrimp and grits, catfish and grits, plus New Orleans cocktails.",
      "inLanguage": "en-US",
      "isPartOf": {
        "@id": "https://louisianapurchasesd.com/#website"
      },
      "about": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      },
      "breadcrumb": {
        "@id": "https://louisianapurchasesd.com/brunch#breadcrumb"
      },
      "mainEntity": {
        "@id": "https://louisianapurchasesd.com/brunch#menu"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://louisianapurchasesd.com/brunch#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://louisianapurchasesd.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Brunch",
          "item": "https://louisianapurchasesd.com/brunch"
        }
      ]
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/dinner#menu",
      "name": "Louisiana Purchase — Dinner Menu",
      "url": "https://louisianapurchasesd.com/menu/dinner"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/cocktails#menu",
      "name": "Louisiana Purchase — Cocktail Menu",
      "url": "https://louisianapurchasesd.com/menu/cocktails"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/brunch#menu",
      "name": "Louisiana Purchase — Brunch Menu",
      "description": "Louisiana Purchase's weekend Creole brunch menu in North Park, San Diego.",
      "url": "https://louisianapurchasesd.com/brunch",
      "inLanguage": "en-US",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Brunch Plates",
          "description": "Brunch favorites are on the menu from noon on Saturdays and Sundays.",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Drop Top Chicken Flock",
              "description": "Waffle topped with fried wings, honey butter, maple syrup n' fresh fruit."
            },
            {
              "@type": "MenuItem",
              "name": "Catfish N' Grits",
              "description": "Fried catfish, creole sauce, smoked gouda grits, bacon n' green onion."
            },
            {
              "@type": "MenuItem",
              "name": "Shrimp N' Grits",
              "description": "Fried shrimp, creole sauce, smoked gouda grits, bacon n' green onion."
            }
          ]
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://louisianapurchasesd.com/brunch#faq",
      "isPartOf": {
        "@id": "https://louisianapurchasesd.com/brunch#webpage"
      },
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What days does Louisiana Purchase serve brunch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Brunch favorites are on the menu from noon on Saturdays and Sundays. Brunch isn't a separate seating with its own hours — the brunch dishes join the regular menu on those days."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a reservation for brunch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Walk-ins are welcome but reservations are strongly recommended, especially on Saturdays. Tables fill quickly on weekend mornings. Reserve online through our reservations link."
          }
        },
        {
          "@type": "Question",
          "name": "What kind of food is served at brunch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Louisiana Purchase serves elevated Creole brunch plates inspired by New Orleans weekend dining. Expect rotating seasonal dishes, fire-forward preparations, and Chef Quinnton Austin's signature Creole kitchen approach."
          }
        },
        {
          "@type": "Question",
          "name": "Are cocktails available at brunch?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The full bar is open from noon including all signature cocktails — Superbird Palomas, Watermelon Margaritas, Hurricane Pops, and more."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book a private brunch at Louisiana Purchase?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Louisiana Purchase offers full venue and patio buyouts for private brunch events — birthday celebrations, baby showers, corporate gatherings, and more."
          }
        },
        {
          "@type": "Question",
          "name": "Where is Louisiana Purchase located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Louisiana Purchase is located at 2305 University Ave in North Park, San Diego, CA 92104 — at the corner of University Ave & 23rd St."
          }
        }
      ]
    }
  ]
}
```

#### `/private-events/north-park-full-restaurant-buyout`

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://louisianapurchasesd.com/#gph",
      "name": "Grind & Prosper Hospitality",
      "url": "https://grindprosper.com/"
    },
    {
      "@type": "Restaurant",
      "@id": "https://louisianapurchasesd.com/#restaurant",
      "name": "Louisiana Purchase",
      "description": "An opulent French Quarter-inspired cocktail lounge and Creole dining destination in North Park, San Diego. Renowned for fire-charred oysters, craft Praline Old Fashioneds, and Chef Quinnton Austin's elevated Louisiana culinary program.",
      "url": "https://louisianapurchasesd.com",
      "telephone": "+18586836828",
      "email": "info@louisianapurchasesd.com",
      "priceRange": "$$$",
      "image": "https://louisianapurchasesd.com/og-image.jpg",
      "logo": {
        "@type": "ImageObject",
        "url": "https://louisianapurchasesd.com/logo.png"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2305 University Ave",
        "addressLocality": "San Diego",
        "addressRegion": "CA",
        "postalCode": "92104",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 32.7474,
        "longitude": -117.1293
      },
      "hasMap": "https://www.google.com/maps/search/?api=1&query_place_id=ChIJlSyxhVlV2YARu0db_R-gqJE",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Monday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Tuesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Wednesday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Thursday",
          "opens": "15:00",
          "closes": "21:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Friday",
          "opens": "12:00",
          "closes": "23:59"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Saturday",
          "opens": "12:00",
          "closes": "22:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "https://schema.org/Sunday",
          "opens": "12:00",
          "closes": "20:00"
        }
      ],
      "servesCuisine": [
        "Creole",
        "Louisiana",
        "Southern American",
        "New Orleans",
        "Cajun"
      ],
      "hasMenu": [
        {
          "@id": "https://louisianapurchasesd.com/menu/dinner#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/menu/cocktails#menu"
        },
        {
          "@id": "https://louisianapurchasesd.com/brunch#menu"
        }
      ],
      "acceptsReservations": true,
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Credit Card",
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Full Bar",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Outdoor Seating",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Private Dining Room",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Live Music",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Reservations",
          "value": true
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Cocktail Bar",
          "value": true
        }
      ],
      "areaServed": [
        {
          "@type": "Place",
          "name": "North Park"
        },
        {
          "@type": "City",
          "name": "San Diego"
        }
      ],
      "parentOrganization": {
        "@id": "https://louisianapurchasesd.com/#gph"
      },
      "sameAs": [
        "https://www.instagram.com/louisianapurchasesd/",
        "https://www.facebook.com/LouisianaPurchaseSD/",
        "https://www.google.com/maps/place/?q=place_id:ChIJlSyxhVlV2YARu0db_R-gqJE",
        "https://www.opentable.com/r/louisiana-purchase-sd-reservations-san-diego"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://louisianapurchasesd.com/#website",
      "url": "https://louisianapurchasesd.com/",
      "name": "Louisiana Purchase",
      "inLanguage": "en-US",
      "publisher": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout#webpage",
      "url": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout",
      "name": "Full Restaurant Buyout in North Park | Louisiana Purchase",
      "description": "Book a full restaurant buyout at Louisiana Purchase in North Park, San Diego, for 80+ guests: the dining room, bar and outdoor patio, all yours.",
      "inLanguage": "en-US",
      "isPartOf": {
        "@id": "https://louisianapurchasesd.com/#website"
      },
      "about": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      },
      "breadcrumb": {
        "@id": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout#breadcrumb"
      },
      "mainEntity": {
        "@id": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout#venue"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://louisianapurchasesd.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Private Events",
          "item": "https://louisianapurchasesd.com/private-events"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Full Restaurant Buyout in North Park, San Diego",
          "item": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout"
        }
      ]
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/dinner#menu",
      "name": "Louisiana Purchase — Dinner Menu",
      "url": "https://louisianapurchasesd.com/menu/dinner"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/menu/cocktails#menu",
      "name": "Louisiana Purchase — Cocktail Menu",
      "url": "https://louisianapurchasesd.com/menu/cocktails"
    },
    {
      "@type": "Menu",
      "@id": "https://louisianapurchasesd.com/brunch#menu",
      "name": "Louisiana Purchase — Brunch Menu",
      "url": "https://louisianapurchasesd.com/brunch"
    },
    {
      "@type": "EventVenue",
      "@id": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout#venue",
      "name": "Louisiana Purchase — Full Restaurant Buyout in North Park, San Diego",
      "description": "Book a full restaurant buyout at Louisiana Purchase in North Park, San Diego, for 80+ guests: the dining room, bar and outdoor patio, all yours.",
      "url": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout",
      "containedInPlace": {
        "@id": "https://louisianapurchasesd.com/#restaurant"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2305 University Ave",
        "addressLocality": "San Diego",
        "addressRegion": "CA",
        "postalCode": "92104",
        "addressCountry": "US"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout#faq",
      "isPartOf": {
        "@id": "https://louisianapurchasesd.com/private-events/north-park-full-restaurant-buyout#webpage"
      },
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I book a full restaurant buyout at Louisiana Purchase?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Submit an inquiry through our private events portal. Our events team responds within 24 hours to discuss availability, menu options, and pricing for your full restaurant buyout in North Park, San Diego."
          }
        },
        {
          "@type": "Question",
          "name": "What is the guest capacity for a full restaurant buyout?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accommodate 80+ guests. Specific minimums and configurations vary by space and date. Contact our events team for a custom quote."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize the menu for my event?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Chef Quinnton Austin and our culinary team offer fully bespoke menu curation — from passed cocktail-hour bites to multi-course Creole dinner experiences."
          }
        },
        {
          "@type": "Question",
          "name": "Does Louisiana Purchase offer cocktail pairings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our bar program specializes in custom cocktail pairings and curated open bar packages. Signature cocktails including the Praline Old Fashioned and Voo Doo Carré are available for all events."
          }
        },
        {
          "@type": "Question",
          "name": "How far in advance should I book?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend inquiring at least 3–4 weeks ahead for weekday events and 6–8 weeks for weekend dates. Popular dates fill quickly."
          }
        }
      ]
    }
  ]
}
```

## 5. Redirects added (`vercel.json`, same single-line format, all `"permanent": true`)

| Source | Destination |
|---|---|
| `/menu/brunch` | `/brunch` |
| `/private-events/north-park-rooftop-buyout` | `/private-events/north-park-patio-buyout` |
| `/blog/best-happy-hour-north-park` | `/blog/north-park-happy-hour-guide` |
| `/blog/best-creole-restaurants-north-park-san-diego` | `/blog/top-creole-restaurants-san-diego-local-guide` |

No destination is itself a redirect source, so there are no chains. The pre-existing `/menus/brunch → /brunch` still resolves in one hop. No internal link in `dist/` points to a redirected URL or to a trailing-slash URL (check 9).

## 6. Verification output (verbatim)

Script: `/tmp/lp-phase2-verify/verify.py` (outside the repo), run against `dist/` from a fresh production-env build (`/tmp/lp-phase2-verify/build.sh` exports `vercel.json`'s `build.env`, deletes `dist/`, then runs `npm run build`).

Interpretation notes:
- The forbidden-string scan covers every text file in `dist/`, including the Keystatic admin bundle, which embeds the content JSON. `20+` is matched as a claim, `(?<![0-9])20\+`, so minified library arithmetic such as `56320+65536` does not count.
- The brunch-window scan also catches `12 PM – 3 PM` and `noon – 3` variants.
- Test and `astro check` baselines were recorded on `main` before any change:
  - `npm test`: 4 pass / 4 fail. The failures are pre-existing: the fixtures reference `kitchenRawFire`, `kitchenPlates` and `hurricane-pop`, which don't exist.
  - `astro check`: 1 error / 0 warnings / 6 hints. The error is pre-existing: `keystatic.config.ts` blog `category` select `validation`.
  - After the changes: the same 4 tests fail and no new ones. `astro check`: the same single error, 0 warnings, 2 hints.

```
[PASS]  1. Exactly one <h1> per page; WP2 H1 text matches
[PASS]  2. No skipped heading levels; no chrome/empty headings; no run-together words
[PASS]  3. Titles <=65 chars, no doubled locality, WP4 titles exact
[PASS]  4. Meta descriptions 140–160 chars on WP2 pages (+/privacy)
[PASS]  5. One JSON-LD @graph per page, refs resolve, no aggregateRating/FoodEstablishment/24:00, Menu+FAQPage present
[PASS]  6. Zero <img> without alt; menu item alts unique
[PASS]  7. Forbidden strings absent from dist/
[PASS]  8. Gift Cards link has an href on every page
[PASS]  9. Required 301s exist, no chains, no internal links to redirected URLs
[PASS] 10. Sitemap includes new pages, excludes archives/pagination/redirects, blog lastmod
[PASS] 11. /llms.txt from data; 404.html with noindex
[PASS] 12. npm test: no new failures (tests: 4 pass / 4 fail (baseline 4 pass / 4 fail, pre-existing stale fixtures)); astro check 1 errors / 0 warnings / 2 hints (baseline 1/0/6)
[PASS] 13. Keystatic config loads ({"storage":"cloud","singletons":17,"collections":14,"brunchDays":"Brunch Days (7 options, stored=[\"Saturday\",\"Sunday\"])"}); new fields populated

13/13 checks passed (36 HTML pages scanned)
```

## 7. Owner action items

1. **Environment variables.** Set both in Vercel for **Production and Preview**, in the project's Environment Variables settings, not in `vercel.json`.
   - `GOOGLE_PLACES_API_KEY` (required for the homepage Google Rating stat). The Place ID defaults to `venueSettings.mapsPlaceId`. `GOOGLE_PLACE_ID` is an optional override. Without the key, the build still succeeds and the stat is hidden.
   - `PUBLIC_GIFT_CARD_URL` (optional). Until it is set, "Gift Cards" links to `/contact`.
2. **Instagram handle mismatch.** `/contact` showed "@LouisianaPurchaseBar", but `venueSettings.social.instagram` is `https://www.instagram.com/louisianapurchasesd/`. The page now shows **@louisianapurchasesd**, derived from the URL. Confirm which account is correct. If it's @LouisianaPurchaseBar, update the URL in Venue / Business Data and the handle follows automatically.
3. **Existing uses of the 40 / 50 capacities (unchanged, as instructed):**
   - `/private-events` StatBar: "40 — Private Room", "50 — Patio Reception".
   - `/private-events` "A Private Event Venue…" facts: "Private Room: Up to 40 Guests", "Patio: Up to 50 Guests".
   - `/private-events` "Three Private Event Spaces" body ("private dining room for seated dinners up to 40") and facts ("Up to 40 seated", "Up to 50 standing").
   - `/the-space` patio row: "The patio accommodates up to 50 guests…", fact "Capacity: Up to 50 Guests". Private-events row facts: "Private Room: Up to 40 Guests", "Patio: Up to 50 Guests".
   - Private Dining Room event type capacity: "20–40 guests".
   - `venueSettings.eventCapacity.privateRoom: 40`, `patio: 50`. No code reads these fields.
   - Related figures to confirm:
     - Patio Buyout capacity is now "30–80+ guests" (standardized from "30–80"). That conflicts with the 50-guest patio figure.
     - Blog posts give the private dining room "20–60 guests" (Cajun ×2, Gumbo) and "up to 60 guests" (Host an event ×2).
     - The pricing guide's example scales to "150 guests".
     - Private Brunch capacity is "20–60 guests".
4. **Misspelled slugs left unchanged:** none. The only misspelled identifier, `cocktailsMenu/prailine-old-fashioned`, was a content filename, not a URL, and was renamed to `praline-old-fashioned`, along with its image folder. No public URL contained any of the listed misspellings.
5. **Named-competitor claims in the remaining blog posts (not edited, per WP11):**

| Post | Sentence | Business |
|---|---|---|
| `/blog/best-cajun-restaurants-san-diego-guide` | "Over the past ten years, a cluster of chef-driven restaurants—Juniper & Ivy, Puesto, Herb & Wood—signaled that serious dining could thrive outside downtown." (presented as part of North Park's rise) | Juniper & Ivy, Puesto, Herb & Wood |
| `/blog/best-creole-small-plates-san-diego-2026-local-guide` | "**Juniper & Ivy**, while not exclusively Creole, incorporates Louisiana influences into their seasonal small plates program. Chef Richard Blais's approach emphasizes local San Diego ingredients filtered through a broader American lens, but when Creole elements appear, they're executed with precision. Their small plates tend toward higher price points ($14–$18) and reflect Blais's modernist sensibility." | Juniper & Ivy (Chef Richard Blais) |
| `/blog/best-creole-small-plates-san-diego-2026-local-guide` | "**Puesto**, a few blocks south, focuses on Mexican cuisine but offers a different model for how regional cooking translates to small plates. Their approach—respecting tradition while adapting to local ingredient availability—mirrors Louisiana Purchase's philosophy, even if the flavor profiles diverge entirely." | Puesto |
| `/blog/gumbo-showdown-san-diego-comparison-guide` | Heading "**The Taco Stand Approach (Hillcrest & Beyond)**" followed by "Several casual spots in Hillcrest and Mission Hills offer gumbo as a side offering, not a signature. … The result tastes thin, one-dimensional. Okra becomes mushy. …" | The Taco Stand (named in the heading) |
| `/blog/top-new-orleans-cocktails-san-diego-local-guide` | "Noble Experiment in Little Italy operates as a reservation-only bar focused on molecular mixology and technique." | Noble Experiment |
| `/blog/top-new-orleans-cocktails-san-diego-local-guide` | "Juniper & Ivy in Little Italy emphasizes California wine and spirits with cocktails designed to complement their food program." | Juniper & Ivy |
| `/blog/top-new-orleans-cocktails-san-diego-local-guide` | "The Taco Stand locations serve classic cocktails in a casual, high-volume setting." | The Taco Stand |

Also note: the `gphNetwork.ts` file comment says to copy it identically into every GPH repo, and WP5 added `GRIND_AND_PROSPER_NAME` to it, so sync that line to the sister-site repos.

## 8. Out-of-scope defects noticed (not changed)

- `tests/keystatic-image-bridge.test.mjs`: 4 of 8 tests fail on `main`, because they reference the `kitchenRawFire` and `kitchenPlates` collections and the `hurricane-pop` entry, none of which exist.
- `astro check`: pre-existing error at `keystatic.config.ts` (blog `category` select passes an unsupported `validation` option).
- Kitchen item images live under `cms/kitchenPlates/…` and `cms/kitchenRawFire/…`, but the Keystatic image fields for Creole Soul Bangers, Gulf and Fry House point at their own directories. The CMS may not load those existing photos.
- Site copy names drinks that are not in `cocktailsMenu`: "Superbird Palomas, Watermelon Margaritas, Hurricane Pops" (brunch FAQ, cocktails hero, `/menu` card), "Voo Doo Carré" (private-events FAQs, blog), "Café Brûlot Martini" (`/about`), and Sazerac and Vieux Carré (blog).
- The Weezy Vice description has the typo "frozen cockail". It is not in the WP10 list.
- Other menu-item alts are still raw menu copy, for example Acme Oysters and Steak Monica. Only the three listed items were normalized.
- Blog posts contain other unverified LP facts:
  - price ranges and per-person costs (pricing guide, Cajun);
  - "gumbo in the dining room Thursday through Sunday" (Gumbo);
  - "Sazerac drops to $10" and beignets, fried okra and crawfish cakes (Cajun);
  - "Chef Austin's New Orleans background".
- The blog index and category cards never show images, because post images are `/public` paths that the `IMAGES` registry doesn't resolve.
- `/happy-hour` shows hard-coded deal prices ("From $9", "$6+ Starting Price").
- The brunch FAQ says "Tables fill quickly on weekend mornings", but the earliest opening is noon.
- The home (block 5) and `/menu` (block 7) content still hold unrendered brunch blocks. Their copy was updated to tokens but they don't render.
- `.env.example` `PUBLIC_VENUE_PHONE` / `PUBLIC_VENUE_EMAIL` are placeholders (`+16195551234`, `hello@…`) that differ from the real values, so local builds with a copied `.env` show the wrong phone number.
- `ConsentBanner.astro` declares an unused `siteName` prop.
- The Keystatic admin route adds a serverless function (`dist/server/entry.mjs`). This was pre-existing; nothing new was added.
- `npm audit` vulnerabilities were reported during install (pre-existing dependency issue).
