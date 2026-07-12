import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "a-day-in-budapest-" + Date.now().toString(36);

const bodyContent = `The Hungaroring is 25 minutes from central Budapest, close enough that skipping the city entirely for a Hungaroring trip would be a genuine waste. A single day is enough to cover the essentials, provided you start early and cross the river in the right order.

Begin on the Buda side, at Castle Hill, before the crowds arrive. Fisherman's Bastion is free to walk in the early morning and gives the best panoramic view over the Danube and the Parliament building on the opposite bank, a fairytale-looking terrace that gets considerably more crowded, and partly paid, later in the day. Matthias Church sits right beside it, Neo-Gothic, with a colourful Zsolnay-tile roof and frescoes covering centuries of Hungarian history inside. From here it's a short walk to Buda Castle itself, home to the Hungarian National Gallery and the Budapest History Museum, both open Tuesday to Sunday, 10am to 6pm.

Take the funicular down to St. George Square rather than walking, it's a 90-second ride on a steep, glass-walled cabin with views of the Chain Bridge and Parliament as you descend, though queues run 20-40 minutes at peak midday hours, so time it for earlier or later in the day. Cross the Chain Bridge into Pest and head for the Hungarian Parliament Building. You cannot visit independently, entry is guided tour or audio-guide only, tours run around 45 minutes, and tickets sell out fast in high season, book online before you arrive rather than hoping to walk up.

Finish along the Danube waterfront, or with a sunset river cruise if timing allows, the illuminated Parliament building from the water, or from the lower terraces of Fisherman's Bastion after dark, is the version of Budapest most people actually remember.`;

const whyItsSpecial = `A Hungaroring trip built entirely around the circuit misses the reason Budapest is worth the flight in the first place. This isn't a token add-on itinerary, it's the specific, sourced sequence that works: Castle Hill early to beat the crowds, the funicular timed around its own queue patterns, Parliament booked ahead because walk-up tickets simply don't exist in high season. Twenty-five minutes from the Hungaroring is close enough that not doing this would be leaving most of the trip's actual value unclaimed.`;

const insiderTips = [
  "Book Hungarian Parliament tickets online before you arrive, independent visits aren't allowed and same-day tickets routinely sell out in July.",
  "Visit Fisherman's Bastion before 9am if possible, it's free and largely empty at that hour, the paid upper terraces and crowds build fast once tour groups arrive.",
];

const whatToAvoid = `Don't try to fit this in as an afternoon add-on around a Hungaroring session, the Parliament tour alone needs advance booking and a fixed time slot, and the funicular queues plus castle district walking easily fill a full day on their own.`;

const practicalInfo = {
  hours: "Buda Castle attractions: Tue-Sun 10am-6pm (last entry 5:30pm); Funicular: 9am-7pm (9pm Jun-Sep); Parliament tours: various slots, book ahead",
  costRange: "Fisherman's Bastion lower terraces free, upper terraces small fee; Parliament guided tour from approx. €15-25pp; funicular small one-way fee",
  bookingMethod: "Book Hungarian Parliament tickets online in advance via the official Parliament visitor site or a reputable platform, this is the one non-negotiable reservation for the day. Everything else (Fisherman's Bastion, Matthias Church, Castle district) can be done on arrival.",
  website: "https://www.parlament.hu/en/web/house-of-the-national-assembly/visitor-centre",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "A Day in Budapest — Castle Hill to Parliament",
      subtitle: "25 minutes from the Hungaroring: Fisherman's Bastion, Buda Castle, the funicular, and the Parliament tour.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Castle Hill / Parliament, Budapest",
      address: "Castle Hill, Budapest, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Central Budapest, reachable by M2 metro (Batthyány tér for Castle Hill funicular access) or a short walk/tram from most Pest hotels.",
      editorialNote: "Sources: bontraveler.com/budapest-itinerary, thecommonwanderer.com/blog/fishermans-bastion-budapest, storyhunt.io/en/articles/hungarian-parliament-building, gozeppelintours.com/en/buda-castle-funicular, budacastlebudapest.com/open. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["iconic", "historic", "scenic"],
      interestCategories: ["sightseeing"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
