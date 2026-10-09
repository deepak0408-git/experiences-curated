import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open
const slug = "nyc-museums-day-trip-" + Date.now().toString(36);

const bodyContent = `Most US Open visitors never realize there's a real museum sitting inside Flushing Meadows-Corona Park itself — the Queens Museum, a short walk from the same Mets-Willets Point stop the tennis uses, no separate trip required. Its signature piece is the Panorama of the City of New York, a 9,335-square-foot scale model of all five boroughs built by Robert Moses for the 1964 World's Fair and still regularly updated — genuinely one of the more surreal things to see in the city, a tabletop version of the skyline you can walk around the edge of in minutes. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=252444170725860070) Admission is $8 for adults, and the museum is closed Monday and Tuesday, open Wednesday through Sunday.

For the full New York museum trip, the Metropolitan Museum of Art and the Museum of Modern Art are both real subway rides away, not day trips — worth knowing the actual route rather than guessing. From the 7 train, transfer at Grand Central to an uptown 4 or 5 express for the Met, or transfer at Court Square to the E or M for MoMA; neither connection involves backtracking, and both run under an hour door to door from Flushing. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4264808743088595450) The Met is the largest, most encyclopedic art museum in the Americas — genuinely a full day if you try to see everything, though most visitors pick two or three wings and spend two to three hours. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16906389583988522837) MoMA is the sharper pick if modern and contemporary work — Van Gogh's Starry Night, Warhol, the full 20th-century canon — is more the point than ancient Egypt or European old masters.

The admission detail worth knowing before you go: the Met's pay-what-you-wish pricing only applies to New York State residents and NY/NJ/CT students — almost every visiting US Open fan pays the full, fixed $30 adult admission instead. MoMA runs the same $30 adult rate daily, with free entry for New York State residents specifically during UNIQLO Friday Nights, roughly 5:30-8:30pm. Neither museum discount helps a typical out-of-town Open visitor, so budget the full price rather than count on a loophole that doesn't apply.

Both Manhattan museums are closed one day a week — the Met on Wednesdays, worth checking before building a rest day around it. MoMA has no weekly closure and runs later on Fridays (until 8:30pm), which makes it the better pick for an evening after a day session rather than a dedicated full day.`;

const whyItsSpecial = `Most Grand Slam day-trip writing treats the surrounding city as an afterthought — a list of landmarks to glance at between matches. The honest version of a New York museum day is that it's genuinely one of the best reasons to extend a US Open trip, not a consolation activity for a rained-out session. What makes it worth a dedicated piece rather than a line in a broader city guide is the real tension between convenience and ambition: the Queens Museum sits close enough to visit between a morning practice session and an afternoon match, no real detour required, while the Met and MoMA are worth the full subway trip on their own terms, a reason to build an entire non-tennis day around. Treating these as the same kind of recommendation would undersell both. One is a genuine five-minute detour; the other is the kind of trip people fly to New York for independent of any tennis at all.`;

const insiderTips = [
  "The Met's pay-what-you-wish pricing doesn't apply to most visiting US Open fans — only NY, NJ, and CT residents/students qualify, with ID checked at the desk — so budget the full $30 rather than count on the discount you may have heard about.",
  "MoMA's Friday hours run until 8:30pm with no weekly closure day, making it the better pick for an evening visit after a day session — the Met closes at 5pm most days and is shut entirely on Wednesdays.",
];

const whatToAvoid = `Don't assume the Queens Museum and the Manhattan museums are interchangeable options for the same kind of day — the Queens Museum is a real but modest 30-45 minute detour, while the Met or MoMA each genuinely deserve a half or full day on their own; treating either as a quick add-on to a different plan undersells it. Don't try to do both the Met and MoMA in one day expecting a relaxed visit — the subway connection between them isn't direct, and each museum alone is large enough that rushing through both back-to-back means seeing neither one properly.`;

const gettingThere = `Queens Museum — short walk from Mets-Willets Point (7 train), same stop as the grounds. Manhattan museums — 7 train, transfer at Grand Central (4/5 express) for the Met or Court Square (E/M) for MoMA.`;

const practicalInfo = {
  hours: "Queens Museum Wed-Fri 12-5pm, Sat-Sun 11am-5pm (closed Mon-Tue); The Met Sun-Thu 10am-5pm, Fri-Sat 10am-9pm (closed Wed); MoMA daily, Mon-Thu/Sat-Sun 10:30am-5:30pm, Fri 10:30am-8:30pm",
  costRange: "Queens Museum $8 adult; The Met $30 adult (pay-what-you-wish for NY/NJ/CT residents and students only); MoMA $30 adult",
  bookingMethod: "No advance booking required at any of the three — walk-up admission is standard, though MoMA and the Met both sell timed tickets online if you'd rather skip the line. Bring ID if you might qualify for the Met's pay-what-you-wish rate (NY/NJ/CT residency or student status) — it's checked at the desk, not assumed.",
  website: "https://queensmuseum.org, https://www.metmuseum.org, https://www.moma.org",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "New York's Museums — The Met, MoMA, and Queens",
      subtitle: "A world-class panorama a 10-minute walk from Arthur Ashe, or the full Manhattan trip",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Flushing Meadows-Corona Park & Manhattan",
      address: "Queens Museum: Flushing Meadows Corona Park, Queens, NY 11368",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from metmuseum.org (pay-what-you-wish policy), moma.org/visit, queensmuseum.org, Untapped New York (7 train routing). Google Places API lookups for all 3 venues, 5 Oct 2026.",
      sport: ["tennis"],
      moodTags: ["culture", "unwind"],
      interestCategories: ["day-trip", "art-and-culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: false,
      availability: "perennial",
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
