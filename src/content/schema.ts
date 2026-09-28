// src/content/schema.ts
// Louisiana Purchase — shared JSON-LD entity builders.
//
// LocalSEO.astro assembles every page's single @graph (Organization,
// Restaurant, WebSite, WebPage, BreadcrumbList) and appends the page-specific
// entities built here. All menu schema goes through buildMenuSchema(), which
// reads the same menuStructure + item collections that render the menu cards.
// No offers/prices are emitted.

import { getMenuData, getSingleton } from './siteData';

export type SchemaEntity = Record<string, unknown>;

export async function getSiteUrl(): Promise<string> {
  const venue = await getSingleton('venueSettings', 'settings');
  return (import.meta.env.PUBLIC_SITE_URL || venue.domain).replace(/\/$/, '');
}

/** The menu pages that carry a Menu entity: page path, menuStructure section ids, and name source. */
export const MENU_PAGES = [
  { path: '/menu/dinner',    sections: ['food'],      singleton: 'menuDinnerPage',    fallbackName: 'Dinner Menu' },
  { path: '/menu/cocktails', sections: ['cocktails'], singleton: 'menuCocktailsPage', fallbackName: 'Cocktail Menu' },
  { path: '/brunch',         sections: ['brunch'],    singleton: 'brunchPage',        fallbackName: 'Brunch Menu' },
] as const;

export type MenuPagePath = (typeof MENU_PAGES)[number]['path'];

export const menuId = (siteUrl: string, path: string) => `${siteUrl}${path}#menu`;
export const pageId = (siteUrl: string, path: string) => `${siteUrl}${path}#webpage`;

async function menuMeta(path: string) {
  const page = MENU_PAGES.find((menu) => menu.path === path);
  if (!page) throw new Error(`No Menu schema is defined for ${path}`);
  const content = await getSingleton(page.singleton, 'page');
  return {
    page,
    name: content?.seo?.schemaName || page.fallbackName,
    description: content?.seo?.schemaDescription,
  };
}

/** Lightweight Menu nodes so Restaurant.hasMenu / WebPage.hasPart references resolve on every page. */
export async function menuStubs(siteUrl: string): Promise<SchemaEntity[]> {
  return Promise.all(MENU_PAGES.map(async ({ path }) => {
    const { name } = await menuMeta(path);
    return { '@type': 'Menu', '@id': menuId(siteUrl, path), name, url: `${siteUrl}${path}` };
  }));
}

/** Full Menu → MenuSection → MenuItem entity built from the collections that render the cards. */
export async function buildMenuSchema(path: MenuPagePath): Promise<SchemaEntity> {
  const siteUrl = await getSiteUrl();
  const { page, name, description } = await menuMeta(path);
  const data = await getMenuData();
  const sections = data.sections.filter((section: any) => (page.sections as readonly string[]).includes(section.id));
  const hasMenuSection = sections.flatMap((section: any) => section.categories.map((category: any) => ({
    '@type': 'MenuSection',
    name: category.label,
    ...(category.description && { description: category.description }),
    hasMenuItem: category.items
      .filter((item: any) => item.available)
      .map((item: any) => ({
        '@type': 'MenuItem',
        name: String(item.name).trim(),
        ...(item.description && { description: String(item.description).replace(/\s+/g, ' ').trim() }),
      })),
  }))).filter((section: any) => section.hasMenuItem.length > 0);
  return {
    '@type': 'Menu',
    '@id': menuId(siteUrl, path),
    name,
    ...(description && { description }),
    url: `${siteUrl}${path}`,
    inLanguage: 'en-US',
    hasMenuSection,
  };
}

/** FAQPage entity for a page, from any { q, a } list (collections or frontmatter). */
export async function buildFaqSchema(path: string, faqs: Array<{ q: string; a: string }>): Promise<SchemaEntity | null> {
  if (!faqs?.length) return null;
  const siteUrl = await getSiteUrl();
  return {
    '@type': 'FAQPage',
    '@id': `${siteUrl}${path}#faq`,
    isPartOf: { '@id': pageId(siteUrl, path) },
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}
