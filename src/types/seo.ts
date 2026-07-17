// src/types/seo.ts
// Louisiana Purchase — Typed SEO & Schema Data Structures
// All JSON-LD and meta tag interfaces are centralized here.

export interface VenueAddress {
  street:    string;
  city:      string;
  state:     string;
  zip:       string;
  country:   string;
}

export interface VenueGeo {
  latitude:  number;
  longitude: number;
}

export interface VenueHours {
  dayOfWeek:  string;   // schema.org day format: "Monday", "Tuesday", etc.
  opens:      string;   // HH:MM (24h)
  closes:     string;   // HH:MM (24h)
}

export interface VenueSchemaConfig {
  name:              string;
  type:              'Restaurant' | 'BarOrPub' | 'EventVenue' | 'FoodEstablishment';
  description:       string;
  url:               string;
  phone:             string;
  email:             string;
  address:           VenueAddress;
  geo:               VenueGeo;
  hours:             VenueHours[];
  cuisines:          string[];
  priceRange:        '$$' | '$$$' | '$$$$';
  image:             string;
  logo:              string;
  acceptsReservations: boolean;
  hasMenu:           string;
}

export interface PageSeoProps {
  title:          string;
  description:    string;
  canonical?:     string;
  ogImage?:       string;
  ogType?:        'website' | 'article' | 'restaurant';
  noindex?:       boolean;
  schema?:        Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?:   BreadcrumbItem[];
}

export interface BreadcrumbItem {
  name:     string;
  url:      string;
  position: number;
}

export interface PrivateEventSlug {
  slug:        string;
  title:       string;
  metaTitle:   string;
  description: string;
  keywords:    string[];
  eventType:   string;
  capacity:    string;
  priceGuide:  string;
}
