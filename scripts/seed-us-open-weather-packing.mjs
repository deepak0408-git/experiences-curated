import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open 2026
const slug = "us-open-weather-packing-" + Date.now().toString(36);

const bodyContent = `The US Open runs through the tail end of a New York summer, and the honest description is hot and humid rather than genuinely dangerous — but the humidity is the part most visitors underestimate. Late August afternoon highs typically sit in the low-to-mid 80s°F, cooling to upper 70s by early September, with overnight lows in the mid-to-upper 60s. Days hitting 90°F or above happen roughly once in an average early September, and when they do, the combination of direct sun and no shade on most outer courts makes it feel considerably hotter than the number suggests.

Rain is the real wildcard, not the heat. Afternoon thunderstorms are a genuine, recurring feature of a New York late summer, and the tournament has dealt with real rain disruption in multiple recent years — the 2011 men's final was pushed back a full day, and 2021's remnants of Hurricane Ida caused delays serious enough to shift matches between stadiums mid-match. Arthur Ashe and Louis Armstrong Stadiums both have retractable roofs, but they are not equally weatherproof: Armstrong's roof, added in 2018, is naturally ventilated by design, with intentional gaps left for air circulation — functional for cooling, but it means rain can genuinely blow in sideways during a hard storm, which happened during Hurricane Ida's remnants in 2021 and forced a match to relocate to Ashe mid-way through. Ashe's roof seals more completely. If you're choosing between a ticket at either stadium on a day with real rain in the forecast, that's a genuine, practical difference, not a coin flip.

The outer courts have no roof at all, so any real rain stops play there outright until it clears — spectators shelter under the concourse overhangs or move into one of the two covered stadiums if they can. This is worth knowing if your ticket is for general-admission outer-court seating specifically: a rain delay there is a real, open-ended wait, not a 15-minute pause.`;

const whyItsSpecial = `Most tournament weather guides are really just packing lists with a thermometer reading attached, and that misses the one fact that actually changes how a US Open day goes: which stadium you're sitting in matters more than the forecast does. A spectator with an Ashe ticket and one with an Armstrong ticket can live through the exact same storm completely differently — one stays dry under a sealed roof, the other watches wind push rain through deliberate ventilation gaps that were built for airflow, not waterproofing. That's a genuinely counterintuitive fact for anyone who assumes "retractable roof" means the same thing at both buildings. New York's late-summer humidity is the duller, more predictable half of this story — real, worth planning for, but not the part that changes your actual experience of a rainy day at the grounds. The roof gap is.`;

const insiderTips = [
  "If real rain is forecast and you have a choice between an Armstrong and an Ashe ticket for the same day, Ashe's roof seals more completely — Armstrong's naturally-ventilated design (added 2018) has let wind-driven rain through during serious storms before, most notably during Hurricane Ida's remnants in 2021.",
  "Metal and plastic water bottles up to 24oz are the one specific exception to the US Open's otherwise strict one-bag policy — bring one rather than buying water on-site repeatedly across a long, humid day.",
];

const whatToAvoid = `Don't assume a stadium roof means guaranteed shelter from any rain — the roofs close for genuinely heavy weather, but a routine summer shower often isn't enough to trigger closure, and you'll still be sitting through it under an open sky on a borderline day. Don't plan a whole day around outer-court general admission seating without a backup plan for a rain delay — those courts have zero weather protection, and a real storm can mean an open-ended wait with nowhere nearby to sit it out comfortably.`;

const practicalInfo = {
  bookingMethod: "No booking required. Check a live forecast within a day or two of your visit — seasonal averages are normals, not a forecast — and bring a compact umbrella and a water bottle under 24oz regardless, since that's the one bag exception the US Open's bag policy allows.",
  website: "https://www.usopen.org",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Weather at the US Open — Heat, Humidity, and the Roof Gap",
      subtitle: "Low 80s and real humidity, with one stadium's roof more rain-proof than the other",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Flushing Meadows-Corona Park, Queens",
      address: "USTA Billie Jean King National Tennis Center, Flushing Meadows-Corona Park, Queens, NY 11368",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      editorialNote: "Sourced from Weather.com US Open coverage, ESPN (Armstrong roof/Hurricane Ida), currentresults.com (NY climate normals), freetoursbyfoot.com. Verified 5 Oct 2026.",
      googleMapsReviewCount: null,
      sport: ["tennis"],
      moodTags: ["practical", "planning"],
      interestCategories: ["event-logistics"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
