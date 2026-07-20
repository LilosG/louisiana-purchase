import { createElement } from 'react';
import { collection, config, fields, singleton } from '@keystatic/core';

import venueSettingsData from './src/content/venueSettings/settings.json';
import eventsConfigData from './src/content/eventsConfig/config.json';
import navigationData from './src/content/navigation/navigation.json';
import footerData from './src/content/footer/footer.json';
import localSeoData from './src/content/localSeo/localSeo.json';
import homeData from './src/content/home/home.json';
import aboutData from './src/content/about/about.json';
import brunchPageData from './src/content/brunchPage/page.json';
import contactPageData from './src/content/contactPage/page.json';
import eventsIndexPageData from './src/content/eventsIndexPage/page.json';
import happyHourPageData from './src/content/happyHourPage/page.json';
import menuIndexPageData from './src/content/menuIndexPage/page.json';
import menuDinnerPageData from './src/content/menuDinnerPage/page.json';
import menuCocktailsPageData from './src/content/menuCocktailsPage/page.json';
import menuBrunchPageData from './src/content/menuBrunchPage/page.json';
import privateEventsIndexPageData from './src/content/privateEventsIndexPage/page.json';
import privateEventsSlugTemplateData from './src/content/privateEventsSlugTemplate/template.json';
import theSpacePageData from './src/content/theSpacePage/page.json';

const humanize = (value: string) => value
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/[-_]/g, ' ')
  .replace(/\b\w/g, (character) => character.toUpperCase());

