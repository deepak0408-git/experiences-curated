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
const slug = "open-hillside-golf-club-" + Date.now().toString(36);

// ─── 1. Resolve sporting event (already exists) ───────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id ?? EVENT_ID;
console.log("✓ Sporting event ID:", eventId);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Stand on the 11th tee at Hillside and you'll understand immediately. The ground drops roughly 100 feet in front of you. A dogleg bends around a dune ridge below. The green sits raised behind a cavernous bunker. And if you look left — across the boundary — you'll see the white grandstands of the Open Championship course next door.

Jack Nicklaus described "some of my favourite holes" after walking Hillside's back nine with Fred Hawtree, who redesigned the course in the 1960s. Greg Norman wrote to the club calling it the best back nine in Britain. What Hawtree built on Hillside's elevated terrain became quiet legend among those who've played it: each hole tucked into its own dune valley, enclosed, removed from the noise of the town.

The front nine runs relatively flat beside the railway line — solid, well-bunkered, with the rebuilt 4th par-3 now one of the most memorable short holes in the north. But the transformation happens at the turn. The back nine climbs. Views from the 14th tee extend to Snowdonia, the Lake District, and Blackpool Tower on a clear day. The terrain compares — not idly — to Ballybunion in County Kerry. Scots pines frame many fairways, giving the course an unusual character: wild dune terrain softened by woodland, austere and beautiful together.

The club dates from 1911. Martin Ebert of Mackenzie & Ebert completed a renovation in 2019–2021 that gave the front nine a character that finally matches the back. The course now measures 7,100 yards from the championship tees, slope 137–140.

Golf Monthly ranks it 30th in Britain and Ireland. Top 100 Golf Courses calls it "an underrated gem, separated from Royal Birkdale only by a footpath." That footpath matters. The two clubs share a boundary. Hillside station — the same stop used by Open spectators — is a five-minute walk from both entrances.

Hillside has never hosted The Open. It has hosted The Amateur Championship three times (1979, 2011, 2023), the PGA Championship, and two recent DP World Tour events. It remains the finest British links course not to have hosted The Open — which makes a round here, during Open week, feel like a deliberate act of discovery.

Visitors are welcome on weekdays and Sunday afternoons. Book ahead — this is a private members' club and July tee times go quickly. Contact the Secretary's Office by phone (01704 567169) or email (secretary@hillside-golfclub.co.uk). A handicap certificate is required. Summer 2026 green fees: £300 midweek, £335 weekends. Electric trolley £20; buggy £35.`;

const whyItsSpecial = `Most people arriving at Hillside station for The Open walk straight past the club gates without looking twice. They're here for the greatest championship in golf — Royal Birkdale is 300 metres up the road. Why would you stop?

Because Hillside is one of those places golf history has overlooked, and not because of the quality of the course. It's quieter than Birkdale. It's private. It has never had a Claret Jug handed out on its 18th green. And so it sits there, separated from the Open venue by a footpath, almost unknown to anyone who hasn't made a point of playing it.

The back nine is genuinely exceptional. Stand on the 11th tee for the first time and look down that 100-foot drop, and you'll understand why Nicklaus and Norman said what they said. The dune terrain on holes 11 through 18 rivals the great links courses on the Ayrshire coast and the west of Ireland.

Playing here during Open week is quietly subversive. While 200,000 spectators crowd Birkdale's grandstands, you're walking an empty links course next door with views to Snowdonia, facing the same Merseyside wind — at a fraction of what hospitality packages at the Open cost.

The Ebert renovation finally gave the front nine a character that matches the back, and the playing surface reflects serious investment. There is no better way to understand what makes Birkdale's terrain special than by spending four hours walking the course next door.`;

const insiderTips = [
  "The back nine is the reason to be here — if you're pressed for time, ask the starter whether a back-nine-only arrangement is possible for a solo or small-group visit.",
  "The 14th tee gives views to Snowdonia, the Lake District, and Blackpool Tower on a clear July morning — one of the best panoramas in English golf. Pause there.",
];

const whatToAvoid = `Don't turn up without a booking — Hillside is a members' club, not pay-and-play, and unannounced visitor requests are declined. Don't bring a high handicap certificate without calling ahead first: the club requires a handicap certificate and is selective about visiting golfer standards. Also avoid planning a Saturday round unless you've confirmed with the club directly — Saturday access is heavily restricted and some sources say no visitors at all.`;

const gettingThere = `Take Merseyrail from Liverpool Central (Southport Line) to Hillside station — approximately 38 minutes. The club entrance is a 5-minute walk from the station on Hastings Road.`;

const practicalInfo = {
  hours: "Weekdays and Sundays from 12 noon. Saturdays heavily restricted — call to confirm. Bank Holidays: closed to visitors.",
  costRange: "£300 per round midweek (summer 2026); £335 weekends. Electric trolley £20; buggy £35.",
  bookingMethod: "Contact the Secretary's Office directly — phone 01704 567169 or email secretary@hillside-golfclub.co.uk. A handicap certificate is required. Book months in advance for Open week.",
  howToBook: "Book months in advance for Open week — July is Hillside's busiest period and midweek tee times during 16–19 July fill early. Contact the Secretary's Office (secretary@hillside-golfclub.co.uk / 01704 567169) or try the BRS tee booking system (visitors.brsgolf.com/hillside). Saturday access is severely restricted; aim for Tuesday, Wednesday, or Thursday. The club pro shop (pro@hillside-golfclub.co.uk / 01704 568360) can also assist with visitor bookings and equipment hire.",
  website: "https://www.hillside-golfclub.co.uk",
  reservationsRequired: true,
};

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hillside Golf Club — The Secret Next Door",
      subtitle: "The finest British links course never to have hosted The Open — separated from Royal Birkdale by nothing but a footpath.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Hillside, Southport",
      address: "Hillside Golf Club, Hastings Road, Hillside, Southport, Merseyside, PR8 2LU",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: hillside-golfclub.co.uk (official, green fees verified Jun 2026), Wikipedia, Golf Monthly, Top 100 Golf Courses, National Rail. Green fees £300/£335 from official site — third-party sites show outdated figures. Nicklaus quote 'some of my favourite holes' from official site; 'finest back nine' formulation is secondary sources only. Hero image outstanding — contact secretary@hillside-golfclub.co.uk, media@randa.org, or media@europeantour.com. Verified June 2026.",
      sport: ["golf"],
      moodTags: ["off-the-beaten-path", "bucket-list", "active"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "luxury",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
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
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience at: http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
