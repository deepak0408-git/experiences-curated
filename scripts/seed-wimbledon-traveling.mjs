import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "traveling-to-the-all-england-club-" + Date.now().toString(36);

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

const bodyContent = `The received wisdom on getting to Wimbledon is the District line. It is not the best advice. The District line will get you to Wimbledon station, but it adds a journey time from central London that Southwestern Railway's direct service from Waterloo doesn't. From Waterloo, the journey to Wimbledon takes 21 minutes. From the District line, it depends on where you're starting and how many changes you make along the way.

The fastest and least complicated route is Southwestern Railway from London Waterloo to Wimbledon station. Trains run every few minutes during peak tournament hours and take 21 minutes direct. From Wimbledon station, the ground is a 15-minute walk along Church Road, clearly signed, flat the entire way. The walk passes the queue if you arrive early, which is its own introduction to the Wimbledon atmosphere.

The District line option — Wimbledon Branch — terminates at Wimbledon station, the same destination. It's a longer journey from most starting points in central London, involves changes in the majority of cases, and the connection at Earls Court can be slow during tournament hours. If you're staying in Earl's Court, West Kensington, or Putney, the District line makes sense. From the City, Victoria, or Waterloo areas, the SWR train is consistently faster.

Southfields station, two stops before Wimbledon on the District line, is worth knowing about. It's a shorter walk to the southern gates than Wimbledon station — useful if you're approaching from east or northeast London, and noticeably less crowded on the exit during busy days. Some regulars prefer it precisely because the Wimbledon station exit crowd can slow the walk to the ground by ten minutes on a sold-out day.

The 93 bus from Putney runs to the ground and drops near the main entrance on Church Road. It's slower than the train but useful if you're coming from Putney or staying in that area. During the tournament, a dedicated shuttle service operates from Wimbledon town centre on a loop from early morning until the end of play each day.

If you're arriving from Kings Cross, Victoria, or the City: the cleanest route is Tube to Waterloo — Jubilee or Northern line — then SWR train direct to Wimbledon. Total journey time from most central London stations is 35 to 45 minutes. From Canary Wharf on the Jubilee line to Waterloo is 8 minutes; add 21 for the train. That's 29 minutes total, often faster than a District line journey with changes.

Driving to Wimbledon during the tournament is rarely the right call. Parking on the roads around the ground is restricted, and the main All England Club car park requires an advance parking ticket — included with some hospitality packages, otherwise purchased separately well in advance. The Wimbledon Park cricket ground operates as overflow parking and is generally available on the day, but fills by mid-morning on high-attendance days. If you must drive, build in 30 minutes of contingency.

Timing makes a difference you don't see until you've got it wrong. The gates open at 10:30am. Arriving 30 minutes before — whether from the queue or from the car park — is the comfortable margin. The peak entry crush is mid-morning when the first matches begin and a wave of late arrivals converges on the gate at once. On the way out: the crowd exit after the day's last match is heavy. If you're not in a rush, 20 to 30 minutes inside after play finishes will clear most of it.`;

const whyItsSpecial = `The 15 minutes between Wimbledon station and the All England Club is one of the great pre-event walks in sport — down a residential street, past the queue snaking for a mile, into a neighbourhood that's been doing this for 140 years. Getting there on the right route isn't just a logistics question; it's the start of the experience. This guide exists because the two most commonly recommended routes — the District line and driving — are both the wrong answer for most visitors, and the right one (SWR from Waterloo) takes the same time from most of central London with about half the effort.`;

const [inserted] = await db
  .insert(experiences)
  .values({
    title: "Traveling to the All England Club",
    slug,
    subtitle: "The transport guide that gets you there without losing an hour — and which station is actually better",
    status: "published",
    experienceType: "transit",
    availability: "event_only",
    curationTier: "editorial",
    destinationId: LONDON_ID,
    sportingEventId: wimbledonEventId,
    bodyContent,
    whyItsSpecial,
    insiderTips: [
      "SWR trains from Waterloo run every few minutes during tournament hours — no need to check the timetable, just turn up at the platform.",
      "Southfields station (District line) is better than Wimbledon station if you're arriving from east London or staying in Kensington — shorter walk, less crowded exit.",
      "If you miss the train you wanted, the next one is typically 4 minutes behind. Don't rush through Waterloo.",
      "The walk from Wimbledon station along Church Road is flat and signed. Allow 15 minutes at a normal pace — build it into your arrival time.",
      "On the way back, give it 20–30 minutes after the last match before leaving if you want to avoid the peak exit crush.",
    ],
    budgetTier: "free",
    bestSeasons: ["jun", "jul"],
    gettingThere: "SWR from London Waterloo to Wimbledon station (21 min), then 15-min walk along Church Road. District line also terminates at Wimbledon station. Southfields station (District line, 2 stops before Wimbledon) for southern gates.",
    editorialNote: "Transport guide covering SWR vs District line, Southfields vs Wimbledon station, bus options, driving, and timing. Core content for the Before You Go section.",
    lastVerifiedDate: "2026-04-26",
  })
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("✓ Experience inserted:", inserted?.slug);
await client.end();
