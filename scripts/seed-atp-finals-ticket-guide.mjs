import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-ticket-guide-" + Date.now().toString(36);

const bodyContent = `The Nitto ATP Finals runs 15 sessions across 8 days, and understanding that structure matters more here than at a knockout tournament, because every session guarantees you both a singles and a doubles match, and the group stage runs for six straight days before the format changes.

From 15 to 20 November, the tournament plays its round-robin group stage: two sessions a day, one in the afternoon (starting 11:30am) and one in the evening (starting 6pm), each pairing one doubles match with one singles match. Eight singles players and eight doubles teams are split into two groups of four, each playing the other three in their group — so across those six days, every single-session ticket guarantees you a genuine round-robin match involving top-8 players, not a filler contest.

21 November is semifinal day — the format shifts to two sessions, an early-afternoon slot (starting 12pm) and an evening slot, each again combining doubles and singles semifinals. 22 November is finals day, a single session at 3pm covering both the doubles and singles finals — the one day of the tournament with just one session rather than two.

Tickets are sold as single-day passes or season tickets, through the official ticket office or Ticketone. The tournament itself doesn't publish fixed tier names or pricing on its own site in advance — pricing varies genuinely by which specific day and session you're buying, since group-stage days early in the week carry different demand than finals weekend. What's worth knowing regardless of tier: with 15,000 max capacity but only around 12,000 in the tennis configuration, and eight of the best players in the world guaranteed across every single session, this isn't an event where a "cheap" early ticket means a weak field — round-robin means Sinner, Alcaraz, or whoever's qualified plays every group match, not just the final.`;

const whyItsSpecial = `The single most useful thing to understand before buying is that this tournament has no bad tickets in the sense a normal event has "eliminated by round two" risk — round-robin guarantees every one of the eight qualified singles players plays three full matches minimum, spread across the group stage days, so a Tuesday afternoon session in week one can just as easily land you a top-3 player as a Saturday semifinal can. That's structurally different from a knockout event, where an early exit can leave a session ticket holder watching players nobody's heard of. If your priority is guaranteed star power on a specific day, check who's grouped and when they're scheduled once the draw is announced (typically days before the tournament starts) rather than assuming any one day is automatically stronger than another — with round-robin, they're closer to equal than most first-time buyers expect.`;

const insiderTips = [
  "Every single session (day or evening) during the group stage guarantees both a doubles and a singles match — you're never buying a ticket for just one discipline.",
  "The draw (which 4 players are in which group) is typically released close to the tournament start — check it before buying a specific day's ticket if you want a strong chance of seeing a particular player, since round-robin scheduling means a big name could play any day 15-20 Nov depending on their group.",
];

const whatToAvoid = `Don't assume finals day (22 Nov) is automatically the "best" ticket just because it's the final — it's also the single most expensive, most crowded, and least flexible day (one session only, fixed 3pm start, no alternative time if it doesn't suit your schedule), while a well-chosen group-stage day can put you in the same arena watching the same top players for meaningfully less.`;

const practicalInfo = {
  hours: "Group stage (15-20 Nov): day session 11:30am, evening session 6pm. Semifinals (21 Nov): 12pm and evening. Final (22 Nov): single session, 3pm.",
  costRange: "Varies by day and session — not published as fixed tiers by the tournament. See official ticket site for current pricing.",
  bookingMethod: "Single-day or season tickets via the official ticket office or Ticketone.",
  howToBook: "",
  website: "https://tickets.nittoatpfinals.com/en, https://www.ticketone.it",
  reservationsRequired: true,
};

const gettingThere = "Tickets are venue-specific to Inalpi Arena — see the venue and Getting There experiences for arrival detail.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "ATP Finals ticket guide — sessions and format",
      subtitle: "15 sessions, round-robin group stage, and why an early-week ticket isn't a weaker one",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Santa Rita",
      address: "Corso Sebastopoli 123, 10137 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Session structure, day/evening times, and format confirmed via official schedule page tickets.nittoatpfinals.com/en/schedule. Note: tournament states times/program are indicative and may change. Verified 4 Aug 2026.",
      sport: ["tennis"],
      moodTags: ["planning", "value"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
