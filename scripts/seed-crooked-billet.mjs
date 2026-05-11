// Hero image needed — source a pub garden / exterior shot and upload to R2
// Key: "experiences/hero/crooked-billet.jpg"
// Until then, heroImageUrl is left null.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Look up Wimbledon 2026 event ID
const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));
const wimbledonEventId = existing?.id;

if (!wimbledonEventId) {
  console.error("Could not find or create Wimbledon 2026 event");
  process.exit(1);
}

const LONDON_DESTINATION_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "dinner-at-the-crooked-billet-" + Date.now().toString(36);

await db.insert(experiences).values({
  slug,
  destinationId: LONDON_DESTINATION_ID,
  sportingEventId: wimbledonEventId,
  title: "Dinner at The Crooked Billet",
  subtitle: "A 17th-century pub on Wimbledon Common that's been doing the same thing well for a very long time",
  experienceType: "dining",
  budgetTier: "moderate",
  availability: "event_adjacent",
  curationTier: "editorial",
  status: "in_review",
  neighborhood: "Wimbledon Common",
  moodTags: ["relaxed", "authentic", "local", "unhurried"],
  interestCategories: ["dining", "pubs", "local culture"],
  lastVerifiedDate: "2026-04-28",
  editorialNote: "Classic old inn on the Common. Reliable gastropub food, good garden, genuinely mixed crowd during the fortnight. Not trying to be anything other than what it is.",
  specScoreSpecificity: 4,
  specScoreProvenance: 3,
  specScoreExceptionalism: 4,
  specScoreCurrency: 4,
  bodyContent: `A pub on the edge of Wimbledon Common has been doing the same thing since the 1600s. The Crooked Billet sits on the lane of the same name, which branches off the Common near the windmill, in a building that makes no effort to look historic because it simply is. Low beams, old floors, a garden at the back that fills with people when the sun cooperates.

During Wimbledon fortnight, the pub absorbs two distinct crowds without visible friction. The regulars who come year-round barely notice the tournament — they've been sitting in the same corner for years, and an extra two weeks of foot traffic doesn't disrupt the pattern. The visitors arrive by accident or recommendation, find a seat, order something, and stay considerably longer than they intended. The Common is right there; the All England Club is twenty minutes across it; the garden on a long June evening has a quality that's difficult to plan for and easy to be grateful for.

The food is honest gastropub cooking. Not trying to be a restaurant, not coasting on atmosphere. The steaks are properly rested and served at the right temperature. The fish and chips are made by a kitchen paying attention to the batter. The Sunday roast, which needs advance booking during the tournament, is one of the more reliable ones in SW19. The menu changes with the season. The wine list is better than the building's exterior would lead you to predict — varied, fairly priced, and the staff know it well enough to make actual recommendations.

**Getting here**

Bus 200 from Wimbledon station (stop SP) takes about 10 minutes to the Crooked Billet stop. The walk across the Common from the All England Club takes 20 minutes and is worth doing at least once — it's a proper green space, not a park, and the walk settles the day down nicely before dinner. From central London, 21 minutes on the SWR from Waterloo to Wimbledon, then bus or a short taxi.

**Booking and budget**

Expect around £30-45 a head for food. Set lunch options on weekdays are good value — check the current menu before you go. Book for dinner during the tournament; the garden fills from about 6:30pm and walk-ins have a harder time in the evenings. The pub occasionally hosts private events, so worth calling ahead if you're coming specifically for it.

**Practical notes**

The Crooked Billet is in a residential part of SW19 that most tournament visitors don't reach. The surrounding roads are quiet. Free street parking after 6pm if you're driving from somewhere else in the area. The pub is dog-friendly in the garden.

The walk back to Wimbledon station across the Common in the evening, when the light is good, is one of the things about this part of the trip that's hard to recreate anywhere else.`,

  whyItsSpecial: `The Crooked Billet doesn't perform its history. No framed newspaper clippings about "since 1692," no handwritten boards about provenance, no deliberate rusticism. The floors are old because 400 years of feet have been on them. The garden is the way it is because it's been there for a long time. The absence of effort to seem authentic is, in this case, because the place actually is.

During Wimbledon, when restaurants on the Broadway are pricing for the captive market and the Village establishments are fully booked weeks ahead, the Crooked Billet remains reliably good and doesn't punish you for turning up. The crowd is mixed in ways that are hard to engineer: locals who've been coming for 20 years, first-time visitors who found it on a map, a table still in tournament mode who can't stop replaying the set they just watched. The service is capable and doesn't perform warmth.

It's the right choice for the evening where you want a meal that doesn't feel like an event. After a long day at the courts, or a long walk on the Common, that's often the best thing going.`,
});

console.log("Seeded: Dinner at The Crooked Billet");
await client.end();
