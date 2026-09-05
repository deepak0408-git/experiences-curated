import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-zilker-barton-springs-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Zilker Metropolitan Park is Austin's oldest metropolitan park, more than 350 acres right in the middle of the city, and it functions as the genuine backyard for a huge chunk of Austin's outdoor life — the Zilker Botanical Garden, the Austin Nature and Science Center, the Butler Hike and Bike Trail connecting to Lady Bird Lake, and the Barton Creek Trail, a 13-mile path running from the park toward the Lady Bird Johnson Wildflower Center. This is also the site of Austin City Limits Music Festival every October, so the grounds carry a real cultural weight beyond just being a nice green space.

At its center sits Barton Springs Pool, a three-acre natural spring-fed pool that's been meaningful to this land long before Austin existed as a city — the Tonkawa people performed purification rituals in these waters, Spanish explorers built missions nearby in the 1700s before moving on to San Antonio, and in 1837 "Uncle Billy" Barton named the springs after his three daughters, Pathenia, Eliza, and Zenobia. What makes it a genuine year-round destination rather than a summer-only stop is the water itself: fed by underground springs at a constant 68-70°F, cold enough to feel genuinely refreshing on a hot day, comfortable enough to swim in through most of the year — including late October, when Austin's own air temperature can still be pushing into the 80s or 90s.

Admission runs $5 for resident adults, $9 for non-residents, with children $2-4 — genuinely inexpensive for what it is. It's open daily 5am-10pm, with one recurring closure worth knowing about: Thursdays 9am-7pm, when the pool shuts for routine cleaning. It can also close on occasion due to flooding or elevated bacterial counts after heavy rain, so check the current status before making a special trip if there's been recent weather.

For anyone splitting time between race sessions, Zilker Park works as a genuine half-day or full-day break from the circuit — walk the trails, swim in water that's the same temperature whether it's July or October, and see the actual green heart of the city that most F1 visitors never get to beyond COTA and downtown.`;

const whyItsSpecial = `Most host cities give visitors a choice between the event and generic sightseeing. Barton Springs is neither — it's a genuine, centuries-deep piece of Austin's actual history that happens to also be one of the most pleasant things to do in the city on a warm day, which late October in Austin still regularly is. Swimming in water this old, named by a settler for his own daughters nearly two centuries ago, in a pool the local Tonkawa people used for ritual purification long before that, gives a race weekend a genuine sense of place that a grandstand seat, however good, simply can't provide on its own.`;

const insiderTips = [
  "The water sits at a constant 68-70°F year-round — bring a towel and expect a genuinely cold first few seconds even on a warm October day, since the spring-fed temperature doesn't track the season the way a normal pool would.",
  "Avoid planning a Thursday morning visit specifically — the pool closes 9am-7pm every Thursday for routine cleaning, a recurring closure that catches first-time visitors who don't check the schedule.",
];

const whatToAvoid = `Don't assume the pool is guaranteed open if Austin's had heavy rain recently — flooding or elevated bacterial counts can force a closure with little advance notice, so check current status online rather than just showing up. Don't treat Zilker Park as "just the pool" — the 350-acre park includes a botanical garden, nature center, and multiple trail systems worth exploring even if swimming isn't your priority, and limiting your visit to Barton Springs alone misses most of what the park actually offers.`;

const gettingThere = `A short rideshare or drive from downtown Austin and South Congress. Limited on-site parking, so factor in a short walk or rideshare drop-off during busy periods.`;

const practicalInfo = {
  hours: "Daily 5am-10pm; closed for cleaning Thursdays 9am-7pm; can close occasionally due to flooding or water-quality issues after heavy rain",
  costRange: "US$5 resident adult / US$9 non-resident adult per day; children US$2-4; season passes from US$190/yr for adult residents (pricing effective 21 March 2026)",
  bookingMethod: "No booking needed — pay admission at the gate. Check the pool's current open/closed status online before visiting if there's been recent heavy rain in the area.",
  website: "https://www.austintexas.gov/services/visit-barton-springs-pool",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Zilker Park & Barton Springs Pool — Austin's Backyard",
      subtitle: "A 68-70°F natural spring-fed pool inside 350 acres of Austin's oldest park",
      slug,
      experienceType: "natural_wonder",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Zilker",
      address: "2201 Barton Springs Rd, Austin, TX 78704",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: austintexas.gov Visit Barton Springs Pool + Zilker Metropolitan Park pages (hours, Thursday closure, 350-acre size, park facilities), afar.com Finding Soul and Spirit in Austin's Barton Springs Pool (Tonkawa purification ritual history, Spanish mission history, 1837 Uncle Billy Barton naming story), austintexasthings.com (confirmed 2026 pricing effective 21 March 2026 — $5/$9 resident/non-resident, treated as confirmed current pricing per skill §2d, dated and specific). Single-venue treatment — Barton Springs Pool is the clear rateable subject, Zilker Park is context/setting, not a second rated product. No Concierge trigger, no affiliate opportunity (public pool admission). Google Places API lookup: real result (4.6/10,898). Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 10898,
      googleMapsUrl: "https://maps.google.com/?cid=15032728158396951206&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["outdoors", "history", "family-friendly"],
      interestCategories: ["outdoors", "culture"],
      pace: "slow",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
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
