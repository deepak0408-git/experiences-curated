import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "where-to-stay-nagpur-" + Date.now().toString(36);

const bodyContent = `Nagpur splits fairly cleanly into two useful bases for a Test match trip: the Wardha Road corridor, which runs most of the way out toward Jamtha and the stadium, and Ramdaspeth/Civil Lines, the actual centre of the city with better restaurants and a shorter drive into everything else Nagpur has.

Radisson Blu Hotel, Nagpur sits on Wardha Road itself, which puts it meaningfully closer to the stadium than a city-centre hotel while still being a proper full-service property, pool, multiple restaurants, a spa, the works. For a Test match trip where you're making the Jamtha run more than once, cutting 10-15 minutes off the drive each way adds up fast. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3157331838773969147)

Le Méridien Nagpur is further out again, near MIHAN, which is inconvenient for the city centre but genuinely useful if you're flying in and out multiple times during the six-week series and want to minimise airport transfers. It's a proper five-star build with the brand's usual polish, and it draws the largest, most consistent review base of any hotel option in the city. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2129664771302902190)

Hotel Centre Point, in Ramdaspeth, is the pick if you'd rather be based in the actual city than out along the highway. It's central enough to walk to a decent range of restaurants, has a strong, well-attested rating from a large review base, and accepts that a slightly longer stadium commute is the tradeoff for being somewhere with an actual street life around it after play ends. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9251733781125885513)`;

const whyItsSpecial = `Nagpur doesn't have an obvious "stay near the ground" answer the way a city with a stadium in its centre does, Jamtha is genuinely out on its own, so the real decision here isn't which hotel is best in the abstract, it's whether you'd rather shave time off the Test-match commute or have somewhere worth coming back to in the evening. Both are legitimate answers for a Test that runs five sessions a day for up to five days. Picking based on proximity alone, without weighing what you're giving up in the city itself, is the mistake worth avoiding.`;

const insiderTips = [
  "If you're flying in and out of Nagpur more than once across the six-week series, weigh a MIHAN-side hotel like Le Méridien against the extra minutes it costs you to reach the city centre for meals — it's a real tradeoff, not a free upgrade.",
  "Wardha Road hotels (Radisson Blu and similar) sit on the same road you'll be driving to the stadium anyway, so matchday traffic building up on that corridor affects your hotel's own access too, not just the final stretch to Jamtha.",
];

const whatToAvoid = `Don't book purely on stadium distance without checking what's actually around the hotel — some of the closest options to Jamtha are functional but isolated, with little within walking distance for the hours between sessions and dinner. Don't assume Ramdaspeth's central location means a short matchday commute either; it's a genuinely longer drive to Jamtha than the Wardha Road hotels, easily adding 15-20 minutes each way over a five-day Test.`;

const gettingThere = `Radisson Blu and Le Méridien both sit on or near Wardha Road, the same corridor leading to VCA Stadium; Hotel Centre Point is in Ramdaspeth, closer to Nagpur's centre but further from the ground.`;

const practicalInfo = {
  bookingMethod: "Book directly through each hotel's own site or a major aggregator (Booking.com, MakeMyTrip) — expect India-Australia Test dates to push rates up and availability down as the fixture approaches.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Nagpur for the Test",
      subtitle: "Wardha Road cuts your stadium commute; Ramdaspeth gives you an actual city to come back to.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Wardha Road / Ramdaspeth",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Multi-venue accommodation piece — 3 named hotels, each with a real Google Places API rating lookup (Radisson Blu 4.3/25,130; Le Méridien Nagpur 4.2/8,416; Hotel Centre Point 4.3/14,471), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["where-to-stay", "hotels"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "INR",
      bestSeasons: ["jan"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

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
