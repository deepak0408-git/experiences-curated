import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "preparing-for-your-wimbledon-visit-" + Date.now().toString(36);

// ─── 1. Get Wimbledon 2026 sporting event ────────────────────────────────────

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "The Championships, Wimbledon 2026",
    slug: "wimbledon-2026",
    sport: "tennis",
    tournamentSeries: "Wimbledon",
    editionYear: 2026,
    destinationId: LONDON_ID,
    venueName: "All England Lawn Tennis and Croquet Club",
    venueAddress: "Church Road, Wimbledon, London SW19 5AE",
    startDate: "2026-06-29",
    endDate: "2026-07-12",
    recurrence: "annual",
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

let wimbledonEventId;
if (event) {
  wimbledonEventId = event.id;
  console.log("✓ Sporting event created:", event.name);
} else {
  const [existing] = await db
    .select({ id: sportingEvents.id })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, "wimbledon-2026"));
  wimbledonEventId = existing?.id;
  console.log("✓ Sporting event already exists, ID:", wimbledonEventId);
}

// ─── 2. Insert experience ────────────────────────────────────────────────────

const bodyContent = `Wimbledon operates on a different logic from most sporting events. There are no streaming apps that capture what it feels like to be there, no secondhand account that prepares you for the specific atmosphere of late June in SW19. What there is, however, is a set of decisions you can make in advance that will change the quality of your two weeks substantially.

The formal route to tickets runs through the public ballot, which opens in the autumn of the preceding year and closes in December. Applications are free; results come in the spring. If your name comes up, you'll be offered one or two tickets per session for courts including Centre, No. 1, and No. 2. If it doesn't — which is the outcome for the majority of applicants — the queue is your alternative.

The queue is not a consolation prize. It has its own rituals, its own community, its own satisfactions that Centre Court tickets don't offer. The All England Club distributes numbered queue cards from mid-afternoon the day before; arrivals after that join the back of the overnight line. Queue cards are non-transferable. By early morning, the line can stretch several thousand people long, but it moves faster than it looks: gates open at 10:30am, and the vast majority of queued visitors are inside by lunchtime.

Day tickets are available for all courts except Centre and No. 1 on most days. Show Court tickets returned by holders during the day go back on sale at the ticket resale window near Centre Court — sometimes with only minutes between the return and the queue moving. Ground Pass holders can join this queue.

What to bring is one of those questions where the official guidance and the practical truth diverge. The queue operates rain or shine. Bring layers regardless of the forecast — London in late June swings between 15°C and 28°C within the same day, and the ground offers limited shelter on the outer courts. A waterproof jacket earns its place every year.

Food and drink from outside are permitted within limits: no alcohol, no glass containers. The practice of bringing a picnic is actively encouraged. The ground's own food is fine but expensive; a packed lunch is not only cheaper but more pleasant to eat on Henman Hill or on the grass near the outer courts. Cameras without detachable lenses are permitted.

The order of play for each day is published the evening before on the Wimbledon website and app, usually around 7:30pm. It's worth checking before you arrive to set expectations about which courts you'll be able to access. If a major match is scheduled on Centre Court, the tickets are likely to have gone via ballot; if it's on Court 3, you may be able to watch most of it without a premium ticket.

Ground passes allow access to all outer courts and Henman Hill, where the main show courts are shown on the big screen. On grounds days — when rain stops play across the main courts — the atmosphere on the hill can be better than on any court. The Wimbledon app is worth downloading before you arrive. It carries the real-time order of play, court information, and updates during the day. My Wimbledon is the official membership and ballot management portal — that's where your ballot ticket, if you have one, is managed.`;

const whyItsSpecial = `Wimbledon is the oldest Grand Slam in the world, but what makes the visit feel different isn't the tennis alone — it's the preparation. The queue culture has persisted for over a century precisely because it works: it's fair, it's social, and it produces the particular atmosphere of a crowd that earned its way in. Understanding how to navigate the ballot, the queue, the order of play, and the ground's unwritten logistics is the difference between a day spent outside in confusion and one spent inside on the right court at the right time. This is the thing to read before anything else in the pack.`;

const [inserted] = await db
  .insert(experiences)
  .values({
    title: "Preparing for Your Wimbledon Visit",
    slug,
    subtitle: "Everything worth knowing before you join the queue — tickets, packing, and the unwritten rules of the fortnight",
    status: "published",
    experienceType: "transit",
    availability: "event_only",
    curationTier: "editorial",
    destinationId: LONDON_ID,
    sportingEventId: wimbledonEventId,
    bodyContent,
    whyItsSpecial,
    insiderTips: [
      "Queue cards are issued from mid-afternoon the day before — arriving before 5pm typically gets you a lower number. Before noon gets you near the front.",
      "The order of play is published around 7:30pm the evening before at wimbledon.com. Set a reminder if you want to plan around a specific match.",
      "A Ground Pass (entry without a show court seat) lets you see more of Wimbledon than many Centre Court ticket holders — outer courts, Henman Hill, practice courts, and the museum.",
      "Ticket resale opens daily near Centre Court. Returned show court tickets sometimes become available as late as 3pm — worth checking if you're already inside.",
      "Pack the picnic. Outside food is encouraged, and eating on the grass near the outer courts beats any restaurant queue on the grounds.",
    ],
    budgetTier: "free",
    bestSeasons: ["jun", "jul"],
    editorialNote: "Pre-arrival logistics guide — covers ballot, queue, day tickets, what to bring, order of play. Core content for the Before You Go section.",
    lastVerifiedDate: "2026-04-26",
  })
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("✓ Experience inserted:", inserted?.slug);
await client.end();