const fieldLabels: Record<string, string> = {
  seo: 'Search Engine Settings', hero: 'Hero Section', title: 'Title', titleItalic: 'Italicized Title Text',
  description: 'Description', schemaDescription: 'Search Listing Description', schemaName: 'Search Listing Name',
  schemaNamePrefix: 'Private Event Search Name Prefix', canonical: 'Preferred Page Address', canonicalBase: 'Private Event Page Address',
  breadcrumbs: 'Page Trail', name: 'Name', url: 'Website Address', href: 'Link Destination',
  image: 'Image', ogImage: 'Social Sharing Image', defaultSocialImage: 'Default Social Sharing Image', logo: 'Logo',
  imageAlt: 'Image Description for Accessibility', eyebrow: 'Small Section Label', subtitle: 'Supporting Text',
  body: 'Body Text', q: 'Question', a: 'Answer', order: 'Display Order', id: 'Website Reference',
  component: 'Page Section Layout', props: 'Section Content', blocks: 'Page Sections', label: 'Label', value: 'Displayed Value',
  ctas: 'Calls to Action', stats: 'Venue Statistics', facts: 'Venue Facts', sections: 'Menu Sections', categories: 'Menu Categories',
  items: 'Items', available: 'Available', featured: 'Featured', dietary: 'Dietary Notes', tags: 'Tags', price: 'Price',
  priceDisplay: 'Displayed Price', multiline: 'Long Text', faqs: 'Frequently Asked Questions', amenities: 'Amenities',
  cuisines: 'Cuisines', keywords: 'Search Keywords', opens: 'Opening Time', closes: 'Closing Time', dayOfWeek: 'Day of Week',
  external: 'Open in a New Tab', reverse: 'Place Image on the Opposite Side', dark: 'Use Dark Background', slug: 'Page URL',
  acceptsReservations: 'Accepts Reservations', address: 'Address', addressLabel: 'Address Link Text', ariaLabels: 'Accessibility Labels',
  ariaLabelPrefix: 'Event Link Introduction', ariaLabelSuffix: 'Event Link Ending', author: 'Business Name for Search Results',
  benefits: 'Private Brunch Benefits', bodyMiddle: 'Location Text — Middle', bodyPrefix: 'Location Text — Beginning', bodySuffix: 'Location Text — Ending',
  bottom: 'Bottom Line', bottomCuisine: 'Cuisine Line', brunchHours: 'Brunch Hours',
  capacity: 'Capacity Label', cards: 'Cards', city: 'City', cocktails: 'Cocktails Menu Link', collection: 'Menu Item Source',
  cols: 'Number of Columns', columnHeadings: 'Footer Column Headings', contact: 'Contact Link', contactMethods: 'Contact Options',
  copyrightVenue: 'Copyright Business Name', country: 'Country', creditLabel: 'Website Credit Text', creditUrl: 'Website Credit Link',
  crossStreet: 'Cross Street', cta: 'Call to Action', ctaLabel: 'Button Text', ctaLabels: 'Button Labels',
  currency: 'Accepted Currency', days: 'Days', desktopLinks: 'Desktop Navigation Links',
  dinner: 'Dinner Menu Link', directionsLabel: 'Directions Link Text', displayHours: 'Displayed Hours', divided: 'Show Divider Lines',
  domain: 'Website Domain', emailFallback: 'Contact Email Address', eventCapacity: 'Private Event Capacities',
  eventCardLabels: 'Private Event Card Labels', experience: 'Private Event Experience Section', experienceImage: 'Experience Image',
  explore: 'Explore Column Heading', exploreLinks: 'Footer Explore Links', facebook: 'Facebook Link', facebookLabel: 'Facebook Link Text',
  faqHeader: 'FAQ Section Heading', footer: 'Footer Label', form: 'Inquiry Form Section', fullVenue: 'Full Venue Capacity',
  geo: 'Map Location', geoPlacename: 'City Name for Local Search', geoRegion: 'State and Country for Local Search',
  giftCards: 'Gift Cards Link', googleRating: 'Google Rating', happyHour: 'Happy Hour Details', header: 'Header Label',
  headingId: 'Section Heading Reference', headlineId: 'Hero Heading Reference', heroCtas: 'Hero Buttons', home: 'Home Link',
  homeAriaLabel: 'Home Link Description', hours: 'Hours Column Heading', hoursEyebrow: 'Hours Section Label',
  includedHeader: 'Included Items Section Heading', includedItems: 'Included Items', instagram: 'Instagram Link', instagramLabel: 'Instagram Link Text',
  lastUpdated: 'Menu Last Updated Date', latitude: 'Latitude', learnMore: 'Learn More Link Text', linkLabel: 'Link Text',
  listMarker: 'List Marker', location: 'Location Section', longitude: 'Longitude', mainNavigation: 'Main Navigation Description',
  mapsUrl: 'Google Maps Link', menuHeader: 'Menu Heading', menuLink: 'Menu Button', menuLinks: 'Menu Links',
  menuStructure: 'Menu Page Sections', meta: 'Supporting Detail', mobileExtraLinks: 'Additional Mobile Menu Links',
  mobileNavigation: 'Mobile Navigation Description', navigationMenu: 'Navigation Menu Description',
  neighborhood: 'Neighborhood', networkLabel: 'Restaurant Group Text', ogType: 'Social Sharing Page Type',
  openMenu: 'Open Menu Button Description', orderOnline: 'Order Online Button Text', patio: 'Patio Capacity',
  paymentAccepted: 'Accepted Payment Methods', phoneFallback: 'Phone Number', position: 'Page Trail Order',
  priceRange: 'Price Range', pricing: 'Pricing Label', privateBrunch: 'Private Brunch Section',
  privateEventHighlights: 'Private Event Highlights', privateEvents: 'Private Events Link',
  privateEventsFormAnchor: 'Private Event Form Location', privateEventsIframeUrl: 'Private Event Form Web Address',
  privateRoom: 'Private Room Capacity', regularHours: 'Regular Hours', reservationLinks: 'Reservation Links',
  reservations: 'Reservations Column Heading', reservationsLabel: 'Reservations Link Text', reserve: 'Reserve Button Text',
  reserveNow: 'Reserve Now Link', reserveTable: 'Reserve a Table Link', social: 'Social Section', socialLabels: 'Social Media Labels',
  state: 'State', street: 'Street Address', tagline: 'Tagline', titleSuffix: 'Search Result Title Ending', top: 'Top Line',
  type: 'Business Type', updates: 'Event Updates Section', variant: 'Button Style', version: 'Menu Version',
  window: 'Displayed Time Range', wordmark: 'Wordmark Text', zip: 'ZIP Code',
};

const arrayItemLabels: Record<string, string> = {
  amenities: 'Amenity', benefits: 'Benefit', blocks: 'Page Section', body: 'Paragraph', breadcrumbs: 'Page Trail Item',
  cards: 'Card', categories: 'Menu Category', contactMethods: 'Contact Option', ctas: 'Button', cuisines: 'Cuisine',
  days: 'Day', desktopLinks: 'Navigation Link', displayHours: 'Hours Entry', exploreLinks: 'Footer Link', facts: 'Venue Fact',
  faqs: 'Frequently Asked Question', heroCtas: 'Hero Button', includedItems: 'Included Item', privateEventHighlights: 'Highlight',
  regularHours: 'Hours Entry', sections: 'Menu Section', stats: 'Statistic',
};

