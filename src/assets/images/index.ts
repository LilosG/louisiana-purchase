// src/assets/images/index.ts
// Louisiana Purchase — Central Image Registry
//
// astro:assets requires build-time ESM imports (not runtime string paths)
// to optimize and generate responsive srcset output. Every displayed photo
// is imported once here and looked up by filename (no extension) elsewhere,
// so pages and menu.json can keep referring to images by a stable key.

import type { ImageMetadata } from 'astro';

import img_louisiana_purchase_acme_oysters_north_park_website from './louisiana-purchase-acme-oysters-north-park-website.jpg';
import img_louisiana_purchase_alligator_cheesecake_north_park_website from './louisiana-purchase-alligator-cheesecake-north-park-website.jpg';
import img_louisiana_purchase_brunch_dishes_overview_north_park_website from './louisiana-purchase-brunch-dishes-overview-north-park-website.jpg';
import img_louisiana_purchase_brunch_patio_setting_north_park_website from './louisiana-purchase-brunch-patio-setting-north-park-website.jpg';
import img_louisiana_purchase_brunch_table_flatlay_north_park_website from './louisiana-purchase-brunch-table-flatlay-north-park-website.jpg';
import img_louisiana_purchase_catfish_n_grits_brunch_north_park_website from './louisiana-purchase-catfish-n-grits-brunch-north-park-website.jpg';
import img_louisiana_purchase_catfish_n_grits_brunch_spread_north_park_website from './louisiana-purchase-catfish-n-grits-brunch-spread-north-park-website.jpg';
import img_louisiana_purchase_cocktail_bar_north_park_website from './louisiana-purchase-cocktail-bar-north-park-website.jpg';
import img_louisiana_purchase_cocktail_menu_north_park_website from './louisiana-purchase-cocktail-menu-north-park-website.jpg';
import img_louisiana_purchase_craft_cocktails_san_diego_website from './louisiana-purchase-craft-cocktails-san-diego-website.jpg';
import img_louisiana_purchase_creole_shrimp_pasta_north_park_website from './louisiana-purchase-creole-shrimp-pasta-north-park-website.jpg';
import img_louisiana_purchase_date_night_north_park_website from './louisiana-purchase-date-night-north-park-website.jpg';
import img_louisiana_purchase_dining_room_bar_north_park_website from './louisiana-purchase-dining-room-bar-north-park-website.jpg';
import img_louisiana_purchase_dinner_north_park_san_diego_website from './louisiana-purchase-dinner-north-park-san-diego-website.jpg';
import img_louisiana_purchase_dooky_chase_fried_chicken_north_park_website from './louisiana-purchase-dooky-chase-fried-chicken-north-park-website.jpg';
import img_louisiana_purchase_dragos_lobster_pasta_north_park_website from './louisiana-purchase-dragos-lobster-pasta-north-park-website.jpg';
import img_louisiana_purchase_drink_menu_north_park_san_diego_website from './louisiana-purchase-drink-menu-north-park-san-diego-website.jpg';
import img_louisiana_purchase_drop_top_chicken_flock_brunch_website from './louisiana-purchase-drop-top-chicken-flock-brunch-website.jpg';
import img_louisiana_purchase_gin_and_juice_cocktail_north_park_website from './louisiana-purchase-gin-and-juice-cocktail-north-park-website.jpg';
import img_louisiana_purchase_group_dining_san_diego_website from './louisiana-purchase-group-dining-san-diego-website.jpg';
import img_louisiana_purchase_happy_hour_pitcher_north_park_website from './louisiana-purchase-happy-hour-pitcher-north-park-website.jpg';
import img_louisiana_purchase_hurricane_pop_cocktail_north_park_website from './louisiana-purchase-hurricane-pop-cocktail-north-park-website.jpg';
import img_louisiana_purchase_intimate_cocktail_restaurant_website from './louisiana-purchase-intimate-cocktail-restaurant-website.jpg';
import img_louisiana_purchase_lemon_pepper_catfish_north_park_website from './louisiana-purchase-lemon-pepper-catfish-north-park-website.jpg';
import img_louisiana_purchase_marble_bar_north_park_website from './louisiana-purchase-marble-bar-north-park-website.jpg';
import img_louisiana_purchase_modern_creole_restaurant_website from './louisiana-purchase-modern-creole-restaurant-website.jpg';
import img_louisiana_purchase_north_park_restaurant_and_bar_website from './louisiana-purchase-north-park-restaurant-and-bar-website.jpg';
import img_louisiana_purchase_oxtail_plate_north_park_website from './louisiana-purchase-oxtail-plate-north-park-website.jpg';
import img_louisiana_purchase_patio_living_wall_north_park_website from './louisiana-purchase-patio-living-wall-north-park-website.jpg';
import img_louisiana_purchase_private_brunch_events_north_park_website from './louisiana-purchase-private-brunch-events-north-park-website.jpg';
import img_louisiana_purchase_private_dining_san_diego_website from './louisiana-purchase-private-dining-san-diego-website.jpg';
import img_louisiana_purchase_restaurant_exterior_pergola_north_park_website from './louisiana-purchase-restaurant-exterior-pergola-north-park-website.jpg';
import img_louisiana_purchase_seafood_and_cocktails_north_park_website from './louisiana-purchase-seafood-and-cocktails-north-park-website.jpg';
import img_louisiana_purchase_seafood_restaurant_san_diego_website from './louisiana-purchase-seafood-restaurant-san-diego-website.jpg';
import img_louisiana_purchase_shrimp_n_grits_brunch_north_park_website from './louisiana-purchase-shrimp-n-grits-brunch-north-park-website.jpg';
import img_louisiana_purchase_southern_brunch_menu_north_park_website from './louisiana-purchase-southern-brunch-menu-north-park-website.jpg';
import img_louisiana_purchase_street_corner_exterior_north_park_website from './louisiana-purchase-street-corner-exterior-north-park-website.webp';
import img_louisiana_purchase_superbird_paloma_cocktail_north_park_website from './louisiana-purchase-superbird-paloma-cocktail-north-park-website.jpg';
import img_louisiana_purchase_university_ave_corner_night_north_park_website from './louisiana-purchase-university-ave-corner-night-north-park-website.jpg';
import img_louisiana_purchase_watermelon_margarita_cocktail_north_park_website from './louisiana-purchase-watermelon-margarita-cocktail-north-park-website.jpg';
import img_louisiana_purchase_weekend_brunch_san_diego_website from './louisiana-purchase-weekend-brunch-san-diego-website.jpg';
import img_louisiana_purchase_weezy_vice_cocktail_north_park_website from './louisiana-purchase-weezy-vice-cocktail-north-park-website.jpg';

