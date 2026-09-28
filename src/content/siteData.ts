import { getCollection } from 'astro:content';

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
