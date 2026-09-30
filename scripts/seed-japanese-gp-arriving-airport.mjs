// Seed: "Arriving into Japan — Choosing Your Airport" — experience #10/20
// for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - NGO (Chubu Centrair) route detail: sourced earlier this session (rome2rio,
//   thef1spectator.com, universalweather.com) — ~1hr from Suzuka Circuit
// - rome2rio.com "Tokyo Narita Airport (NRT) to Nagoya Station" (NRT-to-Nagoya
//   Shinkansen route: ~3hrs total via Narita Express to Tokyo Station then
//   Shinkansen, from ~US$54)
// Founder-directed content: cover both NGO (primary) and NRT+Shinkansen
// (secondary) explicitly.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-arriving-airport";

const bodyContent = `The first real decision on a Suzuka trip happens before you've even booked a hotel: which airport do you actually fly into. Get this wrong and you're adding hours to a trip that's already logistically involved, since Suzuka itself has no international airport of its own.

Chubu Centrair International Airport (NGO) is the right default for almost everyone. It's the real international gateway for the Nagoya and Mie region, roughly an hour from Suzuka Circuit by car, and well connected by direct and one-transfer international routes from major hubs across Asia, North America, and Europe. From Centrair, the most direct route to the circuit runs the Meitetsu Airport Line into Nagoya Station, then onward via JR and Ise Railway toward Suzuka Circuit Ino Station — or, for race weekend specifically, a direct Kintetsu train to Shiroko Station followed by a short shuttle bus, which most guides flag as the smoothest single connection during the Grand Prix itself.

The second real option is landing in Tokyo instead — specifically Narita (NRT) — and connecting onward by Shinkansen. This makes sense if your flight options into Tokyo are meaningfully better than into Centrair, or if you're building a longer Japan trip around the race and want Tokyo as your entry point regardless. The route itself is straightforward but not fast: Narita Express from the airport into central Tokyo, then a transfer onto a Shinkansen bound for Nagoya. Door to Nagoya Station, budget around three hours including the transfer, and roughly US$54 for the rail portion at standard pricing. From Nagoya Station, the connection onward to Suzuka is the same as the Centrair route.

Neither option is wrong. Centrair is faster and simpler if your flight options support it — one fewer transfer, roughly half the total travel time to Nagoya. Narita via Shinkansen makes sense specifically if it's genuinely the better flight option for your route, or if Tokyo itself is part of the trip. What doesn't make sense is defaulting to Narita purely out of familiarity with Tokyo as Japan's main gateway, when Centrair exists specifically to serve this region and cuts real time off the journey.

Either way, Nagoya Station is where both routes converge, and it's the natural base for the onward trip to Suzuka — covered in its own dedicated experience.`;

const whyItsSpecial = `Most first-time Japan visitors default to Tokyo as the entry point because it's the airport they already know. For a Suzuka trip specifically, that default costs real time — Centrair exists precisely to serve the Nagoya and Mie region, and the difference between a one-hour transfer and a three-hour one adds up on a trip that already has a genuinely involved final leg to the circuit itself.

Knowing both real options, and which one actually fits your itinerary, turns arrival day from a guess into a deliberate choice.`;

const insiderTips = [
  "Check your specific route's pricing and connection quality into both Centrair and Narita before assuming Narita is cheaper just because it's the more familiar name — long-haul fares into Centrair are often comparable, and the time saved on the ground is substantial.",
  "If landing at Narita, book the Narita Express and Shinkansen connection in advance where possible — the transfer at Tokyo Station is straightforward but leaves little slack if your flight lands late.",
];

const whatToAvoid = `Don't assume Narita is the only real option just because it's Japan's best-known international gateway — Centrair (NGO) is the region's actual airport and typically cuts the ground journey to Suzuka by two hours or more. Don't underestimate the NRT-to-Nagoya transfer time when planning race-day arrival — budget the full three hours including the Narita Express and Shinkansen transfer, not just the Shinkansen leg alone.`;

const practicalInfo = {
  hours: "Airport operating hours vary by carrier and terminal — check your specific flight's schedule",
  costRange: "NRT-to-Nagoya rail connection from ~US$54 (Narita Express + Shinkansen); Centrair-to-Nagoya/Suzuka rail costs vary by route — see the Getting to Suzuka experience",
  bookingMethod: "Book international flights into Chubu Centrair (NGO) where your route allows — check fares into Narita (NRT) as a genuine comparison, not a fallback, if Centrair options are limited on your route.",
  website: "https://www.centrair.jp/en/, https://www.narita-airport.jp/en/",
};

const gettingThere = "From Centrair (NGO): Meitetsu Airport Line to Nagoya Station, then onward via JR/Ise Railway or direct Kintetsu to Shiroko + shuttle — see the Getting to Suzuka experience for full detail. From Narita (NRT): Narita Express to Tokyo Station, then Shinkansen to Nagoya Station (~3hrs total, ~US$54), then the same onward connection to Suzuka.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Arriving into Japan — Choosing Your Airport",
      subtitle: "Chubu Centrair is the fast route to Suzuka — Narita plus Shinkansen is the real, slower alternative.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Chubu Centrair International Airport, 1-1 Centrair, Tokoname, Aichi 479-0881, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: rome2rio.com, thef1spectator.com, universalweather.com (Centrair-to-Suzuka route detail, gathered earlier this session), rome2rio.com 'Tokyo Narita Airport (NRT) to Nagoya Station' (NRT-Shinkansen route/pricing, verified 21 Sep 2026). Founder-directed to cover both airport options explicitly.",
      sport: ["formula_one"],
      moodTags: ["planning", "first-timer"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-21",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
