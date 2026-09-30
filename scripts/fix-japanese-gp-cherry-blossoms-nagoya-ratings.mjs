// Fix: japanese-gp-cherry-blossoms had no Google ratings for the two named
// Nagoya-base viewing spots (Yamazaki River, Tsuruma Park). Founder
// flagged 24 Sep 2026, asked specifically for these two.
//
// This row was deliberately left out of the earlier multi-venue sweep
// (fix-japanese-gp-multi-venue-google-ratings.mjs) because it names
// several loose seasonal spots across three cities (Nagoya, Kyoto, Osaka)
// as possibilities, not firm venue recommendations. The founder's request
// scopes this to just the two Nagoya-base spots, so only those two get
// links + a MULTI_VENUE_RATINGS entry — Kyoto's Philosopher's Path/
// Maruyama Park and Osaka Castle Park stay unlinked prose, consistent
// with how loosely they're framed in the body (not this experience's
// primary destination).
//
// "Yamazaki River" alone returned a generic river-segment Places result
// (4.4/53 reviews) distinct from "Four Seasons Road of Yamazaki River"
// (Shikinomichi), the actual named, Top-100-ranked cherry blossom stretch
// travel sources refer to — used the latter as the correct match.
//
// Ratings verified via Google Places API (scripts/_places-lookup.mjs),
// 24 Sep 2026.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const YAMAZAKI_RIVER_URL =
  "https://maps.google.com/?cid=88633634870327324&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const TSURUMA_PARK_URL =
  "https://maps.google.com/?cid=5791310600726366856&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const bodyContent = `A Japanese Grand Prix in early April naturally raises the question of cherry blossoms, and the honest answer is more nuanced than most travel content lets on: it's genuinely possible, but not guaranteed, and worth understanding the real timing before building expectations around it.

Peak bloom — mankai, when the trees look their absolute best — typically lasts only five to seven days, and can be shortened further by wind, rain, or a sudden temperature swing. Based on 2026's confirmed dates, Nagoya reached full bloom around 28 March, with Kyoto and Osaka following around 31 March. The broader window most forecasters point to for central Honshu — Tokyo, Kyoto, Osaka, Nagoya, and the surrounding region — runs roughly 29 March to 7 April in a typical year.

Suzuka's 2027 race weekend runs 9-11 April. That places it right at the tail end of, or just past, the typical peak-bloom window based on recent years' patterns — not squarely inside it. Some years run later than average and would put the race weekend in genuinely excellent bloom; other years run on the early side, and by race weekend the peak would already have passed in Nagoya and Osaka specifically, with only later-blooming spots or higher-elevation locations still holding good color. Bloom timing depends on the specific winter and early-spring weather that year, which isn't predictable this far out — treat any early forecast for April 2027 specifically as unreliable until closer to the date.

If you do get bloom, or catch the tail end of it, Nagoya has real options close to your base. The Four Seasons Road along the Yamazaki River is the standout — a 2.5-kilometer riverside promenade lined with around 550 cherry trees, ranked among Japan's Top 100 Cherry Blossom Spots, with the old trees around Kanae-kobashi Bridge reflected in the water among the most photographed stretches. [See live rating and reviews on Google Maps](${YAMAZAKI_RIVER_URL}). Tsuruma Park, closer to central Nagoya, is the other well-known local spot — a genuine city park worth combining with a shorter, more casual viewing stop. [See live rating and reviews on Google Maps](${TSURUMA_PARK_URL}). In Kyoto, the Philosopher's Path and Maruyama Park are the classic choices if you extend your trip that far. In Osaka, Osaka Castle Park's grounds are a genuine cherry blossom destination in their own right, worth combining with an Osaka day trip if timing cooperates.

The realistic plan: treat cherry blossoms as a genuine possible bonus of an early April trip, not a guaranteed feature of it. Check a closer-to-date forecast once you're within a few weeks of travel, and build a loose, checkable viewing stop into your Nagoya or Osaka day rather than planning an entire day around blossoms that may or may not still be there by the time you arrive.`;

try {
  const [result] = await db
    .update(experiences)
    .set({ bodyContent, lastVerifiedDate: "2026-09-24" })
    .where(eq(experiences.slug, "japanese-gp-cherry-blossoms"))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  if (!result) {
    console.error("✗ No row found for slug: japanese-gp-cherry-blossoms");
  } else {
    console.log(`✓ ${result.slug} | ${result.status} — Yamazaki River (Four Seasons Road) + Tsuruma Park linked`);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
