import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LIVERPOOL_DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const OPEN_CHAMPIONSHIP_SLUG = "open-championship-2026";
const slug = "open-18th-hole-royal-birkdale-" + Date.now().toString(36);

// ─── 1. Create Open Championship 2026 sporting event ─────────────────────────

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "The Open Championship 2026",
    slug: OPEN_CHAMPIONSHIP_SLUG,
    sport: "golf",
    tournamentSeries: "The Open Championship",
    editionYear: 2026,
    destinationId: LIVERPOOL_DESTINATION_ID,
    venueName: "Royal Birkdale Golf Club",
    venueAddress: "Waterloo Road, Birkdale, Southport PR8 2LX",
    startDate: "2026-07-16",
    endDate: "2026-07-19",
    recurrence: "annual",
    ticketingUrl: "https://www.theopen.com/tickets-and-hospitality/2026",
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

let openEventId;
if (event) {
  openEventId = event.id;
  console.log("✓ Sporting event created:", event.name, "→", openEventId);
} else {
  const [existing] = await db
    .select({ id: sportingEvents.id })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, OPEN_CHAMPIONSHIP_SLUG));
  openEventId = existing?.id;
  console.log("✓ Sporting event already exists, ID:", openEventId);
}

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `There is a moment on Sunday afternoon at Royal Birkdale when the entire championship distils into a single image: a player emerging from the dune corridor onto the 18th fairway, the Art Deco clubhouse dead ahead, grandstands packed on three sides. You either feel it or you don't. Most people feel it.

The 18th is a par-4 of 473 yards from the championship tees, and for 2026 it plays differently than it ever has before. The tee position has shifted left, turning what was once a forgiving dogleg into a straight, uncompromising shot down a narrow fairway flanked by bunkers on both sides. The R&A's head professional describes it as "very narrow, very intimidating." Most professionals will play conservatively off the tee, accepting a longer approach over the risk of being buried in sand. That strategic tension — and watching how each player reads it — is half the theatre.

The other half is the setting. The clubhouse was designed in 1935 by George Tonge to resemble a ship cutting through the dunes, and from the grandstand behind the green you see exactly why that comparison has stuck. On a clear July evening, with the sun dropping behind the dunes and the leaderboard shifting by the minute, it is genuinely one of the great sporting spectacles in England.

The hole has history sewn into it. Justin Rose, 17 years old and playing as an amateur, holed out from the rough on this green in 1998 to seal the Silver Medal — "I was blushing," he said later. Seve Ballesteros, not yet 20, threaded a running shot between two bunkers in 1976 to make birdie and announce himself to the world. Jordan Spieth called this "the greatest display in all of golf" after his 2017 victory here. Tom Watson, Arnold Palmer, Lee Trevino, Padraig Harrington — the list of champions who have walked this final stretch and raised the Claret Jug outside the clubhouse reads like the sport's entire history.

For spectators, the grandstand behind the green is where you want to be on championship days — elevated, sheltered by the dune ridgeline, with an unbroken sightline from the fairway bunkering all the way to the flag. The seats fill early on Sunday; arrive by mid-morning. During the week, the grandstand is less pressured and you can move freely between the stands and the dune banks on either side.

The 9th green is worth knowing as a base. It sits just behind the Spectator Village and offers sightlines down both the 10th and 1st fairways. You can watch the morning wave leave the 1st tee and still be back at the 18th green for any player in contention by the afternoon. Birkdale's layout is compact enough to manage this.

Practice days — Tuesday and Wednesday — give a different but equally compelling version of the experience. You can stand at the rope on the 18th approach and watch the world's best players hit shots from close enough to hear conversations between players and caddies. This year, with the new tee position, every player is figuring out the hole fresh. That kind of access, at that range, doesn't exist anywhere else in professional golf.`;

