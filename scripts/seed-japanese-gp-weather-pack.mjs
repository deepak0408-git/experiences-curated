// Seed: "Weather & What to Pack for an April Suzuka Weekend" — experience
// #20/20 for Japanese Grand Prix 2027 (Suzuka). Final experience in this batch.
//
// Sources (verified 21 Sep 2026):
// - weatherspark.com "Average Weather in April in Suzuka, Japan"
//   (average high 16.8°C/62.2°F, average low 7.9°C/46.2°F, ~148mm rainfall,
//   ~15 rain days/month, 34% daily rain chance, 49% clear/sunny time)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-weather-pack";

const bodyContent = `Suzuka in early April is genuinely unpredictable, and packing for the average conditions alone will leave you underprepared for a real chunk of the weekend. Based on long-term averages, April in Suzuka runs an average high around 16.8°C (62°F) and an average low around 7.9°C (46°F) — mild by most standards, but that average hides real day-to-day swings, especially across a Friday-to-Sunday span where conditions can shift noticeably.

Rain is the bigger planning factor. Suzuka averages around 148mm of rainfall across the month, spread over roughly 15 rain days — meaning close to half the days in April see some rain, with a daily chance of around 34% on any given day during the month. When it does rain, it's a genuine amount, not a light drizzle — expect real, sustained rain rather than a passing shower on the days it happens. Clear or sunny conditions make up roughly half the month's daylight hours, so plan for a real mix rather than assuming consistent spring sunshine.

What this means for packing: layers are non-negotiable. Mornings and evenings at the circuit, particularly in an open, uncovered grandstand, can sit close to the average low — genuinely cold for several hours if you're dressed for the daytime high alone. A proper waterproof layer isn't optional either, given the real rain probability across three consecutive days — many of Suzuka's grandstands, including popular ones like Q2 and Grandstand G, have no roof at all, so a rain jacket that actually works matters more here than at a covered-seating circuit.

Beyond weather-specific gear, the basics for a long day at a large open venue apply: comfortable, broken-in shoes for a lot of walking and standing, a portable phone charger given how much of the day you'll spend using a phone for navigation and photos, and cash in addition to cards — Japan remains more cash-reliant than many visitors expect, particularly at smaller food stalls and some fan zone vendors.

None of this is complicated, but it's easy to underpack for if you're basing your expectations purely on "spring in Japan sounds mild." The reality at Suzuka specifically, with real rain probability and real temperature swings across a long open-air weekend, rewards genuinely being ready for both sun and rain, not just one or the other.`;

const whyItsSpecial = `A lot of first-time Suzuka visitors pack for a generic mild spring day and get caught out by the reality: real rain odds close to one in three on any given day, temperature swings between morning cold and afternoon mild, and grandstands with no weather protection at all across most of the circuit.

Knowing the actual numbers — not just "it might rain" but roughly how often, and roughly how cold mornings actually run — turns packing from a guess into an informed decision, which matters more here than at circuits with more predictable, single-direction weather.`;

const insiderTips = [
  "Pack a proper waterproof layer, not just a light jacket — Suzuka's April rain, when it happens, tends to be sustained rather than a brief shower, and most grandstands (including popular ones like Q2 and Grandstand G) have no roof at all.",
  "Dress for the morning low, not the afternoon high, if you're arriving early for a session — the gap between Suzuka's average April high and low is wide enough that an early-morning wait in just daytime-weight clothing gets genuinely cold.",
];

const whatToAvoid = `Don't pack based on Suzuka's average high temperature alone — the average low runs close to 8°C (46°F), and a long morning wait for gates or a session in only daytime-weight clothing is a real discomfort, not a minor one. Don't assume cards will cover everything — Japan, including at fan zones and smaller food stalls around Suzuka, remains more cash-reliant than many first-time visitors expect, so carry yen alongside your cards.`;

const practicalInfo = {
  hours: "N/A — weather planning applies across the full Friday-Sunday race weekend",
  costRange: "N/A",
  bookingMethod: "No booking required — this is a packing and planning reference, not a bookable experience.",
};

const gettingThere = "Applies to the full Suzuka Circuit grounds — see the Getting to Suzuka experience for transit detail.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Weather & What to Pack for Suzuka in April",
      subtitle: "Real rain odds close to one in three, and a genuine morning-to-afternoon temperature swing — pack for both.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Suzuka Circuit, 7992 Ino-cho, Suzuka, Mie 510-0295, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Source: weatherspark.com 'Average Weather in April in Suzuka, Japan' (long-term average high/low, rainfall totals, rain-day frequency, verified 21 Sep 2026).",
      sport: ["formula_one"],
      moodTags: ["planning", "practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
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