const multilineKeys = new Set(['description', 'schemaDescription', 'subtitle', 'body', 'a', 'tagline']);
const imageFieldPaths = new Set<string>();
const optionalGeneratedFieldPaths = new Set<string>();

/**
 * The only image-field constructor in this config. The namespace is required,
 * has no default, and is registered before use so duplicate storage paths fail
 * immediately while the config is loading.
 */
function requiredImageField(namespace: string, label: string, description: string) {
  if (!namespace) throw new Error('Every image field requires an explicit namespace.');
  const directory = `src/assets/images/cms/${namespace}`;
  const publicPath = `cms/${namespace}/`;
  const collisionKey = `${directory}|${publicPath}`;
  if (imageFieldPaths.has(collisionKey)) throw new Error(`Image field storage collision: ${collisionKey}`);
  imageFieldPaths.add(collisionKey);
  return fields.image({
    label,
    description,
    directory,
    publicPath,
    validation: { isRequired: true },
  });
}

function optionalImageField(namespace: string, label: string, description: string) {
  if (!namespace) throw new Error('Every image field requires an explicit namespace.');
  const directory = `src/assets/images/cms/${namespace}`;
  const publicPath = `cms/${namespace}/`;
  const collisionKey = `${directory}|${publicPath}`;
  if (imageFieldPaths.has(collisionKey)) throw new Error(`Image field storage collision: ${collisionKey}`);
  imageFieldPaths.add(collisionKey);
  return fields.image({
    label,
    description,
    directory,
    publicPath,
  });
}

function labelFor(key: string, path: string[]) {
  const fullPath = [...path, key].join('.');
  if (key === 'headlineId') return '⚠️ Advanced — Hero Heading Reference';
  if (key === 'headingId') return '⚠️ Advanced — Section Heading Reference';
  if (fullPath === 'menuStructure.sections.id') return '⚠️ Advanced — Menu Section Reference';
  if (fullPath === 'menuStructure.sections.categories.id') return '⚠️ Advanced — Menu Category Reference';
  if (fullPath === 'menuStructure.sections.categories.collection') return '⚠️ Advanced — Menu Item Source';
  if (key === 'id') return '⚠️ Advanced — Website Reference';
  if (key === 'component') return '⚠️ Advanced — Page Section Layout';
  if (key === 'variant') return '⚠️ Advanced — Button Style';
  if (fullPath.endsWith('seo.title')) return 'Search Result Title';
  if (fullPath.endsWith('seo.description')) return 'Search Result Description';
  if (fullPath.endsWith('hero.title')) return 'Main Page Heading';
  return fieldLabels[key] ?? humanize(key);
}

function descriptionFor(key: string, path: string[], value: unknown, namespace: string) {
  const fullPath = [...path, key].join('.');
  const label = labelFor(key, path).toLowerCase();
  if (namespace === 'privateEventsSlugTemplate' && path.length === 0) {
    return `Shared ${label} used across every private event page. Each event's title, description, capacity, and pricing are managed in Private Event Types.`;
  }
  if (key === 'headlineId') return 'Connects the hero heading to accessibility features. Leave unchanged unless your website team asks you to edit it.';
  if (key === 'headingId') return 'Connects this heading to section links and accessibility features. Leave unchanged unless your website team asks you to edit it.';
  if (fullPath === 'menuStructure.sections.id') return 'Connects this section to the correct menu content. Leave unchanged unless your website team asks you to edit it.';
  if (fullPath === 'menuStructure.sections.categories.id') return 'Connects this category to the correct menu content. Leave unchanged unless your website team asks you to edit it.';
  if (fullPath === 'menuStructure.sections.categories.collection') return 'Chooses which menu items appear in this category. Leave unchanged unless your website team asks you to edit it.';
  if (key === 'id') return 'Connects this content to the correct place on the website. Leave unchanged unless your website team asks you to edit it.';
  if (key === 'component') return 'Chooses the layout used for this page section. Leave unchanged unless your website team asks you to edit it.';
  if (key === 'variant') return 'Chooses the appearance of this button. Leave unchanged unless your website team asks you to edit it.';
  if (key === 'url' && typeof value === 'string' && ['reservations', 'privateEvents', 'order'].includes(value)) return 'Chooses the saved destination for this button. Leave unchanged unless your website team asks you to edit it.';
  if (fullPath.endsWith('seo.title')) return 'Title shown in search results. Keep it concise and specific.';
  if (fullPath.endsWith('seo.description')) return 'Summary shown in search results. Use one clear sentence about this page.';
  if (key === 'imageAlt') return 'Describe what is visible in the image for screen readers and search engines.';
  if (key === 'order') return 'Controls display order. Lower numbers appear first.';
  if (key === 'href') return 'Enter an internal path such as /contact or a complete external web address.';
  if (key.toLowerCase().includes('url')) return `Enter the complete web address used for the ${label}.`;
  if (Array.isArray(value)) return `Add, edit, remove, or reorder the ${label}.`;
  if (typeof value === 'object' && value !== null) return `Edit the ${label} used on the website.`;
  if (typeof value === 'boolean') return `Controls whether the ${label} setting is enabled.`;
  if (typeof value === 'number') return `Enter the number used for the ${label}.`;
  return `Edit the ${label} shown on the website.`;
}

