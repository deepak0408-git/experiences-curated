// Fix: Japanese GP 2027 experiences sweep — multi-venue rows, part of the
// same 24 Sep 2026 gap as fix-japanese-gp-single-venue-google-ratings.mjs.
//
// Multi-venue rows (2+ named, individually addressable venues) don't get a
// top-level googleMapsRating — instead each named venue gets an inline
// [See live rating and reviews on Google Maps] link in bodyContent, and the
// experience's slug must have a MULTI_VENUE_RATINGS entry in
// app/experience/[slug]/page.tsx for the jump-link to render
// (feedback_multi_venue_ratings_registry_mandatory.md).
//
// This script only adds bodyContent links where they were missing.
// japanese-gp-nagoya-food-scene and japanese-gp-suzuka-where-to-stay
// already had correct inline links from an earlier session — this script
// leaves those bodyContent fields untouched (verified their existing CIDs
// match the Places API's top result, 24 Sep 2026) and only needs the
// registry entry added separately (see instructions printed at the end —
// registry lives in a .tsx file, not editable via this script).
//
// Ratings verified via Google Places API (scripts/_places-lookup.mjs),
// 24 Sep 2026.
//
// Dotonbori (named in japanese-gp-osaka-day-trip) is a district, not a
// single addressable venue — Places API returns no rating for it, so it's
// left as plain prose with no link. Only Osaka Castle gets a link there.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const NAGOYA_CASTLE_URL =
  "https://maps.google.com/?cid=13390302821165147767&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const KINSHACHI_YOKOCHO_URL =
  "https://maps.google.com/?cid=15458159795317185073&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const OSU_KANNON_URL =
  "https://maps.google.com/?cid=2881118202202290152&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const OSAKA_CASTLE_URL =
  "https://maps.google.com/?cid=1081374622389182017&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

// --- japanese-gp-nagoya-day-trip: add links after Nagoya Castle, Kinshachi
// Yokocho, and Osu Kannon mentions (Sakae is a modern commercial district,
// not a single venue — left unlinked, same treatment as Dotonbori below).
const nagoyaDayTripBody = `Most Suzuka visitors already pass through Nagoya without ever really seeing it — it's the base for the race, not the destination. That's worth correcting with one full day, either before the circuit takes over your schedule or after the race, while you're still in the region anyway.

Nagoya Castle is the obvious anchor, and it earns the visit. [See live rating and reviews on Google Maps](${NAGOYA_CASTLE_URL}). The main keep is a postwar reconstruction, but the Honmaru Palace within the castle grounds is the real draw — a genuinely faithful reconstruction of the original Edo-period structure, with gold-leaf paintings and interior detail rebuilt to match historical records rather than a generic castle-museum treatment. Budget a couple of hours here if the palace interior interests you, less if you're mainly there for the grounds and the photo.

From the castle, Kinshachi Yokocho sits right at the gates — a food street built specifically around Nagoya meshi, the city's own regional cooking, rather than a generic tourist food court. [See live rating and reviews on Google Maps](${KINSHACHI_YOKOCHO_URL}). That means the dishes Nagoya is actually known for: hitsumabushi, grilled eel served over rice in a wooden tub and eaten three different ways through the meal; miso katsu, a pork cutlet under a dark hatcho miso sauce; miso nikomi udon, thick noodles simmered in the same miso until they're almost chewy; tebasaki, the twice-fried peppered chicken wings; and ankake spaghetti, a local oddity of thick peppery gravy over pasta that exists essentially nowhere else. Several of the stalls are outposts of the long-established Nagoya names — Yabaton for miso katsu, Yamamotoya Sohonke for miso nikomi udon, Nagoya Bicho for hitsumabushi — so you're not trading quality for the convenience of having them in one place. It's the easiest single stop for eating your way through the city's signature dishes, and a natural lunch straight off a castle visit.

Osu is the other essential stop, and it's a genuinely different kind of neighbourhood from the castle grounds — a dense, slightly chaotic shopping street mixing electronics, vintage clothing, temples, and street food, closer to Tokyo's Akihabara in energy than anything else in Nagoya. Osu Kannon, the Buddhist temple the area is named for, sits right in the middle of it, worth a stop even if temples aren't usually your priority — the contrast between the temple grounds and the shopping street around it is part of what makes Osu interesting. [See live rating and reviews on Google Maps](${OSU_KANNON_URL}).

If you have time beyond the castle and Osu, Sakae is Nagoya's modern commercial core — a place to end the day with dinner and a look at the city's contemporary side after a day spent mostly in its historical and food-focused areas.

One realistic day covers the castle, Kinshachi Yokocho, and Osu comfortably, with Sakae as an evening add-on if you're not racing back for an early Suzuka start the next morning.`;

