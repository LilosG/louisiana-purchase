/// <reference path="../.astro/types.d.ts" />

// Louisiana Purchase — Typed Environment Variables
// All transactional CTA URLs are bound here. No hardcoded external URLs are permitted in component files.
// Populate values in .env and .env.production

interface ImportMetaEnv {
  // ─── Transactional Platform Links ─────────────────────────────────
  readonly PUBLIC_RESERVATIONS_URL:     string;   // Primary reservation link (OpenTable)
  readonly PUBLIC_RESERVATIONS_URL_TOAST: string; // Secondary/legacy reservation link (Toast) — temporary dual-button period
  readonly PUBLIC_ORDER_URL:            string;   // Toast Tab online ordering link
  readonly PUBLIC_GIFT_CARD_URL:        string;   // Gift card purchase portal

  // ─── Analytics & Tracking ─────────────────────────────────────────
  readonly PUBLIC_GA_MEASUREMENT_ID:    string;   // Google Analytics 4 Measurement ID

  // ─── Business Configuration ────────────────────────────────────────
  readonly PUBLIC_SITE_URL:             string;   // Canonical production URL (https://...)
  readonly PUBLIC_VENUE_PHONE:          string;   // Formatted phone number
  readonly PUBLIC_VENUE_EMAIL:          string;   // Contact email address
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