function isImageValue(key: string, value: unknown) {
  return typeof value === 'string' && key !== 'imageAlt' &&
    (key === 'image' || key === 'ogImage' || key === 'logo' || key === 'defaultSocialImage' || key.endsWith('Image'));
}

function mergeObjects(values: Record<string, unknown>[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const value of values) {
    for (const [key, child] of Object.entries(value)) {
      const current = result[key];
      if (Array.isArray(current) && Array.isArray(child)) {
        result[key] = [...current, ...child];
      } else if (current && child && typeof current === 'object' && typeof child === 'object' && !Array.isArray(current) && !Array.isArray(child)) {
        result[key] = mergeObjects([current as Record<string, unknown>, child as Record<string, unknown>]);
      } else if (current === undefined) {
        result[key] = child;
      }
    }
  }
  return result;
}

function itemLabel(props: any, fallback: string) {
  return props?.fields?.title?.value || props?.fields?.name?.value || props?.fields?.q?.value ||
    props?.fields?.label?.value || props?.fields?.component?.value || props?.value || fallback;
}

function schemaFromSample(sample: Record<string, unknown>, namespace: string, path: string[] = []): Record<string, any> {
  return Object.fromEntries(Object.entries(sample).map(([key, value]) => [key, fieldFromValue(key, value, namespace, path)]));
}

function markOptionalGeneratedFields(samples: Record<string, unknown>[], namespace: string, path: string[]) {
  const keys = new Set(samples.flatMap((sample) => Object.keys(sample)));
  for (const key of keys) {
    const values = samples.map((sample) => sample[key]);
    const nextPath = [...path, key];
    if (values.some((value) => value === undefined || value === null || value === '')) {
      optionalGeneratedFieldPaths.add([namespace, ...nextPath].join('/'));
    }

    const objects = values.filter(
      (value): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value),
    );
    if (objects.length) markOptionalGeneratedFields(objects, namespace, nextPath);

    const arrayItems = values
      .filter(Array.isArray)
      .flat()
      .filter((value): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value));
    if (arrayItems.length) markOptionalGeneratedFields(arrayItems, namespace, nextPath);
  }
}

type PageBlockSample = { component: string; props: Record<string, unknown> };

function pageBlockFromStoredValue(value: Record<string, unknown>): PageBlockSample | undefined {
  const component = value.component ?? value.discriminant;
  const props = value.props ?? value.value;
  if (typeof component !== 'string' || !props || typeof props !== 'object' || Array.isArray(props)) return undefined;
  return { component, props: props as Record<string, unknown> };
}

function pageBlocksField(blocks: PageBlockSample[], namespace: string, path: string[], label: string, description: string) {
  const propsByComponent = new Map<string, Record<string, unknown>[]>();
  for (const block of blocks) {
    const samples = propsByComponent.get(block.component) ?? [];
    samples.push(block.props);
    propsByComponent.set(block.component, samples);
  }

  return fields.blocks(Object.fromEntries(
    [...propsByComponent].map(([component, samples]) => {
      const componentPath = [...path, component];
      markOptionalGeneratedFields(samples, namespace, componentPath);
      return [component, {
        label: humanize(component),
        schema: fields.object(schemaFromSample(mergeObjects(samples), namespace, componentPath), {
          label: `${humanize(component)} Content`,
          description: `Edit the fields used only by the ${humanize(component)} page section.`,
        }),
      }];
    }),
  ), { label, description });
}

