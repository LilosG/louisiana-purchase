import { getCollection } from 'astro:content';
import ratingData from '../data/google-rating.json';

// ─── Venue data tokens ───────────────────────────────────────────────────────
// Content (Keystatic singletons and collections) may reference venue facts with
// {{TOKEN}} placeholders instead of typing them, so address, phone, hours and
// capacity copy always come from venueSettings. Tokens are resolved at build
// time. A string that is exactly "{{TOKEN}}" is replaced by the token's raw value
// (which may be an array, e.g. hours rows); unknown tokens are left untouched so
// page-local placeholders such as {{eventType}} keep working.

/** Formats a US E.164 number (+18586836828) as (858) 683-6828; other formats pass through. */
export function formatPhone(value: string): string {
  const digits = String(value ?? '').replace(/\D/g, '').replace(/^1/, '');
  if (digits.length !== 10) return value;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Instagram handle ("@name") derived from the profile URL in venueSettings.social. */
export function instagramHandle(url: string | undefined): string {
  const match = String(url ?? '').match(/instagram\.com\/([^/?#]+)/i);
  return match ? `@${match[1]}` : '';
}

/** Returns the cross street without the venue's own street name ("University Ave & 23rd St" → "23rd St"). */
function crossStreetShort(address: any): string {
  const streetName = String(address?.street ?? '').replace(/^\d+\s+/, '').trim().toLowerCase();
  const parts = String(address?.crossStreet ?? '').split('&').map((part) => part.trim()).filter(Boolean);
  return parts.find((part) => part.toLowerCase() !== streetName) ?? parts[0] ?? '';
}

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

/** "15:00" → "3 PM", "11:30" → "11:30 AM", "24:00" → "12 AM"; noonWord turns "12:00" into "noon". */
export function formatTime(time: string, noonWord = false): string {
  const [h, m = '00'] = String(time ?? '').split(':');
  const hour = Number(h);
  if (!Number.isFinite(hour)) return '';
  if (noonWord && hour === 12 && m === '00') return 'noon';
  const suffix = hour % 24 < 12 ? 'AM' : 'PM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}${m === '00' ? '' : `:${m}`} ${suffix}`;
}

function joinList(items: string[], last = 'and'): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${last} ${items[items.length - 1]}`;
}

/**
 * Brunch is not a separate service: brunch favorites are on the menu on the
 * venueSettings.brunchDays, from that day's opening time in regularHours.
 * No end time is ever stated.
 */
function brunchTokens(venue: any): Record<string, string> {
  const days = WEEKDAYS.filter((day) => (Array.isArray(venue.brunchDays) ? venue.brunchDays : []).includes(day));
  const hours = Array.isArray(venue.regularHours) ? venue.regularHours : [];
  const opens = (day: string) => hours.find((h: any) => h.dayOfWeek === day)?.opens;
  const byTime = new Map<string, string[]>();
  for (const day of days) {
    const time = opens(day);
    if (!time) continue;
    byTime.set(time, [...(byTime.get(time) ?? []), day]);
  }
  const sameTime = byTime.size === 1 ? [...byTime.keys()][0] : undefined;
  const clauses = [...byTime].map(([time, group]) => `from ${formatTime(time, true)} on ${joinList(group.map((day) => `${day}s`))}`);
  return {
    BRUNCH_DAYS: joinList(days, '&'),
    BRUNCH_DAYS_PLURAL: joinList(days.map((day) => `${day}s`)),
    BRUNCH_START: sameTime ? formatTime(sameTime, true) : '',
    BRUNCH_START_TIME: sameTime ? formatTime(sameTime) : '',
    BRUNCH_AVAILABILITY: clauses.length ? `Brunch favorites are on the menu ${joinList(clauses)}.` : '',
  };
}

/** Live Google rating from the build-time fetch (scripts/fetch-google-rating.mjs); '' when unavailable. */
function googleRatingDisplay(): string {
  const { rating, count } = ratingData as { rating: number | null; count: number };
  if (typeof rating !== 'number') return '';
  return count > 0 ? `${rating.toFixed(1)}★ (${count.toLocaleString('en-US')})` : `${rating.toFixed(1)}★`;
}

export function venueTokens(venue: any, env: Record<string, any> = import.meta.env): Record<string, any> {
  if (!venue) return {};
  const address = venue.address ?? {};
  const phone = env.PUBLIC_VENUE_PHONE || venue.phoneFallback;
  return {
    VENUE_NAME: venue.name,
    VENUE_STREET: address.street,
    VENUE_NEIGHBORHOOD: address.neighborhood,
    VENUE_CITY: address.city,
    VENUE_STATE: address.state,
    VENUE_ZIP: address.zip,
    VENUE_CROSS_STREET: address.crossStreet,
    VENUE_CROSS_STREET_SHORT: crossStreetShort(address),
    VENUE_CITY_LINE: `${address.neighborhood}, ${address.city}, ${address.state} ${address.zip}`,
    VENUE_PHONE: formatPhone(phone),
    VENUE_PHONE_TEL: `tel:${phone}`,
    VENUE_MAPS_URL: venue.mapsUrl,
    INSTAGRAM_HANDLE: instagramHandle(venue.social?.instagram),
    HAPPY_HOUR_DAYS: venue.happyHour?.days,
    HAPPY_HOUR_WINDOW: venue.happyHour?.window,
    EVENT_CAPACITY: venue.eventCapacity?.fullVenue ? `${venue.eventCapacity.fullVenue}+ guests` : '',
    EVENT_CAPACITY_SHORT: venue.eventCapacity?.fullVenue ? `${venue.eventCapacity.fullVenue}+` : '',
    GOOGLE_RATING: googleRatingDisplay(),
    ...brunchTokens(venue),
  };
}

function interpolate(value: any, tokens: Record<string, any>): any {
  if (typeof value === 'string') {
    const whole = value.match(/^\{\{([A-Z0-9_]+)\}\}$/);
    if (whole && whole[1] in tokens) return tokens[whole[1]];
    return value.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => (key in tokens ? String(tokens[key] ?? '') : match));
  }
  if (Array.isArray(value)) return value.map((item) => interpolate(item, tokens));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, interpolate(item, tokens)]));
  }
  return value;
}

let tokenCache: Promise<Record<string, any>> | undefined;
async function contentTokens(): Promise<Record<string, any>> {
  tokenCache ??= (async () => {
    const entries: any[] = await getCollection('venueSettings' as any) as any[];
    const venue = (entries.find((item: any) => item.id === 'settings') ?? entries[0])?.data;
    return venueTokens(venue);
  })();
  return tokenCache;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
/** URL slug for a blog category ("North Park Guide" → "north-park-guide"). */
export function blogCategorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** Up to `limit` related posts: same category first, then the rest; newest first; never the current post. */
export function relatedPosts<T extends { id: string; data: { category: string; date: Date } }>(posts: T[], current: T, limit = 3): T[] {
  const others = posts.filter((post) => post.id !== current.id).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const sameCategory = others.filter((post) => post.data.category === current.data.category);
  const rest = others.filter((post) => post.data.category !== current.data.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

// ─── Gift cards ──────────────────────────────────────────────────────────────
/** Central gift-card link: PUBLIC_GIFT_CARD_URL when set, otherwise the internal /contact page. */
export const GIFT_CARD_FALLBACK = '/contact';
export function giftCardLink(env: Record<string, any> = import.meta.env): { href: string; external: boolean } {
  const configured = String(env.PUBLIC_GIFT_CARD_URL ?? '').trim();
  const href = configured || GIFT_CARD_FALLBACK;
  return { href, external: /^https?:\/\//i.test(href) };
}

export async function getSingleton(collection: any, id: string): Promise<any> {
  const entries: any[] = await getCollection(collection as any) as any[];
  const entry: any = entries.find((item: any) => item.id === id) ?? entries[0];
  if (!entry) throw new Error(`Missing content singleton: ${collection}/${id}`);
  // venueSettings is the token source itself and is returned verbatim.
  const data = collection === 'venueSettings' ? entry.data : interpolate(entry.data, await contentTokens());
  if (!Array.isArray(data.blocks)) return data;
  return {
    ...data,
    blocks: data.blocks.map((block: any) => ({
      component: block.discriminant,
      props: block.value,
    })),
  };
}

export async function getOrderedCollection(collection: any): Promise<any[]> {
  const entries = await getCollection(collection);
  const tokens = await contentTokens();
  return entries
    .map((entry: any) => interpolate({ id: entry.data.id ?? entry.id, ...entry.data }, tokens))
    .sort((a: any, b: any) => a.order - b.order);
}

export function resolveContent(value: any, images: Record<string, any>, env: Record<string, any>): any {
  if (typeof value === 'string') {
    if (value.startsWith('__IMAGE__')) return images[value.slice(9)];
    if (value.startsWith('__ENV__')) return env[value.slice(7)];
    if (images[value]) return images[value];
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => resolveContent(item, images, env));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveContent(item, images, env)]));
  return value;
}

export function buildEnv(venue: any, env: Record<string, any>): Record<string, any> {
  return {
    ...env,
    PUBLIC_RESERVATIONS_URL: venue?.reservationsUrl || env.PUBLIC_RESERVATIONS_URL,
    PUBLIC_RESERVATIONS_URL_TOAST: venue?.reservationsUrlSecondary || env.PUBLIC_RESERVATIONS_URL_TOAST,
    PUBLIC_ORDER_URL: venue?.orderUrl || env.PUBLIC_ORDER_URL,
    PUBLIC_SOCIAL_INSTAGRAM_URL: venue?.social?.instagram,
  };
}

// ─── Menu data ───────────────────────────────────────────────────────────────
// menuStructure (menuIndexPage singleton) + item collections, shared by the
// MenuShowcase card grids and the Menu JSON-LD builder so both always agree.
export async function getMenuData(): Promise<any> {
  const [cocktails, oxtailKingdom, creoleSoulBangers, gulf, fryHouse, brunch] = await Promise.all([
    getOrderedCollection('cocktailsMenu'),
    getOrderedCollection('kitchenOxtailKingdom'),
    getOrderedCollection('kitchenCreoleSoulBangers'),
    getOrderedCollection('kitchenGulf'),
    getOrderedCollection('kitchenFryHouse'),
    getOrderedCollection('brunchMenuItems'),
  ]);
  const menuPage = await getSingleton('menuIndexPage', 'page');
  const itemCollections: Record<string, any[]> = { cocktails, oxtailKingdom, creoleSoulBangers, gulf, fryHouse, brunch };
  const menuSections = Array.isArray(menuPage.menuStructure?.sections) ? menuPage.menuStructure.sections : [];
  return {
    ...(menuPage.menuStructure ?? {}),
    sections: menuSections.map((section: any) => ({
      ...section,
      categories: (Array.isArray(section.categories) ? section.categories : []).map((category: any) => ({
        ...category,
        items: itemCollections[category.collection] ?? [],
      })),
    })),
  };
}
