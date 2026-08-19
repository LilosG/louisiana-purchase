import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const outPath = new URL('../src/data/google-rating.json', import.meta.url).pathname;
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;
const fallback = { rating: null, count: 0 };

if (!apiKey || !placeId) {
  writeFileSync(outPath, JSON.stringify(fallback));
  process.exit(0);
}

try {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`
  );
  const data = await res.json();
  if (data.status === 'OK' && data.result?.rating) {
    writeFileSync(outPath, JSON.stringify({
      rating: data.result.rating,
      count: data.result.user_ratings_total || 0,
    }));
  } else {
    writeFileSync(outPath, JSON.stringify(fallback));
  }
} catch {
  writeFileSync(outPath, JSON.stringify(fallback));
}
