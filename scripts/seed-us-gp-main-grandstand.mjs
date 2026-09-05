import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-main-grandstand-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG} — expected it to already exist.`);
}
const eventId = existingEvent.id;

const bodyContent = `The Main Grandstand is the obvious first booking at Circuit of the Americas, and it earns that reputation honestly. It's the largest stand on the property, running the length of the front straight from the exit of Turn 20 past the start-finish line to the braking zone into Turn 1, directly opposite the pit garages and the podium. Sit here and you get the grid formation, every driver peeling out of the pits all weekend, the race start, and the podium celebration afterward — the closest thing COTA has to a single seat that covers the whole emotional arc of a race weekend.

It isn't one stand so much as five stacked products sold as one. Trackside West (sections 101-103) sits nearest Turn 20, trackside East (118-123) nearest Turn 1, with the Lower Level (104-117) filling the middle on individual seats with armrests. Above that sit the Mezzanine boxes and, higher still, Club Level — the only fully covered tier, looking down over the catch fencing with a genuinely better sightline into pit lane than anything below it. Trackside sections are bench seating with zero cover, so a hot, sun-exposed Saturday qualifying session is a real possibility in late-October Texas, while Lower Level gets partial shade from the structure above and behind it.

Here's the trade-off nobody puts on the ticket page: from the Main Grandstand you can see Turn 20, the start-finish straight, and Turn 1 — and nothing else. The pit building blocks the rest of the lap entirely. COTA puts up four large screens on the garage roofline to cover the gap, which works fine for following the race but isn't the same as watching a car take a corner live. If you want one seat and one seat only, this is still the right call — it has the start, the pit stops, and the podium, the three moments most fans actually came for. If you're building a multi-day plan and can afford a second grandstand, pairing this with something on the back half of the lap (Turn 15's stadium section, for instance) covers what the Main Grandstand physically can't show you.

Every ticket here covers all three main race-weekend days (23-25 October), with a reserved seat, food and drink access, fan zone and merch entry, and a shared TV sightline built into the sun-and-shade calculation above. Tickets are digital-only, issued through the official F1 USA app closer to the event — there's no physical stub to lose, but also no fallback if your phone dies mid-weekend, so download the app and load your ticket before you leave the hotel.`;

const whyItsSpecial = `Most grandstands at most circuits sell you one moment. The Main Grandstand sells you three of the ones people actually remember afterward — the grid rolling to the line, the pit crews working in real time all weekend, and the podium spray at the end. That's a genuinely different proposition from a corner seat that gives you one great overtake and a lot of cars passing in silence between laps. The honest case for paying COTA's highest grandstand prices isn't the racing itself — you'll see less of the actual lap here than almost anywhere else at the track — it's that the moments you do see are the ones with the story already built in. First-timers get the clearest introduction to what a race weekend feels like as a whole event, not just ninety minutes of cars. Returning fans who've already sat trackside for the corners tend to come back here specifically for a podium they can see with their own eyes instead of on a screen.`;

const insiderTips = [
  "If budget allows, Club Level is worth the jump over Lower Level for one specific reason beyond comfort: it's the only fully covered tier, and its elevated position over the catch fencing gives a genuinely clearer view into the pit lane itself than the boxes below it.",
  "The Thursday before race weekend (22 October) now has its own separate ticket — \"Grand PrixView Thursday,\" from $20 — covering F1 Academy track action and early Fan Zone access; it's not included in your Main Grandstand pass and has to be bought on its own if you want that extra day.",
];

const whatToAvoid = `Don't assume "Main Grandstand" means you'll see most of the lap — you physically cannot see any corner between Turn 1 and Turn 20 from this stand; that's the entire back two-thirds of the circuit blocked by the pit building, covered only by the venue's big screens. Trackside sections (101-103 and 118-123) are bench seating with no cover at all — a comfortable-sounding "trackside" name hides the fact that these are the most exposed seats in the whole grandstand for a Texas October sun.`;

const gettingThere = `COTA sits about 15 miles (24km) southeast of downtown Austin. Shuttles run continuously throughout race weekend from two pick-up points — Downtown at Waterloo Park and the Travis County Expo Center — with a journey time of roughly 30 minutes with no traffic, well over an hour on race day itself. Numerous public parking garages between Trinity St and San Jacinto Blvd run around $20/day if driving.`;

const practicalInfo = {
  hours: "Gates typically open 9:00-10:00am each day of the 23-25 October race weekend; exact daily times confirmed closer to the event via the official COTA app",
  costRange: "Official per-tier pricing (Trackside, Lower, Mezzanine, Club Level) is not published on COTA's own ticket page as of this listing — treat any third-party figure you see quoted elsewhere as unconfirmed until COTA's site shows real numbers",
  bookingMethod: "Tickets sell through austin.gp and the official Circuit of the Americas ticket portal. This grandstand has historically been one of the first to sell out at COTA, so buy as soon as your travel dates are fixed rather than waiting to compare every stand first.",
  website: "https://www.austin.gp/en/ticket-info/grandstand-main",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Main Grandstand — Start, Finish, Podium",
      subtitle: "COTA's biggest stand puts you level with the grid, the pits, and the champagne — but only three corners of the lap",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Circuit of the Americas",
      address: "9201 Circuit of the Americas Blvd, Austin, TX 78617",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: austin.gp Main Grandstand ticket page (fetched 5 Sep 2026 — confirmed 3-day access, partially covered, largest grandstand, sold-out status at time of check, no per-tier pricing published), oversteer48.com COTA Main Grandstand view guide (section numbers, sun/shade detail, corner-visibility limitation), the-race.com + speedwaymedia.com (confirmed 2026 4-day weekend structure: main race Fri-Sun 23-25 Oct, new standalone 'Grand PrixView Thursday' 22 Oct at $20, F1 Academy). Google Places API lookup used Circuit of the Americas' own venue rating (4.6/17,782 reviews) since this experience is about watching from within that venue, not a separate rateable place. No Concierge trigger found — standard grandstand ticketing. No Booking.com/GYG affiliate opportunity (ticket product, not hotel/tour). Official per-tier pricing not published as of this research pass — deliberately left unconfirmed in costRange rather than using an unverified aggregator figure ($712-$1,310 seen on third-party sites, not used per skill §2d sourcing bar). Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["iconic", "atmosphere", "podium"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