function fieldFromValue(key: string, value: unknown, namespace: string, path: string[]): any {
  const label = key === 'url' && typeof value === 'string' && ['reservations', 'privateEvents', 'order'].includes(value)
    ? '⚠️ Advanced — Button Destination Setting'
    : labelFor(key, path);
  const description = descriptionFor(key, path, value, namespace);
  const nextPath = [...path, key];

  if (isImageValue(key, value)) {
    const fieldNamespace = [namespace, ...nextPath].join('/');
    return optionalGeneratedFieldPaths.has(fieldNamespace)
      ? optionalImageField(fieldNamespace, label, description)
      : requiredImageField(fieldNamespace, label, description);
  }
  if (Array.isArray(value)) {
    const objects = value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item));
    const pageBlocks = key === 'blocks' ? objects.map(pageBlockFromStoredValue) : [];
    if (pageBlocks.length === value.length && pageBlocks.every((block): block is PageBlockSample => Boolean(block))) {
      return pageBlocksField(pageBlocks, namespace, nextPath, label, description);
    }
    const sampleItem = objects.length ? mergeObjects(objects) : value[0];
    const singular = arrayItemLabels[key] ?? fieldLabels[key.replace(/s$/, '')] ?? humanize(key.replace(/s$/, ''));
    const element = sampleItem && typeof sampleItem === 'object'
      ? fields.object(schemaFromSample(sampleItem as Record<string, unknown>, namespace, nextPath), {
          label: singular,
          description: `Edit one item in the ${label.toLowerCase()} list.`,
        })
      : typeof sampleItem === 'number'
        ? fields.number({ label: singular, description: `Enter one number in the ${label.toLowerCase()} list.` })
        : fields.text({ label: singular, description: `Enter one item in the ${label.toLowerCase()} list.` });
    return fields.array(element, {
      label,
      description,
      itemLabel: (props) => itemLabel(props, singular),
    });
  }
  if (value && typeof value === 'object') {
    return fields.object(schemaFromSample(value as Record<string, unknown>, namespace, nextPath), { label, description });
  }
  if (typeof value === 'number') return fields.number({ label, description });
  if (typeof value === 'boolean') return fields.checkbox({ label, description, defaultValue: value });
  const isOptionalText = optionalGeneratedFieldPaths.has([namespace, ...nextPath].join('/')) ||
    (namespace === 'theSpacePage' && nextPath.join('.') === 'location.bodyMiddle');
  return fields.text({
    label,
    description,
    multiline: multilineKeys.has(key),
    ...(isOptionalText ? {} : { validation: { isRequired: true } }),
  });
}

const jsonSingleton = (label: string, directory: string, filename: string, sample: Record<string, unknown>) => singleton({
  label,
  path: `src/content/${directory}/${filename}`,
  format: { data: 'json' },
  schema: schemaFromSample(sample, directory),
});
const requiredText = (label: string, description: string, multiline = false) => fields.text({
  label, description, multiline, validation: { isRequired: true },
});
const optionalText = (label: string, description: string, multiline = false) => fields.text({
  label, description, multiline,
});
const orderField = fields.number({ label: 'Display Order', description: 'Controls display order. Lower numbers appear first.' });
const idField = fields.text({ label: '⚠️ Advanced — Website Reference', description: 'Connects this content to the correct place on the website. Leave unchanged unless your website team asks you to edit it.', validation: { isRequired: true } });
const tagsField = fields.array(requiredText('Tag', 'Enter one short search or display tag.'), {
  label: 'Tags', description: 'Add, edit, remove, or reorder the tags.', itemLabel: (props) => props.value || 'Tag',
});

