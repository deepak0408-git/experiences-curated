import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "eton-across-river-windsor-" + Date.now().toString(36);

const bodyContent = `Eton sits directly across the Thames from Windsor, five minutes on foot over Windsor Bridge, which makes it one of the easiest add-ons to a Windsor Castle visit rather than a separate trip in its own right. The walk up Eton High Street changes character as you go: the first stretch is tea rooms, pubs, and antique shops, including the Cockpit Inn, a genuine 15th-century timber-framed building dating from 1420 that was once a rear slaughterhouse rather than the cockfighting venue its name suggests.

Cross Baldwin's Bridge further along and the High Street shifts toward outfitters serving Eton College itself, some still using old hand sewing machines in view of the street. The college entrance for public tours sits near the church, on the Windsor side. For a more structured visit, the Eton Walkway is a two-mile circular route connecting 18 points of interest around the town, starting from Windsor Bridge, roughly an hour if you keep moving.

This is a genuinely small addition to a Windsor day rather than a full separate excursion, best treated as an hour or two tacked onto the end of a castle visit rather than planned as its own outing.`;

const whyItsSpecial = `What I like about Eton as an addition here is proportion, it doesn't ask for a full day, and it doesn't pretend to be more than what it is: a genuinely old, distinctive small town with a five-minute walk separating it from one of England's most-visited royal sites. Most visitors to Windsor never cross the bridge, which makes the walk itself feel like a small discovery rather than an obvious tourist stop.

The building history along the High Street, a 1420s timber-framed structure sitting a few doors from shops still serving a 580-year-old school, gives you a genuine sense of continuity that's easy to miss if you only see Windsor Castle and turn back.`;

const practicalInfo = {
  hours: "Eton town and High Street: no fixed hours, open access. Eton College public tours run on a scheduled basis — check collections.etoncollege.com for current tour times and availability.",
  costRange: "Free to walk the town and High Street; Eton College guided tours carry a separate ticket price — check current rates directly.",
  bookingMethod: "No booking needed to walk Eton's High Street; book Eton College tours in advance via the college's official visitor site if you want access beyond the public streets.",
  website: "https://collections.etoncollege.com/visit-us/",
  reservationsRequired: false,
};

const gettingThere = "A five-minute walk from central Windsor across Windsor Bridge, then along Eton High Street toward the college.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Eton — Across the River from Windsor",
      subtitle: "A five-minute walk from Windsor Castle to a 580-year-old school and a genuinely old high street.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Eton",
      address: "Eton High Street, Eton, Windsor SL4 6AX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Treat this as a one-to-two-hour add-on to a Windsor Castle visit rather than a separate outing — the walk itself is only five minutes from Windsor Bridge.",
        "Look for the Cockpit Inn on the first stretch of the High Street, a genuine 1420s timber-framed building — most visitors walk past it without realising its age.",
      ],
      whatToAvoid: "Don't plan Eton College tours without checking the schedule in advance — public access to the college itself runs on specific tour times, unlike the open High Street.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: londontoolkit.com Windsor/Eton visitor guide, windsor.gov.uk Eton town page and 'A Sunday Stroll Through Eton' blog (Cockpit Inn 1420s building, Christopher Hotel 1511, Eton Walkway 2-mile route), collections.etoncollege.com official visitor information. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["historic", "quiet", "walkable"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-10",
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
