import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const singleton = (name: string) => defineCollection({
  loader: glob({ pattern: '*.json', base: `./src/content/${name}` }),
  schema: z.record(z.string(), z.any()),
});

const repeatable = (name: string) => defineCollection({
  loader: glob({ pattern: '*.json', base: `./src/content/${name}` }),
  schema: z.record(z.string(), z.any()),
});

export const BLOG_CATEGORIES = [
  'Events',
  'Private Events',
  'North Park Guide',
  'Cocktails',
  'Brunch',
  'Dinner',
] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(BLOG_CATEGORIES),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cta: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      label: z.string(),
      href: z.string(),
    }).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = {
  venueSettings: singleton('venueSettings'),
  eventsConfig: singleton('eventsConfig'),
  navigation: singleton('navigation'),
  footer: singleton('footer'),
  localSeo: singleton('localSeo'),
  home: singleton('home'),
  about: singleton('about'),
  brunchPage: singleton('brunchPage'),
  contactPage: singleton('contactPage'),
  eventsIndexPage: singleton('eventsIndexPage'),
  happyHourPage: singleton('happyHourPage'),
  menuIndexPage: singleton('menuIndexPage'),
  menuDinnerPage: singleton('menuDinnerPage'),
  menuCocktailsPage: singleton('menuCocktailsPage'),
  privateEventsIndexPage: singleton('privateEventsIndexPage'),
  privateEventsSlugTemplate: singleton('privateEventsSlugTemplate'),
  theSpacePage: singleton('theSpacePage'),
  giftCardsPage: defineCollection({
    loader: glob({ pattern: '*.json', base: './src/content/giftCardsPage' }),
    schema: z.object({
      seo: z.object({ title: z.string(), description: z.string(), ogImage: z.string() }),
      hero: z.object({ eyebrow: z.string(), title: z.string(), titleItalic: z.string(), subtitle: z.string(), image: z.string(), imageAlt: z.string() }),
      intro: z.object({ eyebrow: z.string(), title: z.string(), titleItalic: z.string(), body: z.array(z.string()), image: z.string(), imageAlt: z.string(), ctas: z.array(z.object({ label: z.string(), href: z.string(), variant: z.enum(['gold', 'outline', 'text']) })) }),
      stepsHeader: z.object({ eyebrow: z.string(), title: z.string(), subtitle: z.string() }),
      steps: z.array(z.object({ title: z.string(), body: z.string() })),
      guidesHeader: z.object({ eyebrow: z.string(), title: z.string(), subtitle: z.string() }),
      guides: z.array(z.object({ title: z.string(), body: z.string(), href: z.string(), linkLabel: z.string() })),
      cta: z.object({ eyebrow: z.string(), title: z.string(), subtitle: z.string() }),
      purchaseLabel: z.string(), purchaseNote: z.string(), balanceLabel: z.string(), contactLabel: z.string(),
    }),
  }),
  cocktailsMenu: repeatable('cocktailsMenu'),
  kitchenOxtailKingdom: repeatable('kitchenOxtailKingdom'),
  kitchenCreoleSoulBangers: repeatable('kitchenCreoleSoulBangers'),
  kitchenGulf: repeatable('kitchenGulf'),
  kitchenFryHouse: repeatable('kitchenFryHouse'),
  brunchMenuItems: repeatable('brunchMenuItems'),
  privateEventTypes: repeatable('privateEventTypes'),
  eventCategoryCards: repeatable('eventCategoryCards'),
  privateEventsProcessSteps: repeatable('privateEventsProcessSteps'),
  brunchFaqs: repeatable('brunchFaqs'),
  happyHourFaqs: repeatable('happyHourFaqs'),
  privateEventsFaqs: repeatable('privateEventsFaqs'),
  spaceGalleryCards: repeatable('spaceGalleryCards'),
  blog,
};