const whyItsSpecial = `Most sport asks you to choose between being close and seeing everything. The 18th at Royal Birkdale refuses that trade-off. From the grandstand behind the green you can track the full drama of the tee shot, follow the approach, and watch the putt drop — or not — with thousands of people around you either gasping or erupting. The scale is intimate enough that you can read the players' faces. That doesn't happen at Wembley or on Centre Court.

What makes this hole specifically the right place to be in 2026 is that it's harder and more dramatic than any recent edition. The new tee position means leaders can't coast home — a loose drive late in a final round turns what should be a closing walk into a fight for survival. We've seen it destroy championships. We've seen it crown unexpected ones.

The clubhouse matters more than people realise, too. It isn't just backdrop — it's the reason the hole feels complete. The Art Deco building, the flagpole, the balcony where the champion eventually appears with the Claret Jug — the 18th at Royal Birkdale gives you sport with architecture. Most closing holes don't.`;

const insiderTips = [
  "The 2026 tee change makes the 18th straight and bunker-lined for the first time — position yourself on the right side of the grandstand for the best sightline down the full fairway.",
  "Practice day access (Tuesday/Wednesday) puts you at rope-side on the 18th approach at no grandstand premium — close enough to hear player-caddie conversations as they plot the new hole layout.",
];

const whatToAvoid = `Don't hold a grandstand spot through lunch on Sunday — you'll miss the morning wave entirely and spend four hours waiting. Walk the course until 2:00pm, then claim your seat for the leaders coming through. Equally, don't overlook the dune banks either side of the green as a free alternative to the grandstand. They fill fast on Sunday afternoon but offer a genuinely excellent elevated view — and standing up on the dunes as players walk up the fairway is a different experience from anything the grandstand gives you.`;

const practicalInfo = {
  hours: "Gates open approximately 07:00 on championship days; practice days from 07:00 Tuesday–Wednesday",
  costRange: "Standard day tickets from approx. £50–£90; Ticket Plus (includes grandstand access) higher — check theopen.com for 2026 pricing",
  bookingMethod: "Tickets via theopen.com — standard tickets give course access; Ticket Plus includes 18th grandstand seating.",
  website: "https://www.theopen.com/royal-birkdale-154th-open",
  reservationsRequired: true,
};

const gettingThere = `Merseyrail from Liverpool Central to Hillside station (every 15 minutes during Open week) — 5-minute walk to the main entrance. Do not drive on championship days; road closures are enforced across Birkdale. Park & Ride passes must be booked in advance via theopen.com. Taxis from Southport town centre take approximately 10 minutes and cost £8–12 each way — pre-book a return for after play.`;

const howToBook = `The 18th grandstand sells out well before championship week. Book Ticket Plus as early as possible — these go on sale in autumn the year prior and premium tiers sell out before Christmas. For guaranteed 18th grandstand seating on Sunday specifically, the Signature hospitality package includes allocated grandstand seats via Dunes House: contact The Open Experiences team at experiences@theopen.com. If booking independently, arrive at the 18th grandstand entrance by 09:00 on Sunday to secure a seat before leaders reach the back nine. The dune bank to the left of the green (no upgrade required) is a strong fallback — claim your spot by 11:00am.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The 18th at Royal Birkdale",
      subtitle: "The closing hole of The Open — grandstand seats, the Art Deco clubhouse, and the walk that decides the Claret Jug",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LIVERPOOL_DESTINATION_ID,
      sportingEventId: openEventId ?? null,
      neighborhood: "Birkdale, Southport",
      address: "Royal Birkdale Golf Club, Waterloo Road, Birkdale, Southport PR8 2LX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo: {
        ...practicalInfo,
        howToBook,
      },
      gettingThere,
      editorialNote: "18th hole design and 2026 tee change from theopen.com/latest/royal-birkdale-hole-changes-course-enhancements. Historic moments (Rose 1998, Ballesteros 1976, Spieth 2017) from theopen.com/latest/royal-birkdale-18-hole-greatest-moments. Spectator tips from nationalclubgolfer.com. Transport from merseyrail.org and southportguide.co.uk. Verified June 2026.",
      moodTags: ["iconic", "electric", "historic"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: openEventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("  Open Championship Event ID:", openEventId);
  console.log("  → Join row inserted into sporting_event_experiences");
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
