// Fix: japanese-gp-suzuka-city was wrongly treated as single-venue in the
// original ratings sweep (top-level googleMapsRating set to Nabana no
// Sato's rating only). Founder flagged 24 Sep 2026 — the body genuinely
// names 4 distinct venues (Nabana no Sato, Tsubaki Ōgamiyashiro Shrine,
// Suzuka Satsuki Onsen, Akame Onsen), so this converts the row to proper
// multi-venue treatment: clear the top-level rating fields, add inline
// links for all 4, add a MULTI_VENUE_RATINGS registry entry.
//
// Per feedback_multi_venue_ratings_registry_mandatory.md: a stray
// top-level googleMapsRating silently overrides the multi-venue jump-link,
// so those fields are explicitly nulled here, not just left stale.
//
// Venue notes:
// - Nabana no Sato: unchanged (4.4/6,779, cid=17139254563124567852),
//   moved from top-level fields into an inline body link.
// - Tsubaki Ōgamiyashiro Shrine: Places API match is "Tsubaki Okami
//   Yashiro Shrine" (same shrine, different macron/transliteration) —
//   4.6/7,082, distinct from a smaller "Nakato Shrine" result on the same
//   grounds (not used).
// - Suzuka Satsuki Onsen: Places API match is "Satsuki Hot Spring" (same
//   place, English name variant) — 3.8/524.
// - Akame Onsen: confirmed via onsen.nifty.com to be a small hot-spring
//   town with multiple named inns, not one single venue (same situation
//   as Dotonbori) — body previously left this vague ("another real
//   option"), so named it specifically as Taisenkaku, a currently
//   operating inn there offering day-use bathing (10:30-14:00), which
//   fits the "unwind after race day" framing already in the body.
//   4.0/418, cid=5817879949597743637.
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

const NABANA_NO_SATO_URL =
  "https://maps.google.com/?cid=17139254563124567852&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const TSUBAKI_SHRINE_URL =
  "https://maps.google.com/?cid=14267427082136174966&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const SATSUKI_ONSEN_URL =
  "https://maps.google.com/?cid=10374564267255212825&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const AKAME_TAISENKAKU_URL =
  "https://maps.google.com/?cid=5817879949597743637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const bodyContent = `Most Suzuka visitors see the circuit, the train station, and not much else — which is a reasonable outcome for a weekend built around the race, but it does mean skipping a small city with a couple of genuinely distinctive spots worth knowing about, particularly if you're building in any rest time around race weekend.

Nabana no Sato is the standout. It's a botanical garden that functions as a genuine daytime destination — landscaped grounds worth a walk — but its real reputation comes after dark, when its winter and seasonal illumination displays, including a "Tunnel of Light" walkway, turn it into one of the more striking light installations in the region. Whether the illuminations are running during your specific visit depends on the season, so check the current display calendar before planning a trip around it specifically — but even without the lights running, the gardens themselves are a legitimate stop. [See live rating and reviews on Google Maps](${NABANA_NO_SATO_URL}).

Tsubaki Ōgamiyashiro Shrine is Suzuka's significant Shinto shrine, and it's worth the visit for anyone interested in a genuine, non-touristy shrine experience rather than one of Japan's more crowded, famous sites. It's a real, active place of worship rather than a stop built primarily around visitor traffic. [See live rating and reviews on Google Maps](${TSUBAKI_SHRINE_URL}).

If you want to properly unwind after a long day at the circuit, Suzuka Satsuki Onsen sits a few kilometres from the track — a genuine hot spring option for anyone who wants the classic Japanese onsen experience without a special trip elsewhere in the region. [See live rating and reviews on Google Maps](${SATSUKI_ONSEN_URL}). Akame Onsen, a small hot-spring town a bit further out, is the other real option if you're willing to travel for it — Taisenkaku is the inn to know there, with day-use bathing available in the early afternoon rather than requiring an overnight stay. [See live rating and reviews on Google Maps](${AKAME_TAISENKAKU_URL}).

None of this is essential to a Suzuka trip built purely around the Grand Prix. But if you've got a rest day, or you're the type who'd rather see something of the place you're visiting beyond the track itself, Suzuka has more to offer than its reputation as "the town near the circuit" suggests.`;

try {
  const [result] = await db
    .update(experiences)
    .set({
      bodyContent,
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      lastVerifiedDate: "2026-09-24",
    })
    .where(eq(experiences.slug, "japanese-gp-suzuka-city"))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  if (!result) {
    console.error("✗ No row found for slug: japanese-gp-suzuka-city");
  } else {
    console.log(`✓ ${result.slug} | ${result.status} — now 4 linked places: Nabana no Sato, Tsubaki Ōgamiyashiro Shrine, Suzuka Satsuki Onsen, Akame Onsen (Taisenkaku); top-level rating fields cleared`);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
