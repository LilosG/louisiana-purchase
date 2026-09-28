// Build-time Google rating fetch (runs before `astro build`, see package.json).
// Writes src/data/google-rating.json, which feeds the visible "Google Rating"
// stat on the homepage. It must never fail the build: when GOOGLE_PLACES_API_KEY
// is missing or the request fails, it writes {"rating":null,"count":0}, logs a
// warning, and the stat is simply not rendered. No client-side fetching.
import { readFileSync, writeFileSync } from 'fs';

const outPath = new URL('../src/data/google-rating.json', import.meta.url).pathname;
const settingsPath = new URL('../src/content/venueSettings/settings.json', import.meta.url).pathname;
const fallback = { rating: null, count: 0 };

function writeFallback(reason) {
  console.warn(`[google-rating] ${reason} — writing ${JSON.stringify(fallback)}; the Google Rating stat will not be shown.`);
  writeFileSync(outPath, JSON.stringify(fallback));
}

const PLACE_ID_PATTERN = /^ChIJ[A-Za-z0-9_-]+$/;

function readVenuePlaceId() {
  try {
    return JSON.parse(readFileSync(settingsPath, 'utf8')).mapsPlaceId;
  } catch {
    return undefined;
  }
}

let placeIdSource = 'env';
let placeId = process.env.GOOGLE_PLACE_ID?.trim();

if (placeId && !PLACE_ID_PATTERN.test(placeId)) {
  console.warn(`[google-rating] GOOGLE_PLACE_ID is invalid (starts with "${placeId.slice(0, 6)}") — falling back to venueSettings.mapsPlaceId`);
  placeId = undefined;
}

if (!placeId) {
  placeIdSource = 'venueSettings';
  placeId = readVenuePlaceId()?.trim();
}

console.log(`[google-rating] using Place ID from ${placeIdSource}`);

const apiKey = process.env.GOOGLE_PLACES_API_KEY;

if (!apiKey) {
  writeFallback('GOOGLE_PLACES_API_KEY is not set');
} else if (!placeId) {
  writeFallback('no Place ID (GOOGLE_PLACE_ID or venueSettings.mapsPlaceId)');
} else {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total&key=${apiKey}`,
      { signal: AbortSignal.timeout(10000) },
    );
    const data = await res.json();
    if (data.status === 'OK' && typeof data.result?.rating === 'number') {
      writeFileSync(outPath, JSON.stringify({
        rating: data.result.rating,
        count: data.result.user_ratings_total || 0,
      }));
      console.log(`[google-rating] ${data.result.rating} (${data.result.user_ratings_total || 0} reviews)`);
    } else {
      writeFallback(`Places API returned status ${data.status ?? res.status}${data.error_message ? ` — ${data.error_message}` : ''}`);
    }
  } catch (error) {
    writeFallback(`request failed (${error?.message ?? error})`);
  }
}