function menuCollection(label: string, directory: string) {
  return collection({
    label,
    path: `src/content/${directory}/*`,
    slugField: 'name',
    format: { data: 'json' },
    columns: ['name', 'order', 'available', 'featured'],
    schema: {
      name: fields.slug({ name: { label: 'Dish or Drink Name', description: 'Name shown on the menu.', validation: { isRequired: true } } }),
      id: idField,
      description: requiredText('Description', 'Describe the dish or drink as it appears on the menu.', true),
      image: optionalImageField(`${directory}/image`, 'Item Photo', 'Optional photo shown with this menu item.'),
      imageAlt: requiredText('Image Description for Accessibility', 'Describe what is visible in the photo for screen readers and search engines.'),
      order: orderField,
      available: fields.checkbox({ label: 'Available', description: 'Turn on to make this item available for menu displays.', defaultValue: true }),
      featured: fields.checkbox({ label: 'Featured', description: 'Turn on to feature this item in highlighted menu areas.', defaultValue: false }),
      dietary: fields.array(requiredText('Dietary Note', 'Enter one dietary note or abbreviation.'), { label: 'Dietary Notes', description: 'Add dietary notes for this item.', itemLabel: (props) => props.value || 'Dietary Note' }),
      tags: tagsField,
      price: fields.number({ label: 'Price', description: 'Optional price used in search results and other menu listings.' }),
      priceDisplay: optionalText('Displayed Price', 'Optional formatted price shown to guests, such as $18.'),
    },
  });
}

function faqCollection(label: string, directory: string) {
  return collection({
    label, path: `src/content/${directory}/*`, slugField: 'q', format: { data: 'json' }, columns: ['q', 'order'],
    schema: {
      q: fields.slug({ name: { label: 'Question', description: 'Question shown in the FAQ list.', validation: { isRequired: true } } }),
      id: idField,
      a: requiredText('Answer', 'Answer displayed with this question.', true),
      order: orderField,
    },
  });
}

function cardCollection(label: string, directory: string) {
  return collection({
    label, path: `src/content/${directory}/*`, slugField: 'title', format: { data: 'json' }, columns: ['title', 'order'],
    schema: {
      title: fields.slug({ name: { label: 'Card Title', description: 'Title displayed on this card.', validation: { isRequired: true } } }),
      id: idField,
      eyebrow: requiredText('Small Section Label', 'Short label displayed above the card title.'),
      body: requiredText('Body Text', 'Supporting text displayed on the card.', true),
      image: requiredImageField(`${directory}/image`, 'Card Photo', 'Required photo displayed on this card.'),
      imageAlt: requiredText('Image Description for Accessibility', 'Describe what is visible in the photo for screen readers and search engines.'),
      order: orderField,
    },
  });
}

