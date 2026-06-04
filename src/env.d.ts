/// <reference path="../.astro/types.d.ts" />

// Louisiana Purchase — Typed Environment Variables
// All transactional CTA URLs are bound here. No hardcoded external URLs are permitted in component files.
// Populate values in .env and .env.production

interface ImportMetaEnv {
  // ─── Transactional Platform Links ─────────────────────────────────
  readonly PUBLIC_RESERVATIONS_URL:     string;   // OpenTable / Resy reservation link
  readonly PUBLIC_ORDER_URL:            string;   // Toast Tab online ordering link
  readonly PUBLIC_GIFT_CARD_URL:        string;   // Gift card purchase portal
  readonly PUBLIC_PRIVATE_EVENTS_URL:   string;   // Tripleseat private event inquiry form
  readonly PUBLIC_CATERING_URL:         string;   // Catering inquiry link

  // ─── Analytics & Tracking ─────────────────────────────────────────
  readonly PUBLIC_GA_MEASUREMENT_ID:    string;   // Google Analytics 4 Measurement ID
  readonly PUBLIC_GTM_CONTAINER_ID:     string;   // Google Tag Manager Container ID
  readonly PUBLIC_META_PIXEL_ID:        string;   // Meta (Facebook) Pixel ID
  readonly PUBLIC_UTM_SOURCE:           string;   // UTM source tag (e.g., 'louisiana-purchase')

  // ─── Business Configuration ────────────────────────────────────────
  readonly PUBLIC_SITE_URL:             string;   // Canonical production URL (https://...)
  readonly PUBLIC_VENUE_PHONE:          string;   // Formatted phone number
  readonly PUBLIC_VENUE_EMAIL:          string;   // Contact email address
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
