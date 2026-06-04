// src/data/private-events.ts
// Louisiana Purchase — Private Event SEO Slug Registry
// This file drives programmatic route generation for /private-events/[slug].astro
// Each entry targets a high-intent, unbranded local search query.

import type { PrivateEventSlug } from '../types/seo';

export const PRIVATE_EVENT_SLUGS: PrivateEventSlug[] = [
  {
    slug:        'north-park-private-dining-room',
    title:       'Private Dining Room in North Park',
    metaTitle:   'Private Dining Room Rental in North Park San Diego | Louisiana Purchase',
    description: 'Reserve Louisiana Purchase\'s intimate velvet-accented private dining room for corporate dinners, milestone celebrations, and executive events in North Park, San Diego.',
    keywords:    ['private dining room north park', 'private dining san diego', 'restaurant buyout north park'],
    eventType:   'Private Dining',
    capacity:    '20–40 guests',
    priceGuide:  'F&B minimum varies by date',
  },
  {
    slug:        'san-diego-corporate-dinner-venue',
    title:       'Corporate Dinner Venue San Diego',
    metaTitle:   'Corporate Dinner Venues in San Diego | Louisiana Purchase North Park',
    description: 'Host your next corporate dinner at Louisiana Purchase — an upscale Creole dining venue in North Park, San Diego. Custom menus, curated cocktail pairings, and dedicated event staff.',
    keywords:    ['corporate dinner san diego', 'corporate event venue north park', 'business dinner san diego'],
    eventType:   'Corporate Dinner',
    capacity:    '20–80 guests',
    priceGuide:  'Contact for corporate pricing',
  },
  {
    slug:        'north-park-birthday-dinner-venue',
    title:       'Birthday Dinner Venue in North Park',
    metaTitle:   'Birthday Dinner Restaurants North Park San Diego | Louisiana Purchase',
    description: 'Celebrate your birthday in style at Louisiana Purchase. Private tables, custom cocktail menus, and an opulent Creole dining atmosphere in North Park, San Diego.',
    keywords:    ['birthday dinner north park', 'special occasion restaurant san diego', 'birthday celebration venue san diego'],
    eventType:   'Birthday Celebration',
    capacity:    '2–80 guests',
    priceGuide:  'No minimum for standard reservations',
  },
  {
    slug:        'san-diego-jazz-brunch-private-event',
    title:       'Jazz Brunch Private Event San Diego',
    metaTitle:   'Private Jazz Brunch Events in San Diego | Louisiana Purchase',
    description: 'Book a private jazz brunch experience at Louisiana Purchase in North Park. Live jazz, bottomless Creole brunch, and craft cocktails — exclusively yours.',
    keywords:    ['jazz brunch san diego', 'private brunch event san diego', 'jazz brunch north park'],
    eventType:   'Jazz Brunch Event',
    capacity:    '20–60 guests',
    priceGuide:  'Weekend brunch F&B minimum applies',
  },
  {
    slug:        'north-park-rooftop-buyout',
    title:       'Patio Buyout in North Park San Diego',
    metaTitle:   'Patio & Outdoor Venue Buyout North Park San Diego | Louisiana Purchase',
    description: 'Reserve Louisiana Purchase\'s hidden lush patio for an exclusive outdoor event. Perfect for cocktail receptions, rehearsal dinners, and intimate corporate gatherings in North Park, San Diego.',
    keywords:    ['outdoor venue north park', 'patio buyout san diego', 'cocktail reception venue san diego'],
    eventType:   'Patio Buyout',
    capacity:    '30–80 guests',
    priceGuide:  'F&B minimum + venue fee',
  },
];
