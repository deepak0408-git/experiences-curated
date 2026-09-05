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
const slug = "us-gp-san-antonio-daytrip-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `San Antonio sits about 80 miles south of Austin down I-35, roughly 1 hour 20 minutes without traffic — genuinely doable as a day trip, though rush-hour traffic on this corridor can stretch that closer to two hours, so factor real buffer time either direction. It's the second real day-trip anchor for an Austin GP visit, and a distinctly different one from Hill Country's wine-and-German-heritage trip: this is history and urban texture, not rural scenery.

The Alamo is the obvious starting point, and it's genuinely free to visit — no admission charge for the core site, though a timed entry ticket is required to actually go inside the Church itself, and those tickets go quickly during busy periods, so reserve online before you arrive rather than assuming you can walk up. Open daily 9am-5:30pm, last entry 30 minutes before close. The Alamo Exhibit in the Ralston Family Collections Center runs separately, timed admission starting around $14 per adult, for anyone who wants the deeper historical context beyond the church and grounds.

From the Alamo, the River Walk is a genuine 10-minute walk at a leisurely pace — stairs directly across the street from the Alamo's front lead down to the walkway one story beneath San Antonio's downtown streets. What started as a 21-block stretch has grown into 15 miles of hiking and bike paths along the San Antonio River, lined with restaurants, bars, and hotels at water level — a completely different vantage point on the city than walking the streets above.

Beyond downtown, San Antonio holds Texas's only UNESCO World Heritage Site: the San Antonio Missions, designated 5 July 2015, comprising the Alamo itself (Mission Valero) plus four additional missions — Concepción, San José, San Juan, and Espada — that together form San Antonio Missions National Historical Park. This is the most complete, intact group of Spanish Colonial mission complexes anywhere in the world, and admission to all four park missions is free, no reservations required, with all mission churches open to visitors during regular park hours. It's a real, substantial half-day addition on its own if colonial history genuinely interests you, well beyond what most visitors see if they stop at just the Alamo.`;

const whyItsSpecial = `Fredericksburg and Hill Country give an Austin GP trip a wine-country counterpoint; San Antonio gives it something else entirely — genuine, UNESCO-recognized history layered underneath a lively modern city, all within a single comfortable day trip. The Alamo carries a weight in American and Texan identity that few single buildings anywhere in the country can match, and pairing it with the River Walk's completely different, water-level energy means the day doesn't read as one long history lesson — it's history, then a genuinely different kind of urban experience, in the same afternoon. For visitors who've come to Austin purely for the racing, San Antonio is the clearest single trip that broadens the visit into something with real depth beyond the circuit.`;

const insiderTips = [
  "Book your free Alamo Church timed-entry ticket online before you leave Austin, not on arrival — during any busy weekend, walk-up slots can be gone by the time you get there, even though the ticket itself costs nothing.",
  "If Spanish colonial history genuinely interests you beyond the Alamo itself, budget real extra time for the other four missions in San Antonio Missions National Historical Park — they're free, uncrowded compared to the Alamo, and represent the same UNESCO World Heritage designation without the crowds.",
];

const whatToAvoid = `Don't assume "free admission" means no planning required — the Alamo's Church specifically requires a timed reservation, and treating it as pure walk-up access risks arriving to find same-day slots already gone. Don't budget only an hour each way for the drive without checking current traffic — this I-35 corridor genuinely swings from 1h20 to over 2 hours depending on time of day, and getting this wrong on either the outbound or return leg can eat meaningfully into your day.`;

const gettingThere = `80 miles south of Austin via I-35, roughly 1h20 without traffic, up to 2h+ during rush hour. Driving yourself or a rideshare/private driver are the practical options, no direct rail connection.`;

const practicalInfo = {
  hours: "The Alamo daily 9am-5:30pm, last entry 5pm; River Walk accessible 24/7; Missions National Historical Park sites keep regular daytime park hours",
  costRange: "The Alamo core site free (timed Church entry ticket required, reserve online); Alamo Exhibit from ~US$14/adult; Missions National Historical Park free, no reservation required",
  bookingMethod: "Reserve your free Alamo Church entry ticket online at thealamo.org before you go — they go quickly during busy periods. Missions National Historical Park requires no booking at all.",
  website: "https://www.thealamo.org, https://www.nps.gov/saan",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "San Antonio — the Alamo, the River Walk, and Five Missions",
      subtitle: "80 miles down I-35, a UNESCO World Heritage site, and Texas's most-visited historic landmark",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Downtown San Antonio",
      address: "300 Alamo Plaza, San Antonio, TX 78205",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: thealamo.org (hours, free Church entry ticket requirement, Exhibit pricing ~$14), nps.gov/saan (UNESCO designation date 5 July 2015, 5-mission structure, free admission to park missions), visitsanantonio.com (Missions overview), texasshuttle.com (Austin-San Antonio drive time 1h20 normal / up to 2h+ rush hour, 80 miles via I-35). No Google Maps rating pulled — this is a multi-site day-trip orientation guide (Alamo, River Walk, 4 missions) treated as a single narrative rather than a venue-comparison piece, not multi-venue in the ratings-registry sense. No Concierge trigger. Possible GYG affiliate opportunity for Alamo-adjacent tours noted but not confirmed specifically enough in this pass to flag with confidence — worth a follow-up check. Verified 5 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["history", "day-trip", "culture"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
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