const LEGACY_IMAGES = {
  'louisiana-purchase-acme-oysters-north-park-website': img_louisiana_purchase_acme_oysters_north_park_website,
  'louisiana-purchase-alligator-cheesecake-north-park-website': img_louisiana_purchase_alligator_cheesecake_north_park_website,
  'louisiana-purchase-brunch-dishes-overview-north-park-website': img_louisiana_purchase_brunch_dishes_overview_north_park_website,
  'louisiana-purchase-brunch-patio-setting-north-park-website': img_louisiana_purchase_brunch_patio_setting_north_park_website,
  'louisiana-purchase-brunch-table-flatlay-north-park-website': img_louisiana_purchase_brunch_table_flatlay_north_park_website,
  'louisiana-purchase-catfish-n-grits-brunch-north-park-website': img_louisiana_purchase_catfish_n_grits_brunch_north_park_website,
  'louisiana-purchase-catfish-n-grits-brunch-spread-north-park-website': img_louisiana_purchase_catfish_n_grits_brunch_spread_north_park_website,
  'louisiana-purchase-cocktail-bar-north-park-website': img_louisiana_purchase_cocktail_bar_north_park_website,
  'louisiana-purchase-cocktail-menu-north-park-website': img_louisiana_purchase_cocktail_menu_north_park_website,
  'louisiana-purchase-craft-cocktails-san-diego-website': img_louisiana_purchase_craft_cocktails_san_diego_website,
  'louisiana-purchase-creole-shrimp-pasta-north-park-website': img_louisiana_purchase_creole_shrimp_pasta_north_park_website,
  'louisiana-purchase-date-night-north-park-website': img_louisiana_purchase_date_night_north_park_website,
  'louisiana-purchase-dining-room-bar-north-park-website': img_louisiana_purchase_dining_room_bar_north_park_website,
  'louisiana-purchase-dinner-north-park-san-diego-website': img_louisiana_purchase_dinner_north_park_san_diego_website,
  'louisiana-purchase-dooky-chase-fried-chicken-north-park-website': img_louisiana_purchase_dooky_chase_fried_chicken_north_park_website,
  'louisiana-purchase-dragos-lobster-pasta-north-park-website': img_louisiana_purchase_dragos_lobster_pasta_north_park_website,
  'louisiana-purchase-drink-menu-north-park-san-diego-website': img_louisiana_purchase_drink_menu_north_park_san_diego_website,
  'louisiana-purchase-drop-top-chicken-flock-brunch-website': img_louisiana_purchase_drop_top_chicken_flock_brunch_website,
  'louisiana-purchase-gin-and-juice-cocktail-north-park-website': img_louisiana_purchase_gin_and_juice_cocktail_north_park_website,
  'louisiana-purchase-group-dining-san-diego-website': img_louisiana_purchase_group_dining_san_diego_website,
  'louisiana-purchase-happy-hour-pitcher-north-park-website': img_louisiana_purchase_happy_hour_pitcher_north_park_website,
  'louisiana-purchase-hurricane-pop-cocktail-north-park-website': img_louisiana_purchase_hurricane_pop_cocktail_north_park_website,
  'louisiana-purchase-intimate-cocktail-restaurant-website': img_louisiana_purchase_intimate_cocktail_restaurant_website,
  'louisiana-purchase-lemon-pepper-catfish-north-park-website': img_louisiana_purchase_lemon_pepper_catfish_north_park_website,
  'louisiana-purchase-marble-bar-north-park-website': img_louisiana_purchase_marble_bar_north_park_website,
  'louisiana-purchase-modern-creole-restaurant-website': img_louisiana_purchase_modern_creole_restaurant_website,
  'louisiana-purchase-north-park-restaurant-and-bar-website': img_louisiana_purchase_north_park_restaurant_and_bar_website,
  'louisiana-purchase-oxtail-plate-north-park-website': img_louisiana_purchase_oxtail_plate_north_park_website,
  'louisiana-purchase-patio-living-wall-north-park-website': img_louisiana_purchase_patio_living_wall_north_park_website,
  'louisiana-purchase-private-brunch-events-north-park-website': img_louisiana_purchase_private_brunch_events_north_park_website,
  'louisiana-purchase-private-dining-san-diego-website': img_louisiana_purchase_private_dining_san_diego_website,
  'louisiana-purchase-restaurant-exterior-pergola-north-park-website': img_louisiana_purchase_restaurant_exterior_pergola_north_park_website,
  'louisiana-purchase-seafood-and-cocktails-north-park-website': img_louisiana_purchase_seafood_and_cocktails_north_park_website,
  'louisiana-purchase-seafood-restaurant-san-diego-website': img_louisiana_purchase_seafood_restaurant_san_diego_website,
  'louisiana-purchase-shrimp-n-grits-brunch-north-park-website': img_louisiana_purchase_shrimp_n_grits_brunch_north_park_website,
  'louisiana-purchase-southern-brunch-menu-north-park-website': img_louisiana_purchase_southern_brunch_menu_north_park_website,
  'louisiana-purchase-street-corner-exterior-north-park-website': img_louisiana_purchase_street_corner_exterior_north_park_website,
  'louisiana-purchase-superbird-paloma-cocktail-north-park-website': img_louisiana_purchase_superbird_paloma_cocktail_north_park_website,
  'louisiana-purchase-university-ave-corner-night-north-park-website': img_louisiana_purchase_university_ave_corner_night_north_park_website,
  'louisiana-purchase-watermelon-margarita-cocktail-north-park-website': img_louisiana_purchase_watermelon_margarita_cocktail_north_park_website,
  'louisiana-purchase-weekend-brunch-san-diego-website': img_louisiana_purchase_weekend_brunch_san_diego_website,
  'louisiana-purchase-weezy-vice-cocktail-north-park-website': img_louisiana_purchase_weezy_vice_cocktail_north_park_website,
} as const;

// Keystatic stores new uploads below a field-specific cms/ namespace. The
// recursive registry lets those new paths work without hand-editing imports,
// while LEGACY_IMAGES preserves every existing extension-free content key.
const cmsModules = import.meta.glob<{ default: ImageMetadata }>('./cms/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const CMS_IMAGES = Object.fromEntries(
  Object.entries(cmsModules).map(([path, module]) => [path.replace(/^\.\//, ''), module.default]),
) as Record<string, ImageMetadata>;

export const IMAGES: Record<string, ImageMetadata> = {
  ...LEGACY_IMAGES,
  ...CMS_IMAGES,
};

export type ImageKey = keyof typeof IMAGES;
