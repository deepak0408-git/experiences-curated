import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "vca-getting-there-" + Date.now().toString(36);

const bodyContent = `Three real ways into the ground, and they suit different situations. If you're flying straight in, Dr. Babasaheb Ambedkar International Airport is genuinely close, only about 10km from the stadium, closer than Nagpur's own railway station is. The prepaid taxi counter in arrivals runs roughly ₹300-400 to Jamtha, and on a matchday morning that's usually the fastest option if your flight lands within a few hours of the first ball.

If you're coming from Nagpur Junction railway station instead, the stadium is about 15km away via Wardha Road or the newer Ring Road, and a pre-booked Ola, Uber, or auto-rickshaw covers it in 25-35 minutes on a normal day. That timing assumes normal traffic, not matchday traffic, which is a different thing entirely (see the avoid-tip on this).

The metro option is worth knowing but comes with an honest caveat: Khapri is the nearest station, roughly 6km from the ground, and it's genuinely useful if you're already staying somewhere along the metro's Aqua Line, since fares from Khapri run about ₹10-55 depending on where you board. But it's not a door-to-door option. You still need an auto-rickshaw or a short cab ride for the last stretch, and most drivers know exactly where to take you on matchday because they're doing that exact run all day.

Driving yourself is the least recommended option unless you have a strong reason to. Parking exists at the stadium, but it fills early on a big fixture, and if you're not out ahead of the crowd once play ends, the exit queue can eat a genuinely long chunk of your evening. For a five-Test series, the honest advice is: pick a taxi or ride-share for a normal day of play, and for anything you suspect will be busy (weekend sessions, a potential result day), leave earlier than the timings above suggest and build in slack.`;

const whyItsSpecial = `Nagpur, more than Chennai or Ahmedabad in this pack, is a city where getting the transport plan wrong genuinely costs you part of a session, because Jamtha sits well outside the centre with no dense, walkable transport corridor around it the way an inner-city ground would have. The three routes here aren't interchangeable options with the same tradeoffs. They're suited to three different starting points, airport, railway station, or a stay along the metro line, and picking the wrong one for your actual situation is a common, avoidable way to miss the toss.`;

const insiderTips = [
  "If your flight lands the morning of a Test, the airport-to-stadium prepaid taxi (~₹300-400, about 10km) is genuinely faster than routing through the railway station side of town, even if your hotel is downtown.",
  "Auto-rickshaw drivers around Khapri metro station know the Jamtha run well on matchdays — flag one at the station exit rather than trying to pre-book a cab to meet you there.",
];

const whatToAvoid = `Don't rely on the 25-35 minute drive-time estimate from Nagpur Junction on an actual matchday — that figure assumes normal traffic, and stadium-bound traffic management for an India-Australia fixture routinely adds well beyond that. Don't drive yourself unless you're prepared to leave well before the close of play — the exit queue from stadium parking after a big session can run long, and a rideshare or auto-rickshaw gets you clear of it faster.`;

const gettingThere = `By air: ~10km from Dr. Babasaheb Ambedkar International Airport, ₹300-400 prepaid taxi. By rail: ~15km from Nagpur Junction via Wardha Road or the Ring Road, 25-35 minutes normal traffic. By metro: nearest station is Khapri (~6km away), then auto-rickshaw or taxi for the final stretch.`;

const practicalInfo = {
  bookingMethod: "No booking needed — prepaid taxi counters, ride-share apps (Ola/Uber), and auto-rickshaws all operate on demand around the airport, railway station, and Khapri metro stop.",
  costRange: "₹10-55 by metro to Khapri; ₹300-400 airport prepaid taxi; standard city rideshare fares from the railway station",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to VCA Jamtha — Khapri Metro & Wardha Road",
      subtitle: "Three real routes into the ground, and which one actually fits your matchday morning.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jamtha",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Cabbazar Nagpur airport taxi rates, Nagpur Metro fare calculator/Khapri metro station data, ixigo airport info. Transit/logistics piece — no single rateable venue.",
      sport: ["cricket"],
      moodTags: ["logistics", "transit"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "INR",
      bestSeasons: ["jan"],
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
