// src/data/venue.ts
// Louisiana Purchase — Single Source of Truth for Venue Identity
//
// Every hardcoded address, phone, hours, social, and capacity fact across
// the site must originate here. Do not re-type any of these values in a
// component or page — import the constant instead.

import type { VenueHours } from '../types/seo';

export const VENUE_NAME = 'Louisiana Purchase';

// ─── Domain ───────────────────────────────────────────────────────────────
export const CANONICAL_DOMAIN = 'https://louisianapurchasesd.com';

// ─── Address ──────────────────────────────────────────────────────────────
export const VENUE_ADDRESS = {
  street:       '2305 University Ave',
  neighborhood: 'North Park',
  city:         'San Diego',
  state:        'CA',
  zip:          '92104',
  country:      'US',
  crossStreet:  'University Ave & 23rd St',
};

export const VENUE_ADDRESS_SHORT = `${VENUE_ADDRESS.street}, ${VENUE_ADDRESS.city}, ${VENUE_ADDRESS.state} ${VENUE_ADDRESS.zip}`;
export const VENUE_ADDRESS_FULL  = `${VENUE_ADDRESS.street}, ${VENUE_ADDRESS.neighborhood}, ${VENUE_ADDRESS.city}, ${VENUE_ADDRESS.state} ${VENUE_ADDRESS.zip}`;

export const VENUE_MAPS_URL = 'https://maps.google.com/?q=2305+University+Ave+San+Diego+CA+92104';

// ─── Geo ──────────────────────────────────────────────────────────────────
// North Park, San Diego — precise coordinates for local search ranking
export const VENUE_GEO = {
  latitude:  32.7474,
  longitude: -117.1293,
};

// ─── Contact Fallbacks ────────────────────────────────────────────────────
// Real values are supplied via PUBLIC_VENUE_PHONE / PUBLIC_VENUE_EMAIL env
// vars at build time. These are placeholder fallbacks only, matching the
// canonical domain above.
export const VENUE_PHONE_FALLBACK = '+18586836828';
export const VENUE_EMAIL_FALLBACK = 'info@louisianapurchasesd.com';

// ─── Social ───────────────────────────────────────────────────────────────
export const VENUE_SOCIAL = {
  instagram: 'https://www.instagram.com/louisianapurchasebar',
  facebook:  'https://www.facebook.com/louisianapurchasebar',
};

// ─── Hours (schema-shaped, 24h) ─────────────────────────────────────────────
export const REGULAR_HOURS: VenueHours[] = [
  { dayOfWeek: 'Monday',    opens: '15:00', closes: '21:00' },
  { dayOfWeek: 'Tuesday',   opens: '15:00', closes: '21:00' },
  { dayOfWeek: 'Wednesday', opens: '15:00', closes: '21:00' },
  { dayOfWeek: 'Thursday',  opens: '15:00', closes: '21:00' },
  { dayOfWeek: 'Friday',    opens: '15:00', closes: '24:00' },
  { dayOfWeek: 'Saturday',  opens: '12:00', closes: '22:00' },
  { dayOfWeek: 'Sunday',    opens: '12:00', closes: '20:00' },
];

// Grouped 12h display projection of REGULAR_HOURS, for UI rendering.
// Must be kept in sync with REGULAR_HOURS by hand if hours change.
export const DISPLAY_HOURS: { label: string; value: string }[] = [
  { label: 'Monday – Thursday', value: '3 PM – 9 PM' },
  { label: 'Friday',            value: '3 PM – 12 AM' },
  { label: 'Saturday',          value: '12 PM – 10 PM' },
  { label: 'Sunday',            value: '12 PM – 8 PM' },
];

export const HAPPY_HOUR = {
  label:  'Happy Hour',
  days:   'Monday – Friday',
  window: '3 PM – 5 PM',
  opens:  '15:00',
  closes: '17:00',
};

export const BRUNCH_HOURS = {
  label:  'Brunch',
  days:   'Saturday & Sunday',
  window: '12 PM – 3 PM',
  opens:  '12:00',
  closes: '15:00',
};

// ─── Reputation & Capacity ──────────────────────────────────────────────────
// ─── Default Social / Schema Image ─────────────────────────────────────────
// Lives in public/ (not src/assets/) because OG/Twitter meta tags and the
// Restaurant JSON-LD image field need a plain, unprocessed static URL —
// astro:assets imports can't be used inside <meta content="..."> attributes.
export const VENUE_DEFAULT_IMAGE = '/og-image.jpg';

export const GOOGLE_RATING = '4.6';

export const EVENT_CAPACITY = {
  fullVenue:   80,
  privateRoom: 40,
  patio:       50,
};
