import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-tmobile-sphere-" + Date.now().toString(36);

const bodyContent = `T-Mobile Zone is the general admission ticket built for people who want race weekend to feel like a festival, not just a motorsport event. It sits beneath the Sphere's Exosphere, looking onto one of the circuit's most technical stretches — T-Mobile Turn 5 and the chicane running through Turns 7 to 9, a genuine braking-and-cornering complex where overtaking attempts actually happen, not just a scenic backdrop.

The 2026 lineup confirms three nights of live performances on the T-Mobile Stage: Two Friends headlining Thursday, Disclosure on Friday, and Sean Paul closing out Saturday, with Natasha Bedingfield, Gorgon City, Ja Rule, Collect 200, and DJ Mandy also on the bill. Saturday night after the race, the inaugural F1 Afterparty brings the Backstreet Boys to the Sphere itself — a genuinely rare pairing of a Grand Prix and an arena-scale pop show on the same night, in the same zone.

A 3-day general admission ticket starts at $809, and it comes with more built in than most standing-room tickets elsewhere on the circuit: food and beverage menus from Wolfgang Puck's team, and for 3-day holders specifically, free water, soft drinks, and food included rather than purchase-only. It's still standing room — there's no assigned seat, and like every general admission zone here, your ticket locks you into T-Mobile Zone for that day rather than letting you roam the wider circuit.

This is the zone to choose over Flamingo if the concert lineup and the festival atmosphere matter as much to your race weekend as the racing itself. The corner action is real and technical, but the Sphere's presence overhead, lit up through the evening sessions, is what makes this specific zone feel different from any other general admission option on the Strip.`;

const whyItsSpecial = `No other Grand Prix on the calendar puts a concert of this scale — Disclosure, Sean Paul, and a Backstreet Boys afterparty inside the world's largest spherical structure — directly next to a technical braking complex where cars are genuinely fighting for position. That combination is what makes T-Mobile Zone worth choosing over a cheaper, quieter general admission option. I'd point anyone treating this as a full weekend trip, not just a race, toward this zone specifically for Friday or Saturday, when the headline sets and the Sphere's lighting turn a standing-room ticket into something closer to a festival with an F1 race attached, rather than the other way around.`;

const insiderTips = [
  "3-day ticket holders get free water, soft drinks, and food included — a real cost saving over Flamingo Zone's purchase-only food and beverage model, worth factoring into the price comparison beyond the ticket's face value.",
  "The Saturday night F1 Afterparty featuring the Backstreet Boys happens inside the Sphere itself after the race — check whether this needs a separate ticket or is bundled with your T-Mobile Zone pass before assuming either way, since bundling details can change closer to the date.",
];

const whatToAvoid = `Don't assume a T-Mobile Zone ticket gets you inside the Sphere's regular concert venue — the T-Mobile Stage and the festival activations sit in the zone outside, in the Sphere's shadow, which is a different thing from the Sphere's own immersive show experiences that run separately year-round. Don't buy this ticket purely for T-Mobile Turn 5 and the Turns 7-9 chicane if a completely clear, quiet racing view is your priority — it's a technical, genuinely exciting stretch of track, but the concert crowd and festival noise around you is part of the package, not something you can opt out of within the zone.`;

const practicalInfo = {
  hours: "Practice Thu 19 Nov, Qualifying Fri 20 Nov, Race Sat 21 Nov 2026 — all sessions run evening into night, Pacific time; T-Mobile Stage performances run each night of the weekend",
  costRange: "3-day general admission from US$809, including 3-day-holder food/drink allowance (2026 pricing)",
  bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under General Admission: T-Mobile Zone. Demand tracks the concert lineup closely — book as soon as headliners are confirmed rather than waiting, since this zone sells on the music as much as the racing.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com/tickets/general-admission/t-mobile-general-admission/, https://www.identity.vegas/t-mobile-stage-f1-las-vegas-2026/",
  reservationsRequired: true,
};

const gettingThere = "T-Mobile Zone entrance, beneath the Sphere near Sands Avenue. Strip road closures begin early afternoon on race days — walk or use the monorail from a nearby Strip hotel rather than driving.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "T-Mobile Zone at Sphere — race weekend's real festival",
      subtitle: "A technical braking complex, the Sphere overhead, and headline acts on the T-Mobile Stage",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "T-Mobile Zone",
      address: "General Admission: T-Mobile Zone, beneath the Sphere, Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from f1lasvegasgp.com official T-Mobile General Admission page, identity.vegas 2026 lineup confirmation (Two Friends, Disclosure, Sean Paul, Backstreet Boys afterparty), and news3lv.com concert series coverage. Verified 29 Aug 2026 — corrected an earlier, less-sourced lineup claim (Zedd/T-Pain) found in initial research; the identity.vegas/news3lv sourcing is more specific and recent.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "social"],
      interestCategories: ["sport", "entertainment"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
