// Fix: japanese-gp-osaka-day-trip's food paragraph made a generic claim
// ("a day spent eating your way through a few different spots") without
// naming a single restaurant. Founder flagged 24 Sep 2026, asked for at
// least 2 reputable, verified restaurants in the Dotonbori area (or near
// Osaka Castle) with real Google ratings.
//
// Added: Kushikatsu Daruma (Dotonbori) — the best-known kushikatsu chain
// in the district, unlinked to any specific dish already named in the
// body, so it adds real food-scene breadth rather than restating takoyaki/
// okonomiyaki. Chibo (Dotonbori) — long-running okonomiyaki specialist,
// directly ties to the okonomiyaki mention earlier in the same paragraph.
// Both confirmed currently trading via WebSearch (2026 sources) and real
// Places entries via Google Places API.
//
// venueCount for this slug's MULTI_VENUE_RATINGS entry updated 2 -> 4 in
// the same pass (app/experience/[slug]/page.tsx) — now Dotonbori, Osaka
// Castle, Kushikatsu Daruma, Chibo.
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

const DOTONBORI_URL =
  "https://maps.google.com/?cid=13311254180582368656&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const OSAKA_CASTLE_URL =
  "https://maps.google.com/?cid=1081374622389182017&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const KUSHIKATSU_DARUMA_URL =
  "https://maps.google.com/?cid=13204320496193831615&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const CHIBO_URL =
  "https://maps.google.com/?cid=11230990528616538865&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const bodyContent = `Osaka comes up in almost every Suzuka planning guide, and it's worth being honest about what that actually means before building a day around it: this is a real day trip from your Nagoya base, not a second base for the weekend. The commute is genuinely longer than most guides let on, and knowing the real numbers changes how you'd plan the day.

There's no direct train from Suzuka Circuit to Osaka. The most common route runs Kintetsu Limited Express from Osaka-Namba via Tsu to Suzuka Circuit Ino Station, taking around two hours and twenty minutes one way. From Nagoya specifically — your actual base for race weekend — the Shinkansen to Osaka runs closer to fifty minutes, considerably faster, with the Kintetsu HINOTORI limited express as a slower but cheaper alternative at around two hours ten minutes. Either way, treat a Nagoya-based Osaka day trip as a genuine four-to-five-hour round trip once you include both legs, not a quick hop — this is why Osaka works as a day trip from Nagoya, and doesn't work as a second base you'd commute from to the circuit itself.

Once you're there, Osaka rewards the trip. Dotonbori is the obvious start — the canal-side entertainment district with its illuminated signage and a genuine street food culture built around takoyaki and okonomiyaki, both Osaka specialties worth trying here specifically rather than settling for a version elsewhere in Japan. [See live rating and reviews on Google Maps](${DOTONBORI_URL}). Osaka Castle is the other major anchor, a genuinely striking reconstructed castle set in a large park, worth an hour or two if castles interest you at all. [See live rating and reviews on Google Maps](${OSAKA_CASTLE_URL}).

For food beyond the Dotonbori street stalls, Osaka's reputation as Japan's kitchen is earned — the city takes casual, unpretentious food seriously in a way that's distinct from Tokyo's more formal dining culture. Chibo is the name to know for okonomiyaki specifically, a long-running specialist right in Dotonbori with a signature version loaded with pork, shrimp, squid, and cheese. [See live rating and reviews on Google Maps](${CHIBO_URL}). Kushikatsu Daruma, marked by the large chef statue over its entrance, is the district's best-known spot for kushikatsu — battered, deep-fried skewers dipped once in a shared sauce, a different texture and eating style from the griddle food dominating the rest of the street. [See live rating and reviews on Google Maps](${KUSHIKATSU_DARUMA_URL}). A day spent working through a few different spots like these is a legitimate way to experience the city, not a lesser alternative to sightseeing.

If your time is genuinely limited, Dotonbori alone — walked slowly, with real time for the food — gives a strong sense of Osaka in a few hours. Add Osaka Castle only if you have the better part of a full day to spend, given the real travel time already spent getting there and back.`;

try {
  const [result] = await db
    .update(experiences)
    .set({ bodyContent, lastVerifiedDate: "2026-09-24" })
    .where(eq(experiences.slug, "japanese-gp-osaka-day-trip"))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  if (!result) {
    console.error("✗ No row found for slug: japanese-gp-osaka-day-trip");
  } else {
    console.log(`✓ ${result.slug} | ${result.status} — now 4 linked places: Dotonbori, Osaka Castle, Chibo, Kushikatsu Daruma`);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
