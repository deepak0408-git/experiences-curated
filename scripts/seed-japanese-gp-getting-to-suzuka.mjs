// Seed: "Getting to Suzuka — the Nagoya Connection" — experience #11/20 for
// Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - Meitetsu/JR/Ise Railway and Kintetsu-direct-to-Shiroko route detail:
//   sourced earlier this session (WebSearch on Suzuka Circuit nearest
//   international airport, rome2rio/thef1spectator/universalweather)
// - unseen-japan.com, trip.com, en.wikipedia.org/wiki/Suica (transit apps,
//   IC card detail — Suica works nationally including Nagoya region; GO app
//   for ride-hailing, Uber limited)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-getting-there";

const bodyContent = `Nagoya to Suzuka is the leg of the trip most first-timers underestimate. It isn't a quick suburban hop — it's a genuine cross-region rail journey, and race weekend adds crowd logistics on top of the normal route.

There are two real ways to make the trip. The standard route runs the Meitetsu Airport Line or a regular Meitetsu service from Nagoya Station, then a JR Kansai Main Line connection to Yokkaichi Station, followed by the Ise Railway on to Suzuka Circuit Ino Station — roughly ninety minutes door to door outside race weekend, longer with connections during it. The second option, and the one most guides recommend specifically for race weekend, is a direct Kintetsu train from Nagoya to Shiroko Station, followed by a shuttle bus for the final five kilometres to the circuit. During the Grand Prix, JR and Ise Railway also run a joint direct express service — the Suzuka Grand Prix limited express — cutting the journey to around an hour with no transfers, when it's running.

Whichever route you take, build in real buffer time on race day specifically. Every train and shuttle on these lines runs at capacity during the Grand Prix weekend, and a missed connection on a day with a fixed session start time is a genuinely bad way to begin your visit. Locals and repeat visitors consistently recommend leaving earlier than feels necessary on Friday, Saturday, and especially Sunday.

For getting around once you're in Japan more broadly — Nagoya, the circuit, day trips — a Suica IC card is worth setting up before you need it. It works nationally, including on the Nagoya-region network, covers trains, buses, and most convenience store purchases, and can be loaded and topped up through Apple Pay or Google Wallet before you've even landed, which avoids a ticket-machine queue on your first day. For route planning across an unfamiliar rail network, Google Maps handles most journeys reliably, and NAVITIME (available as its own app, with a dedicated Aichi Prefecture/Nagoya coverage area) gives more Suzuka-specific routing detail if Google Maps' suggestion looks uncertain. For ride-hailing, GO is the most widely used app in Japan and a genuine option in Nagoya; Uber operates in the country but with more limited coverage, so don't assume it'll be your fallback everywhere.

None of this is complicated once you've done it once. The point is not discovering the real journey time on the morning of the race.`;

const whyItsSpecial = `The gap between "Nagoya is the base for Suzuka" and actually knowing how to make that journey is where a lot of race weekends go wrong — not through any fault of the circuit, but through underestimating a rail connection that looks simple on a map and isn't quite as simple in practice, especially at capacity on race day.

Knowing the real route options, the direct express when it's running, and having a Suica card already loaded before you land removes the one part of the day that could otherwise cost you time you don't have before a session with a fixed start.`;

const insiderTips = [
  "Check whether the Suzuka Grand Prix limited express (the joint JR/Ise Railway direct service) is running on your specific travel day — when it is, it cuts the Nagoya-to-circuit journey to about an hour with no transfers, a genuine improvement over the standard connecting route.",
  "Load a Suica IC card onto Apple Pay or Google Wallet before you land — it works nationally including the Nagoya region, and skipping the ticket-machine queue on your first day in an unfamiliar station is worth doing in advance.",
];

const whatToAvoid = `Don't cut it close on race-day timing — every train and shuttle on the Nagoya-Suzuka route runs at capacity during the Grand Prix weekend, and a missed connection on a day with a fixed session start is a real risk, not a remote one. Don't assume Uber is a reliable fallback everywhere in the region — its Japan coverage is genuinely limited outside major cities, and GO is the app with the wider real footprint for ride-hailing near Suzuka.`;

const practicalInfo = {
  hours: "Rail services run per standard Japan rail timetables — race-weekend-specific direct express schedules published closer to the event",
  costRange: "Standard rail fares apply — a Suica-loaded journey from Nagoya to Suzuka Circuit Ino Station runs a modest local rail fare, typically well under ¥2,000 one way",
  bookingMethod: "No advance booking required for standard rail routes. Set up a Suica IC card via Apple Pay/Google Wallet before travel for the smoothest experience.",
  website: "https://www.meitetsu.co.jp/eng/, https://japantravel.navitime.com/en/area/jp/railroad/00000244/",
};

const gettingThere = "From Nagoya Station: Meitetsu/JR/Ise Railway via Yokkaichi to Suzuka Circuit Ino Station (~90 min standard), or direct Kintetsu to Shiroko Station + shuttle bus (~5km to circuit) — the recommended race-weekend route. Watch for the joint JR/Ise Railway direct express during the Grand Prix, cutting the journey to ~1hr with no transfers.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Suzuka — the Nagoya Connection",
      subtitle: "The real rail route from Nagoya, the race-weekend direct express, and which transit apps actually work.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Suzuka Circuit Ino Station, Suzuka, Mie, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: rome2rio.com, thef1spectator.com, universalweather.com (Nagoya-Suzuka route detail, gathered earlier this session), unseen-japan.com, trip.com, Wikipedia Suica (transit apps and IC card detail, verified 21 Sep 2026).",
      sport: ["formula_one"],
      moodTags: ["planning", "first-timer"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
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
