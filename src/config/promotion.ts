export type PromotionFeedOrigin = `https://${string}`;

export interface PromotionConfig {
  feedOrigin: PromotionFeedOrigin;
  venueSlug: string;
}

/** Public promotion-feed settings for Louisiana Purchase. */
export const PROMOTION_CONFIG = {
  feedOrigin: 'https://gph-site-manager.vercel.app',
  venueSlug: 'louisiana-purchase',
} as const satisfies PromotionConfig;

export function getPromotionFeedUrl(siteSlug: string): string {
  return new URL(
    `/api/public/promotion/${encodeURIComponent(siteSlug)}`,
    PROMOTION_CONFIG.feedOrigin,
  ).href;
}
