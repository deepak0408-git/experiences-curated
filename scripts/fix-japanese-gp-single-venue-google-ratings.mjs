// Fix: Japanese GP 2027 experiences sweep — none of the 20 experiences had
// any googleMapsRating/ReviewCount/Url set. Founder flagged 24 Sep 2026.
//
// This script covers the single-venue rows (one real, individually
// addressable place each) — multi-venue rows are handled by a separate
// script (fix-japanese-gp-multi-venue-google-ratings.mjs) since those need
// inline body links + a MULTI_VENUE_RATINGS registry entry instead of a
// top-level field.
//
// Non-venue guide/informational rows (ticket-guide, weather-pack,
// hospitality-tiers, general-admission, getting-there, arriving-airport,
// first-timer-guide) are intentionally left null — no single real place a
// rating would represent.
//
// Ratings verified via Google Places API (scripts/_places-lookup.mjs),
// 24 Sep 2026 — not WebSearch snippets, not a different platform's scale.
//
// SUPERSEDED (same day): japanese-gp-suzuka-city was wrongly included
// below as single-venue (Nabana no Sato only) — its body actually names
// 4 distinct venues. Converted to proper multi-venue treatment (top-level
// fields cleared, inline links added, registry entry added) by
// fix-japanese-gp-suzuka-city-multi-venue.mjs. Left the entry below as-is
// for the historical record of what this script actually ran.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// slug -> { rating, reviewCount, url, placeName } — placeName is the actual
// Places API displayName, kept here only for the console log / audit trail.
const UPDATES = {
  "japanese-gp-suzuka-grandstand-g": {
    placeName: "Suzuka Circuit",
    rating: "4.5",
    reviewCount: 13442,
    url: "https://maps.google.com/?cid=9710119212537684956&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  "japanese-gp-suzuka-v1-v2-grandstand": {
    placeName: "Suzuka Circuit",
    rating: "4.5",
    reviewCount: 13442,
    url: "https://maps.google.com/?cid=9710119212537684956&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  "japanese-gp-suzuka-q2-grandstand": {
    placeName: "Suzuka Circuit",
    rating: "4.5",
    reviewCount: 13442,
    url: "https://maps.google.com/?cid=9710119212537684956&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  "japanese-gp-suzuka-circuit-park-motopia": {
    placeName: "Suzuka Circuit Park",
    rating: "4.5",
    reviewCount: 5097,
    url: "https://maps.google.com/?cid=10698198480688020384&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  "japanese-gp-suzuka-fan-zones": {
    placeName: "Suzuka Circuit GP Square",
    rating: "4.4",
    reviewCount: 70,
    url: "https://maps.google.com/?cid=4931489395134343511&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  "japanese-gp-suzuka-city": {
    placeName: "Nabana no Sato",
    rating: "4.4",
    reviewCount: 6779,
    url: "https://maps.google.com/?cid=17139254563124567852&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  "japanese-gp-ise-grand-shrine": {
    placeName: "Kotai Jingu (Ise Jingu Naiku / Inner Shrine)",
    rating: "4.7",
    reviewCount: 33319,
    url: "https://maps.google.com/?cid=17296468231710968999&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  "japanese-gp-sumo-near-nagoya": {
    placeName: "Sumo Studio Osaka",
    rating: "4.9",
    reviewCount: 1429,
    url: "https://maps.google.com/?cid=9643516867210791275&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
};

try {
  for (const [slug, { placeName, rating, reviewCount, url }] of Object.entries(UPDATES)) {
    const [result] = await db
      .update(experiences)
      .set({
        googleMapsRating: rating,
        googleMapsReviewCount: reviewCount,
        googleMapsUrl: url,
      })
      .where(eq(experiences.slug, slug))
      .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

    if (!result) {
      console.error("✗ No row found for slug:", slug);
    } else {
      console.log(`✓ ${result.slug} → ${placeName} (${rating}★ / ${reviewCount}) | ${result.status}`);
    }
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