export default config({
  storage: { kind: 'cloud' },
  cloud: { project: 'gph-websites/louisiana-purchase' },
  ui: {
    brand: {
      name: 'Louisiana Purchase Website CMS',
      mark: ({ colorScheme }) => createElement('svg', { viewBox: '0 0 32 32', role: 'img', 'aria-label': 'Louisiana Purchase', width: 32, height: 32 },
        createElement('rect', { width: 32, height: 32, rx: 8, fill: colorScheme === 'dark' ? '#d6aa62' : '#24140f' }),
        createElement('text', { x: 16, y: 21, textAnchor: 'middle', fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, fill: colorScheme === 'dark' ? '#24140f' : '#d6aa62' }, 'LP')),
    },
    navigation: {
      Website: ['home', 'about', 'contactPage'],
      Menus: ['menuIndexPage', 'menuDinnerPage', 'menuCocktailsPage', 'menuBrunchPage', 'cocktailsMenu', 'kitchenRawFire', 'kitchenPlates', 'brunchMenuItems'],
      Events: ['eventsIndexPage', 'eventCategoryCards'],
      'Private Events': ['privateEventsIndexPage', 'privateEventsSlugTemplate', 'privateEventTypes', 'privateEventsProcessSteps', 'privateEventsFaqs'],
      'Brunch & Happy Hour': ['brunchPage', 'brunchFaqs', 'happyHourPage', 'happyHourFaqs'],
      'The Space': ['theSpacePage', 'spaceGalleryCards'],
      'Site Settings': ['venueSettings', 'eventsConfig', 'navigation', 'footer', 'localSeo'],
    },
  },
  singletons: {
    venueSettings: jsonSingleton('Venue / Business Data', 'venueSettings', 'settings', venueSettingsData),
    eventsConfig: jsonSingleton('Private Event Form Settings', 'eventsConfig', 'config', eventsConfigData),
    navigation: jsonSingleton('Navigation', 'navigation', 'navigation', navigationData),
    footer: jsonSingleton('Footer', 'footer', 'footer', footerData),
    localSeo: jsonSingleton('Local Search Settings', 'localSeo', 'localSeo', localSeoData),
    home: jsonSingleton('Home', 'home', 'home', homeData),
    about: jsonSingleton('About', 'about', 'about', aboutData),
    brunchPage: jsonSingleton('Brunch', 'brunchPage', 'page', brunchPageData),
    contactPage: jsonSingleton('Contact', 'contactPage', 'page', contactPageData),
    eventsIndexPage: jsonSingleton('Events', 'eventsIndexPage', 'page', eventsIndexPageData),
    happyHourPage: jsonSingleton('Happy Hour', 'happyHourPage', 'page', happyHourPageData),
    menuIndexPage: jsonSingleton('Menu Overview', 'menuIndexPage', 'page', menuIndexPageData),
    menuDinnerPage: jsonSingleton('Dinner Menu Page', 'menuDinnerPage', 'page', menuDinnerPageData),
    menuCocktailsPage: jsonSingleton('Cocktails Menu Page', 'menuCocktailsPage', 'page', menuCocktailsPageData),
    menuBrunchPage: jsonSingleton('Brunch Menu Page', 'menuBrunchPage', 'page', menuBrunchPageData),
    privateEventsIndexPage: jsonSingleton('Private Events', 'privateEventsIndexPage', 'page', privateEventsIndexPageData),
    privateEventsSlugTemplate: jsonSingleton('Private Events — Shared Content', 'privateEventsSlugTemplate', 'template', privateEventsSlugTemplateData),
    theSpacePage: jsonSingleton('The Space', 'theSpacePage', 'page', theSpacePageData),
  },
  collections: {
    cocktailsMenu: menuCollection('Cocktails Menu', 'cocktailsMenu'),
    kitchenRawFire: menuCollection('Kitchen Raw & Fire', 'kitchenRawFire'),
    kitchenPlates: menuCollection('Kitchen Plates', 'kitchenPlates'),
    brunchMenuItems: menuCollection('Brunch Menu Items', 'brunchMenuItems'),
    privateEventTypes: collection({
      label: 'Private Event Types', path: 'src/content/privateEventTypes/*', slugField: 'title', format: { data: 'json' }, columns: ['title', 'eventType', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Event Page Title', description: 'Meaningful title shown in the CMS and on the event page.', validation: { isRequired: true } } }),
        id: idField,
        slug: requiredText('Page URL', 'Last part of this page’s web address. Change only before the page is published.'),
        eventType: requiredText('Event Type', 'Plain-English event type used throughout the page.'),
        description: requiredText('Description', 'Summary of this private event offering.', true),
        capacity: requiredText('Guest Capacity', 'Guest capacity displayed for this event type.'),
        priceGuide: requiredText('Pricing Guide', 'Short pricing guidance displayed on the event card.'),
        metaTitle: requiredText('Search Result Title', 'Title shown in search engine results.'),
        keywords: fields.array(requiredText('Keyword', 'Enter one relevant search phrase.'), { label: 'Search Keywords', description: 'Add relevant search phrases for this page.', itemLabel: (props) => props.value || 'Keyword' }),
        order: orderField,
      },
    }),
    eventCategoryCards: cardCollection('Event Category Cards', 'eventCategoryCards'),
    privateEventsProcessSteps: collection({
      label: 'Private Events Process Steps', path: 'src/content/privateEventsProcessSteps/*', slugField: 'title', format: { data: 'json' }, columns: ['title', 'step', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Step Title', description: 'Meaningful title shown for this process step.', validation: { isRequired: true } } }),
        id: idField,
        step: requiredText('Step Number', 'Short displayed step number, such as 01.'),
        body: requiredText('Step Description', 'Explain what happens during this step.', true),
        order: orderField,
      },
    }),
    brunchFaqs: faqCollection('Brunch FAQs', 'brunchFaqs'),
    happyHourFaqs: faqCollection('Happy Hour FAQs', 'happyHourFaqs'),
    privateEventsFaqs: faqCollection('Private Events FAQs', 'privateEventsFaqs'),
    spaceGalleryCards: cardCollection('Space Gallery Cards', 'spaceGalleryCards'),
  },
});