// --- japanese-gp-osaka-day-trip: add a link after Osaka Castle only.
// Dotonbori stays unlinked (district, no single Places rating).
const osakaDayTripBody = `Osaka comes up in almost every Suzuka planning guide, and it's worth being honest about what that actually means before building a day around it: this is a real day trip from your Nagoya base, not a second base for the weekend. The commute is genuinely longer than most guides let on, and knowing the real numbers changes how you'd plan the day.

There's no direct train from Suzuka Circuit to Osaka. The most common route runs Kintetsu Limited Express from Osaka-Namba via Tsu to Suzuka Circuit Ino Station, taking around two hours and twenty minutes one way. From Nagoya specifically — your actual base for race weekend — the Shinkansen to Osaka runs closer to fifty minutes, considerably faster, with the Kintetsu HINOTORI limited express as a slower but cheaper alternative at around two hours ten minutes. Either way, treat a Nagoya-based Osaka day trip as a genuine four-to-five-hour round trip once you include both legs, not a quick hop — this is why Osaka works as a day trip from Nagoya, and doesn't work as a second base you'd commute from to the circuit itself.

Once you're there, Osaka rewards the trip. Dotonbori is the obvious start — the canal-side entertainment district with its illuminated signage and a genuine street food culture built around takoyaki and okonomiyaki, both Osaka specialties worth trying here specifically rather than settling for a version elsewhere in Japan. Osaka Castle is the other major anchor, a genuinely striking reconstructed castle set in a large park, worth an hour or two if castles interest you at all. [See live rating and reviews on Google Maps](${OSAKA_CASTLE_URL}).

For food beyond the Dotonbori street stalls, Osaka's reputation as Japan's kitchen is earned — the city takes casual, unpretentious food seriously in a way that's distinct from Tokyo's more formal dining culture, and a day spent eating your way through a few different spots is a legitimate way to experience the city, not a lesser alternative to sightseeing.

If your time is genuinely limited, Dotonbori alone — walked slowly, with real time for the food — gives a strong sense of Osaka in a few hours. Add Osaka Castle only if you have the better part of a full day to spend, given the real travel time already spent getting there and back.`;

const UPDATES = [
  { slug: "japanese-gp-nagoya-day-trip", bodyContent: nagoyaDayTripBody, venueCount: 3, venueNoun: "places" },
  { slug: "japanese-gp-osaka-day-trip", bodyContent: osakaDayTripBody, venueCount: 1, venueNoun: "sights" },
];

try {
  for (const { slug, bodyContent } of UPDATES) {
    const [result] = await db
      .update(experiences)
      .set({ bodyContent, lastVerifiedDate: "2026-09-24" })
      .where(eq(experiences.slug, slug))
      .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

    if (!result) {
      console.error("✗ No row found for slug:", slug);
    } else {
      console.log(`✓ ${result.slug} | ${result.status}`);
    }
  }

  console.log(`
NEXT STEP (not done by this script — a .tsx file, not the DB):
Add these entries to MULTI_VENUE_RATINGS in app/experience/[slug]/page.tsx:
  "japanese-gp-nagoya-day-trip": { venueCount: 3, venueNoun: "places" },       // Nagoya Castle, Kinshachi Yokocho, Osu Kannon
  "japanese-gp-nagoya-food-scene": { venueCount: 2, venueNoun: "restaurants" }, // Atsuta Horaiken, Yabaton (links already existed)
  "japanese-gp-suzuka-where-to-stay": { venueCount: 2, venueNoun: "hotels" },   // Marriott, LiVEMAX (links already existed)
  "japanese-gp-osaka-day-trip": { venueCount: 1, venueNoun: "sights" },        // Osaka Castle only — Dotonbori is a district, unrated
  "japanese-gp-cherry-blossoms": left OUT of registry — body names several
    seasonal spots (Tsuruma Park, Yamazaki River, Philosopher's Path,
    Maruyama Park, Osaka Castle Park) as loose suggestions, not
    individually-addressable "visit this venue" recommendations the way the
    other rows do. No inline rating links were added here — flag to founder
    if that call should be revisited.
`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
