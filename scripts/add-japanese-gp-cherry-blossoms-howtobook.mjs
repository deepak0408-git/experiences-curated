import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const SLUG = "japanese-gp-cherry-blossoms";

// Real, sourced Pro-tier tactical content, added 1 Oct 2026 per founder
// request to find genuine howToBook content for this experience (it had
// bookingMethod but no howToBook — the field that actually powers the
// "How to Book" Concierge Pick treatment on hub-and-spoke pages).
// Sources: Weathernews' Sakura Radar, confirmed live at
// weathernews.jp/sakura/radar (Japanese-language; verified via direct
// fetch 1 Oct 2026 — tracks bloom stage by viewing spot, daily updates);
// Japan Meteorological Corporation's English-language cherry blossom
// forecast page at n-kishou.com/corp/news-contents/sakura/?lang=en
// (confirmed via direct fetch — links to the "Flowering Meter" / Otenki
// Navigator tool covering ~1,000 viewing spots). Both independently
// confirmed as the two primary real-time bloom-tracking tools, more
// reliable close to the date than any forecast made months ahead — this
// reinforces, with real named tools and links, the "check a short-range
// forecast" advice already in this experience's own insiderTips.
const HOW_TO_BOOK =
  'Don\'t rely on a generic seasonal forecast — check Weathernews\' Sakura Radar (weathernews.jp/sakura/radar — Japanese-language, but browser translation handles it fine) or the Japan Meteorological Corporation\'s English-language forecast page (n-kishou.com/corp/news-contents/sakura/?lang=en), both of which track bloom progress at specific viewing spots including Nagoya\'s Yamazaki River and Tsuruma Park, with daily updates far more reliable than any prediction made months ahead. Check one of these the week you land, not before you book, and build your viewing stop around what they\'re actually showing rather than the general "early April" guess this pack gives you.';

const [current] = await sql`SELECT title, practical_info FROM experiences WHERE slug = ${SLUG}`;
const updated = { ...current.practical_info, howToBook: HOW_TO_BOOK };

await sql`UPDATE experiences SET practical_info = ${sql.json(updated)} WHERE slug = ${SLUG}`;
console.log(`✓ ${current.title} — howToBook added`);

await sql.end();
