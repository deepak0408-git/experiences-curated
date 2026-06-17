import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_SLUG = "open-championship-2026";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-bistrot-verite-" + Date.now().toString(36);

// ─── 1. Resolve sporting event ────────────────────────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id ?? EVENT_ID;
console.log("✓ Sporting event ID:", eventId);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Claude Vérité arrived in Southport in 1961. He was 18, from Beauvais, sent on placement from the pâtisserie where he'd been apprenticed since 13. He was meant to stay briefly. He didn't leave. He eventually opened Claude's Pâtisserie in Churchtown in the early 1970s — it ran for nearly three decades, became enough of a local institution that new owners kept his name above the door when he sold in 2003.

His son Marc opened Bistrot Vérité in Birkdale Village in 2009. Marc's sons — Jacques as head chef, Charlie running front of house — are now the daily operation. That's three generations of the same family cooking and serving in the same town, the line running from a Beauvais apprenticeship in 1943 to a small bistro on Liverpool Road today.

The food is French with a Lancashire edit. The menu changes daily based on what's fresh. Snails with garlic butter, frogs' legs, steak tartare, crab thermidor. Mains built around fish and meat cooked cleanly — turbot, sea bream, lamb, duck. Nothing laboured. Three courses, half a bottle, coffee: roughly £56 a head by Hardens' 2026 reckoning. With a full bottle it pushes north of that, but not uncomfortably.

Marc Birchall — chef-patron of Moor Hall, the two-Michelin-star restaurant named Best in England in 2022 — has named this his favourite local restaurant. The Michelin Guide lists it. The AA gives it 2 Rosettes. The Good Food Guide calls it a Local Gem. For Birkdale Village, that is not the expected level of recognition.

The room is long and narrow, bistro-scale, wood panelling, chalked specials board. It fills up. When it does, it gets loud. Not the place for a whispered conversation, but entirely the place for a good meal after a day at the Open.

Royal Birkdale's main entrance is 15–20 minutes on foot through Birkdale Village. Taxi is 3–4 minutes. Book before you arrive — this is not a walk-in option during tournament week.`;

const whyItsSpecial = `The credential stack — Michelin Guide, 2 AA Rosettes, Hardens, a two-Michelin-star chef's public endorsement — tells you one thing. What it doesn't tell you is that the restaurant sits 15 minutes' walk from one of the great links courses in the world, in a village most visiting golfers will pass through without noticing.

The family story earns its place. Three generations, same town, same trade. Claude came for a placement in 1961 and never left. Marc built something worthy of his father's name. Jacques and Charlie are running it now.

For the Open, this is the obvious answer to "where should we eat tonight." There isn't a better restaurant this close to Royal Birkdale.`;

const insiderTips = [
  "The menu changes daily — check bistrotverite.co.uk the morning of your visit. The fish dishes are generally the highlight when the day's delivery is good.",
  "Petite Vérité, the bar in the adjacent premises, is the right place for a drink before or after — it takes the pressure off the main room and extends the evening.",
];

const whatToAvoid = `The room is genuinely noisy when full. If you want to hear each other across the table, book earlier in service rather than peak evening. And check the menu before booking if vegetarianism matters — the kitchen is firmly meat and fish forward, with limited vegetarian options.`;

const gettingThere = `15–20 minutes on foot from Royal Birkdale's main entrance through Birkdale Village. Taxi: 3–4 minutes, £4–6. The restaurant is on Liverpool Road, the main street of Birkdale Village — Arriva Line 47 bus also stops in the village.`;

const practicalInfo = {
  hours: "Check bistrotverite.co.uk — menu and hours change daily and vary seasonally.",
  costRange: "~£56/head for three courses, half bottle wine, coffee (Hardens 2026). Budget £70–80/head with a full bottle.",
  bookingMethod: "Book online at bistrotverite.co.uk or call 01704 564199. Open Championship week fills months in advance — book as soon as travel is confirmed.",
  howToBook: null,
  website: "https://www.bistrotverite.co.uk/",
  reservationsRequired: true,
};

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Bistrot Vérité, Birkdale Village",
      subtitle: "Michelin-listed, 2 AA Rosettes, three generations French family — 15 minutes' walk from Royal Birkdale.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Birkdale Village, Southport",
      address: "7 Liverpool Road, Birkdale, Southport, PR8 4AR",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: bistrotverite.co.uk (official, Jun 2026), Michelin Guide 2026 (listed), Hardens 2026 (£56/head, named among UK's best), Good Food Guide (Local Gem), TripAdvisor (4.7/5, 908 reviews, #2 of 24 Birkdale), confidentials.com (17/20), standupforsouthport.com (Hardens 2026 mention, Marc Birchall endorsement, AA Rosette 2022). No affiliate opportunity — booking via direct Resos page, not OpenTable/Resy. Hero image outstanding — contact restaurant directly or search Wikimedia Commons for Birkdale Village street. Verified Jun 2026.",
      sport: ["golf"],
      moodTags: ["fine-dining", "local", "historic"],
      interestCategories: ["sport", "food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-17",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Experience at: http://localhost:3000/experience/" + result.slug);
  console.log("→ Review at:     http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
