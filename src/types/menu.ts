// src/types/menu.ts
// Louisiana Purchase — Typed Menu Data Structures
// All menu JSON parsing must conform to these interfaces.

export interface MenuItem {
  id:           string;
  name:         string;
  description:  string;
  price:        number;            // Always in USD cents (e.g., 1800 = $18.00)
  priceDisplay: string;            // Pre-formatted: "$18"
  tags:         MenuItemTag[];
  dietary:      DietaryFlag[];
  featured:     boolean;
  available:    boolean;
}

export type MenuItemTag =
  | 'signature'
  | 'seasonal'
  | 'chef-selection'
  | 'new'
  | 'popular'
  | 'limited';

export type DietaryFlag =
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'spicy'
  | 'contains-shellfish';

export interface MenuCategory {
  id:          string;
  label:       string;
  description: string;
  order:       number;
  items:       MenuItem[];
}

export interface MenuSection {
  id:          string;
  title:       string;            // e.g., "Food", "Cocktails", "Wine"
  subtitle:    string;
  categories:  MenuCategory[];
}

export interface MenuData {
  version:     string;            // Semantic version for cache busting
  lastUpdated: string;            // ISO 8601 date
  sections:    MenuSection[];
}
