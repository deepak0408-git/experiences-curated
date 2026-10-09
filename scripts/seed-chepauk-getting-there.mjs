import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "chepauk-getting-there-" + Date.now().toString(36);

const bodyContent = `Chepauk is, refreshingly after Nagpur's out-of-town stadium, genuinely walkable from central Chennai. Triplicane is about 639 metres away, a 9-minute walk, and Marina Beach is even closer to the ground than that. If you're staying anywhere in this part of the city, you may not need transport at all.

For everyone else, Chepauk MRTS station is a 2-minute walk from the stadium, which makes the suburban rail line the single most direct option if your hotel sits along it. The nearest full metro station is Government Estate, on the Blue Line, about 10-15 minutes away by auto-rickshaw or taxi once you're off the train, so it's not quite door-to-door the way the MRTS station is, but it's a genuine option if you're coming from elsewhere on the metro network.

MTC city buses also run close to the ground; several routes (12G, 25, 27B, 40A, 40L, and M45E among others) stop near Chepauk, and fares are a fraction of a taxi if you don't mind the extra planning. On matchday, though, most visiting fans default to auto-rickshaw or Ola/Uber simply because they're available throughout the day and don't require knowing the local bus network in advance.

The practical takeaway: unlike Nagpur, where transport planning is a real logistical exercise, Chepauk rewards choosing a hotel in Triplicane, Mylapore, or anywhere near Marina Beach and simply walking or taking a short auto-rickshaw ride. It's one of the more fan-friendly grounds in India for exactly this reason.`;

const whyItsSpecial = `A lot of India's Test venues sit some distance from where visitors actually stay, Nagpur's Jamtha being the clearest example in this pack. Chepauk is the opposite case, and it changes the whole rhythm of a matchday. Being able to walk from a hotel near Marina Beach, watch a full day's play, and walk back for dinner without factoring in a stadium-adjacent traffic plan is a genuinely different, more relaxed way to follow five days of Test cricket than the alternative.`;

const insiderTips = [
  "If your hotel is anywhere near the Chepauk MRTS line, take the suburban train over a taxi on matchday — the station is a 2-minute walk from the ground, and it sidesteps the road congestion that builds up around the stadium once a session lets out.",
  "Staying in Triplicane or near Marina Beach means you can walk to the ground in under 10 minutes — worth prioritizing over a marginally cheaper hotel further out if you want zero matchday transport stress.",
];

const whatToAvoid = `Don't assume the metro is your fastest route just because it's the biggest network in the city — Government Estate station is still a 10-15 minute auto-rickshaw ride from the ground, whereas the MRTS suburban line drops you at Chepauk's own station, 2 minutes on foot. Don't try to drive yourself into the immediate stadium area on a matchday — the roads around Chepauk get heavily restricted for crowd control, and a walk-in or auto-rickshaw approach from a few streets back is far more reliable than trying to park close.`;

const gettingThere = `On foot: 9 minutes from Triplicane, 11 minutes from Marina Beach. By rail: Chepauk MRTS station, a 2-minute walk from the ground. By metro: Government Estate (Blue Line), then a 10-15 minute auto-rickshaw or taxi. By bus: several MTC routes stop nearby.`;

const practicalInfo = {
  bookingMethod: "No booking needed — MRTS trains, MTC buses, and auto-rickshaws/taxis all run on demand throughout the day.",
  costRange: "MRTS/bus fares are a few dozen rupees; auto-rickshaw or ride-share fares from central Chennai typically run ₹100-250 depending on distance and traffic",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Chepauk — Triplicane & Chennai Beach Station",
      subtitle: "Walkable from Marina Beach, a 2-minute walk from its own MRTS stop — Chepauk is the easy one.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Chepauk",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: TravelJanah, Moovit transit guides, Rome2Rio, HECT India Chepauk station guide. Transit/logistics piece — no single rateable venue.",
      sport: ["cricket"],
      moodTags: ["logistics", "transit", "walkable"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
