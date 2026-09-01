import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-red-rock-canyon-" + Date.now().toString(36);

const bodyContent = `Red Rock Canyon is less than 30 minutes from the Strip, and it's a genuinely different Las Vegas from the one the circuit runs through — red sandstone cliffs, desert scrub, and quiet, instead of neon and engine noise. For anyone arriving a day or two before race week starts, it's the clearest way to see a side of the city most race visitors never bother with.

The 13-mile Scenic Drive is the easiest way to take it in, and it requires a timed entry reservation for any entry between 8am and 5pm from October 1 through May 31 — which covers the entire Las Vegas Grand Prix window in November. Reservations cost $2 plus a $15 vehicle entrance fee, valid for 7 days, booked through Recreation.gov. No reservation is needed before 8am or after 5pm, which is worth knowing if an early start works better with your schedule anyway.

There are 26 different hikes and trails covering everything from short canyon walks to serious elevation gain toward the highest points in the conservation area. The Pine Creek Canyon, Knoll, and Fire Ecology Loop is the most consistently well-reviewed of them, praised specifically for its variety within a single manageable route. November's mild daytime temperatures make it one of the more comfortable months to hike here, well outside the extreme summer heat that makes midday hiking genuinely dangerous other times of year.

The Visitor Center, open daily 8am-4:30pm, is worth a stop before heading out on the drive or a trail — it's the best source of current trail conditions and a good orientation point if you haven't visited before.`;

const whyItsSpecial = `Vegas sells itself entirely on being built, engineered, artificial in the best sense — every hotel a recreation of somewhere else, every light manufactured. Red Rock Canyon is the opposite of everything the Strip is doing, and less than half an hour away. I'd point anyone building in a full day before race week starts toward this specifically because it resets what "impressive" means before three days of manufactured spectacle — coming back to the Strip's neon after a morning in real desert silence makes both places land harder than seeing only one of them would.`;

const insiderTips = [
  "November's mild temperatures mean the timed-entry reservation system is genuinely necessary — this isn't summer's dangerous heat window, so demand for the Scenic Drive stays high year-round in the cooler months, and reservations can fill up days ahead during a busy week like race week.",
  "Entry before 8am or after 5pm doesn't require a timed reservation at all — if an early start suits your schedule better than booking a specific slot, arriving right at opening skips the reservation system entirely.",
];

const whatToAvoid = `Don't show up without a Recreation.gov reservation expecting to drive the Scenic Drive between 8am and 5pm — the timed entry system is enforced, not a suggestion, and arriving without one during the reservation window can mean being turned away entirely. Don't treat this as a full-day trip if you're tight on time before race week — the Scenic Drive itself takes roughly an hour without stops, and a half-day visit covering the drive plus one shorter trail is a realistic, satisfying visit without eating into an entire day you might want for the Strip.`;

const practicalInfo = {
  hours: "Visitor Center daily 8am-4:30pm; Scenic Drive Nov-Feb 6am-5pm (timed entry required 8am-5pm)",
  costRange: "US$2 reservation fee + US$15 vehicle entrance fee (valid 7 days)",
  bookingMethod: "Book timed entry via recreation.gov or by calling (877) 444-6777, required for Scenic Drive entry 8am-5pm during the November race window.",
  howToBook: "",
  website: "https://www.redrockcanyonlv.org, https://www.recreation.gov/timed-entry/10075177",
  reservationsRequired: true,
};

const gettingThere = "Roughly 30 minutes by car west of the Strip via NV-159/Charleston Blvd. No public transit runs directly to the Visitor Center — a rental car, rideshare, or guided tour is required.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Red Rock Canyon — the Half-Day Desert Escape",
      subtitle: "Real desert silence 30 minutes from the Strip — timed entry required for November",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Red Rock Canyon",
      address: "Red Rock Canyon National Conservation Area, 1000 Scenic Loop Dr, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from redrockcanyonlv.org official visitor info and timed-entry pages, BLM.gov, and visitredrock.com visitor guide. Google rating via Places API (New) direct lookup 29 Aug 2026: Red Rock Canyon Visitor Center 4.8/5,931 reviews — well-attested. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["nature", "value"],
      interestCategories: ["outdoors"],
      pace: "moderate",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
      googleMapsRating: "4.8",
      googleMapsReviewCount: 5931,
      googleMapsUrl: "https://maps.google.com/?cid=2830161353497855433",
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
