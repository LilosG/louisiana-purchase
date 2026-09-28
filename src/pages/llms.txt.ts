// src/pages/llms.txt.ts
// Louisiana Purchase — /llms.txt, generated at build time (prerendered, no runtime).
// Every value comes from venueSettings, localSeo, the page singletons' SEO fields
// and the privateEventTypes collection. Nothing here is hand-written copy.

import type { APIRoute } from 'astro';
import { getOrderedCollection, getSingleton, venueTokens } from '../content/siteData';

export const prerender = true;

// Main pages, in site order, and the Keystatic singleton that holds each page's SEO fields.
const PAGES: Array<[path: string, singleton: string, id: string]> = [
  ['/', 'home', 'home'],
  ['/menu', 'menuIndexPage', 'page'],
  ['/menu/dinner', 'menuDinnerPage', 'page'],
  ['/menu/cocktails', 'menuCocktailsPage', 'page'],
  ['/brunch', 'brunchPage', 'page'],
  ['/happy-hour', 'happyHourPage', 'page'],
  ['/events', 'eventsIndexPage', 'page'],
  ['/private-events', 'privateEventsIndexPage', 'page'],
  ['/the-space', 'theSpacePage', 'page'],
  ['/about', 'about', 'about'],
  ['/contact', 'contactPage', 'page'],
];

const pageSeo = (content: any) =>
  content?.seo ?? content?.blocks?.find((block: any) => block.component === 'Layout')?.props ?? {};

export const GET: APIRoute = async () => {
  const venue = await getSingleton('venueSettings', 'settings');
  const seo = await getSingleton('localSeo', 'localSeo');
  const tokens = venueTokens(venue);
  const site = (import.meta.env.PUBLIC_SITE_URL || venue.domain).replace(/\/$/, '');
  const address = venue.address;

  const pages = await Promise.all(PAGES.map(async ([path, singleton, id]) => {
    const meta = pageSeo(await getSingleton(singleton, id));
    return `- [${meta.title}](${site}${path === '/' ? '/' : path}): ${meta.description}`;
  }));
  const eventTypes = (await getOrderedCollection('privateEventTypes')).map((event: any) =>
    `- [${event.title}](${site}/private-events/${event.slug}): ${event.description} Capacity: ${event.capacity}.`);

  const lines = [
    `# ${venue.name}`,
    '',
    `> ${seo.description}`,
    '',
    '## Location and contact',
    `- Address: ${address.street}, ${address.neighborhood}, ${address.city}, ${address.state} ${address.zip}`,
    `- Neighborhood: ${address.neighborhood}, ${address.city}`,
    `- Cross street: ${address.crossStreet}`,
    `- Phone: ${tokens.VENUE_PHONE}`,
    `- Email: ${import.meta.env.PUBLIC_VENUE_EMAIL || venue.emailFallback}`,
    `- Google Maps: ${venue.mapsUrl}`,
    `- Cuisine: ${(seo.cuisines ?? []).join(', ')}`,
    `- Amenities: ${(seo.amenities ?? []).join(', ')}`,
    '',
    '## Hours',
    ...(venue.displayHours ?? []).map((row: any) => `- ${row.label}: ${row.value}`),
    `- ${venue.happyHour.label}: ${venue.happyHour.days}, ${venue.happyHour.window}`,
    ...(tokens.BRUNCH_AVAILABILITY ? [`- Brunch: ${tokens.BRUNCH_AVAILABILITY}`] : []),
    '',
    '## Reservations and ordering',
    `- Reservations: ${venue.reservationsUrl}`,
    `- Order online: ${venue.orderUrl}`,
    ...(tokens.EVENT_CAPACITY ? [`- Private events: ${tokens.EVENT_CAPACITY} (${site}/private-events)`] : []),
    '',
    '## Main pages',
    ...pages,
    '',
    '## Private events',
    ...eventTypes,
    '',
    '## Social',
    `- Instagram: ${venue.social.instagram}`,
    `- Facebook: ${venue.social.facebook}`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
