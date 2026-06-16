import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-dunes-walking-course-" + Date.now().toString(36);

// ─── Content ──────────────────────────────────────────────────────────────────

const bodyContent = `Most major championships make spectators choose between seeing the golf and seeing the course. At Royal Birkdale, you don't have to choose. The dunes that frame every fairway are also the best places to watch from — elevated, free, and big enough to sit on without crowding. This is the specific pleasure of Birkdale as a spectator venue, and it is almost entirely absent from the marquee championship coverage.

The course runs in a rough figure of eight through the sandhills of Southport. From above it looks compact; on the ground it feels expansive, because each hole sits in its own corridor between dunes, shielded from the ones on either side. What this means for spectators is that you can follow a group down a fairway with almost no competition for position — the dunes simply aren't crowded in the same way as the grandstands.

The 11th hole is the one the marshals always mention first. The green sits in a near-complete circle of dune, and you can climb the sand on any side and watch from above — properly above, looking down at the green rather than across at it. During championship rounds, this is one of the few places where you can find a spot with a genuine bird's-eye view of a hole and not be standing on someone's shoulders to see it.

The 7th is a par 3 with a long dune running the full length of the left side. Less popular than the 11th, quieter on the dune, and a hole where everything happens fast — iron shot, flag, reaction — so you see a lot of golf in a short time if you position yourself on the left flank.

The 9th has a grandstand and a dune behind the green that gives you the choice: pay for reserved seating or climb five steps of sand for free. Most people in the grandstand will tell you the dune is better, because you can move when a group has finished and follow the action rather than waiting for the next one to arrive.

The 6th tee box is a marshal's recommendation that rarely appears in the guides: standing there gives you sightlines to the 5th green and the 6th tee simultaneously, meaning you can watch a hole being completed and a new one starting without moving more than 20 metres. On a busy afternoon this kind of efficiency matters.

The layout rewards walking. Unlike Augusta or Carnoustie, where the back nine takes you far from the clubhouse and you end up hiking between holes you didn't mean to visit, Birkdale's middle section — holes 7 through 14 — is genuinely compact. Within five minutes of leaving the Spectator Village you can see action on six holes. If you are methodical about it, you can walk the full 18 following a group from the first tee, cover the whole course in under four hours, and never feel like you missed anything.

The Spectator Village at the 18th end of the course is a useful anchor point. The grandstand at 18 provides the championship's headline atmosphere — the closing hole drama, the ovations — but the rest of the course is where the actual golf happens. Use the village for food and rest, then go back out.

General admission gives you full access to all of this. There are grandstands at specific holes — 2, 9, 18 — and The Links private zone near the 4th green for Ticket Plus holders. But the dunes themselves are free, unreserved, and better than most of the reserved options.`;

const whyItsSpecial = `The most common complaint about watching major championships is that you pay a lot of money to see a hat. You stand at the rope, the player is 30 metres ahead, and the person in front of you is taller. The grandstands are better, but they fix you to one spot and make you wait for the action to come to you.

The dunes at Royal Birkdale are a third option that most people don't know to use. They're not cordoned off. They don't cost extra. You just climb them. And from the top of a dune beside the 11th green, you are looking down at a major championship — not across it, not through it, but down at it. That vantage point is legitimately unusual among the world's great golf venues.

What makes it work is the course design. Birkdale's architect Fred Hawtree built the holes into the valleys between the dunes rather than over them, which means the dunes themselves became spectator infrastructure without anyone planning it that way. The result is a course that rewards the people who leave the grandstands and walk.

The other thing the dunes give you is quiet. Not literally — a roar from the 18th carries everywhere — but the interpersonal quiet of a spot where you can sit down, watch the hole below you, and not be in a crowd. For four hours at The Open, that's a specific kind of luxury.`;

const insiderTips = [
  "The 11th hole dune gives you a bird's-eye view of the green that no grandstand at Royal Birkdale can match — head there first thing, before the 10am groups arrive and the best spots fill.",
  "Pick one group and follow it for nine holes rather than hopping between holes — you see the strategy unfold across a stretch of the course, and on a busy day it's far less stressful than fighting through crowds at each hole.",
];

const whatToAvoid = `Don't spend your day in the grandstand at 18 waiting for the leaders to come in — you will see four or five holes of golf in a full day, and the atmosphere, while real, is manufactured by the setting rather than the golf itself. The best of Royal Birkdale as a spectator experience is out on the course, in the dunes. And don't try to cross the course during heavy play — stewards close the crossings when groups are close, and a wrong turn at the 6th can leave you stranded on the wrong side of the course for 20 minutes.`;

const gettingThere = `Merseyrail Northern Line from Liverpool Central to Birkdale station (approximately 40 minutes), then an 8-minute walk to the gates. Park-and-ride is available from the M57/A570 — do not drive to the course on championship days, road closures are extensive.`;

const practicalInfo = {
  hours: "Gates open 2 hours before first tee time. Championship days: Thursday 16 – Sunday 19 July 2026.",
  costRange: "General admission from ~£90 (Thursday) to £150 (Sunday final round). Practice days from £30.",
  bookingMethod: "Book general admission via theopen.com — some championship day availability remains as of June 2026.",
  howToBook: "Thursday is the best value championship day for course walkers — grandstands are less full than Friday and Saturday, the dunes are quieter, and the full field is playing. Friday cut-day tickets are available but the afternoon session thins as players cut. If you want to combine dune walking with The Links private zone (grandstand at the 4th, food trucks, covered seating), Ticket Plus on Thursday or Saturday at £270–£290 gives you both. For the pure course-walking experience without Ticket Plus, arrive at gate open (two hours before first tee) and head directly to the 11th via the Spectator Village — you will have the dune to yourself for the first two hours.",
  website: "https://www.theopen.com/tickets-and-hospitality/2026/tickets",
  reservationsRequired: true,
};

// ─── Insert ───────────────────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Dunes — Walking the Course",
      subtitle: "Royal Birkdale's towering sandhills are natural grandstands. Here's how to use them.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Royal Birkdale",
      address: "Royal Birkdale Golf Club, Waterloo Road, Southport, PR8 2LX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: nationalclubgolfer.com/tour/tour/spectator-guide-royal-birkdale/ (hole-by-hole spectator tips, dune viewing spots), theopen.com/tickets-and-hospitality/2026/tickets (general admission pricing and access), theopen.com/tickets-and-hospitality/2026/prices (Ticket Plus pricing). Verified 16 Jun 2026. No suitable CC hero image found — R&A press contact: mediaenquiries@randa.org.",
      moodTags: ["insider", "fan_zone"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-16",
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
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
