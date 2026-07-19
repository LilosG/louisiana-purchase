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
  menuBrunchPage: singleton('menuBrunchPage'),
  privateEventsIndexPage: singleton('privateEventsIndexPage'),
  privateEventsSlugTemplate: singleton('privateEventsSlugTemplate'),
  theSpacePage: singleton('theSpacePage'),
  cocktailsMenu: repeatable('cocktailsMenu'),
  kitchenRawFire: repeatable('kitchenRawFire'),
  kitchenPlates: repeatable('kitchenPlates'),
  brunchMenuItems: repeatable('brunchMenuItems'),
  privateEventTypes: repeatable('privateEventTypes'),
  eventCategoryCards: repeatable('eventCategoryCards'),
  privateEventsProcessSteps: repeatable('privateEventsProcessSteps'),
  brunchFaqs: repeatable('brunchFaqs'),
  happyHourFaqs: repeatable('happyHourFaqs'),
  privateEventsFaqs: repeatable('privateEventsFaqs'),
  spaceGalleryCards: repeatable('spaceGalleryCards'),
};
