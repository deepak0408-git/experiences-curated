// Hero image needed — source an exterior or dining room shot and upload to R2
// Key: "experiences/hero/light-house-wimbledon.jpg"
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
const slug = "dinner-at-the-light-house-" + Date.now().toString(36);

await db.insert(experiences).values({
  slug,
  destinationId: LONDON_DESTINATION_ID,
  sportingEventId: wimbledonEventId,
  title: "Dinner at The Light House",
  subtitle: "Wimbledon Village's most serious restaurant — modern European, book ahead for the fortnight",
  experienceType: "dining",
  budgetTier: "splurge",
  availability: "event_adjacent",
  curationTier: "editorial",
  status: "in_review",
  neighborhood: "Wimbledon Village",
  moodTags: ["celebratory", "refined", "intimate", "considered"],
  interestCategories: ["dining", "fine dining", "wine"],
  lastVerifiedDate: "2026-04-28",
  editorialNote: "SW19's best restaurant by a clear margin. Consistent year-round; doesn't do a tournament price hike. Book 2-3 weeks out for dinner during Wimbledon. Set lunch is the deal.",
  specScoreSpecificity: 4,
  specScoreProvenance: 3,
  specScoreExceptionalism: 5,
  specScoreCurrency: 4,
  bodyContent: `The Light House is on Ridgway, a five-minute walk from Wimbledon Village high street, in a building that's quiet from the outside in a way that makes you feel you might be about to find something good. It's been the neighbourhood's most serious restaurant for the better part of two decades. In restaurant terms, that's a long time, and it means something: the kitchen has had long enough to find its voice and the front of house has had long enough to run without visible effort.

The cooking is modern European, seasonal, and changes regularly. Starters run £12-18, mains £25-38. A full evening with drinks and wine comes to around £75-100 a head. The set lunch — two courses for around £35-40 — is one of the better deals in SW19 and worth knowing about if you want a serious meal without the full dinner price.

The menu doesn't announce its intentions. You get combinations that are slightly unexpected and work, ingredients that are clearly in season, preparations that show the kitchen has been thinking carefully about what it's doing. The wine list is considered without being intimidating, and if you ask the staff what they'd recommend with a particular dish, you'll get an actual answer.

The room is calm. Tables are spaced properly. There's no music loud enough to make conversation difficult, no theatrical service rituals. It's a restaurant running well, which is a more unusual thing than it should be.

**Booking during Wimbledon**

Tables go quickly in the fortnight. Two to three weeks' advance booking for dinner is not unusual; call ahead rather than trying to book online only. Lunch is more accessible — worth checking availability if you haven't booked for dinner. The restaurant doesn't change its menu or pricing for the tournament, which is a policy worth respecting by booking early.

**Getting here**

About 15-20 minutes on foot from the All England Club through Wimbledon Village. Or a short taxi ride. From central London: SWR from Waterloo to Wimbledon (21 minutes), then a 10-minute walk uphill through the Village. One thing worth knowing: Wimbledon Village is the high street at the top of the hill, not the Broadway area near the station. If you're navigating on foot, head uphill from the station and keep going.

**What to order**

The set lunch changes but is consistently worth ordering. For dinner, ask what the kitchen is particularly pleased with that week — it's a genuine question in a restaurant like this and usually gets a useful answer. The wine list has a considered selection by the glass if you're not ordering a bottle.`,

  whyItsSpecial: `Most restaurants near a major sporting event spend two weeks using proximity as a substitute for quality. They're fully booked regardless, and the incentive to be consistently excellent is temporarily reduced. The Light House doesn't operate that way. The menu doesn't change to a tournament special. The prices stay where they are. The kitchen cooks the same food it was cooking in January.

That consistency is rarer than it sounds. A kitchen that's good year-round is a different proposition from one that performs for occasion. The Light House has been making the same bet for close to 20 years: that it's worth getting genuinely good at something and staying good at it. The bet has paid off.

It's the right choice for the dinner that marks the trip. Not a celebration dinner with speeches and a fixed menu, but a proper meal where the cooking is the point: a room that knows how to run itself, food that has something to say, wine that earns its place on the list. If you've had a good week at the tournament, this is the right way to end it.`,
});

console.log("Seeded: Dinner at The Light House");
await client.end();
