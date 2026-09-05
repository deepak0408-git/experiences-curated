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
const slug = "us-gp-turn-1-big-red-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Turn 1 at Circuit of the Americas has an official name now: Big Red, given in a 2020 renaming ceremony to honor Red McCombs, the track's largest early investor and co-founder — the same man behind Clear Channel Communications and a former owner of the San Antonio Spurs. The name is painted across the run-off area in letters big enough to see from the grandstand, and it's earned. This is a tight, blind, uphill hairpin sitting at the top of an 11% gradient climb, 30.9 metres of elevation gain from the start line to the apex — a track feature genuinely unlike anything else on the F1 calendar.

The grandstand itself runs 7 sections holding over 3,700 seats, and where you sit changes what you actually see. Lower section numbers — 1 to 4 — put you closer to the track for the corner itself. Higher rows trade that proximity for a genuinely panoramic view: from up top you get the entire start-finish straight, pit road, the corner, and the run down into Turn 2, with Turns 3-4 visible and — bring binoculars — even a look across to Turns 16-20 on the far side of the infield. Sections 5-7 have to look left to catch Turn 1 cleanly, and the grandstand across the track at Turn 4 can partially block that sightline, so if the corner itself is what you're here for, don't default to the highest row just because it looks like the best view on paper.

One real, practical edge this stand has over most others at COTA: the sun sits behind the Turn 1 grandstand for most of the day, which matters more than it sounds like in central Texas in October. That said, "behind the sun" doesn't mean "covered" — this stand is fully open to the elements, chairs with folding bases, fixed backs, cupholders and armrests, but no roof and no shade structure. A toilet block and shop sit directly behind the stand, and a giant infield screen is visible from every seat, so you're not purely dependent on the live view for what's happening elsewhere on track.

Every ticket covers all three main race-weekend days, with the standard reserved-seat, fan zone, fan shop, food and drink inclusions. Tickets are digital-only through the official app, and — worth knowing before you click buy — COTA's own policy states plainly that once your order is confirmed, it cannot be cancelled or refunded.`;

const whyItsSpecial = `Most grandstands at most circuits give you either the start or a good corner — Big Red gives you both from the same seat, and adds a piece of track nothing else in F1 replicates. There's something genuinely different about watching cars claw up an 11% incline into a blind apex compared to watching them simply pass by at speed on a flat section; you can see the cars actually working, not just moving. It's also the one corner at COTA with a real, deliberate identity — a name chosen to honor a specific person's role in getting this track built at all, not a generic "Turn 1" label. For a first-time F1 visitor trying to understand why circuit design matters, Big Red is close to the clearest single example on the calendar: elevation, a blind approach, and the start-finish straight, all visible from one grandstand.`;

const insiderTips = [
  "If watching the corner itself matters more to you than the widest panoramic view, book sections 1-4, not the highest rows — sections 5-7 have to look left across the track to see Turn 1 cleanly, and the Turn 4 grandstand can partially block that angle.",
  "The sun sits behind this grandstand for most of race day, a genuine and rare advantage over most other COTA stands — but it's still a fully open, unshaded seat, so bring sun protection regardless of which section you book.",
];

const whatToAvoid = `Don't buy expecting any flexibility if plans change — COTA's own ticket terms state that once an order is confirmed for this grandstand, it cannot be cancelled or refunded, no exceptions listed. Don't assume the highest, most panoramic-looking row is automatically the best seat for this specific corner — the higher up you go, the further you are from the actual hairpin action, and sections 5-7 lose a clean sightline to Turn 1 itself.`;

const gettingThere = `COTA sits about 15 miles (24km) southeast of downtown Austin. Shuttles run continuously throughout race weekend from two pick-up points — Downtown at Waterloo Park and the Travis County Expo Center — with a journey time of roughly 30 minutes with no traffic, well over an hour on race day itself. Numerous public parking garages between Trinity St and San Jacinto Blvd run around $20/day if driving.`;

const practicalInfo = {
  hours: "Gates typically open 9:00-10:00am each day of the 23-25 October race weekend; exact daily times confirmed closer to the event via the official COTA app",
  costRange: "Official per-tier pricing is not published on COTA's own ticket page as of this listing — this is one of COTA's most popular stands and has historically sold out quickly, so treat any third-party price figure as unconfirmed until the site itself lists real numbers",
  bookingMethod: "Tickets sell through austin.gp and the official Circuit of the Americas ticket portal. This is consistently one of the first grandstands to sell out at COTA — buy the moment your travel dates are fixed. Note COTA's own no-cancellation, no-refund policy before purchasing.",
  website: "https://www.austin.gp/en/ticket-info/grandstand-turn-1",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Turn 1 \"Big Red\" — the Hill and the Hairpin",
      subtitle: "An 11% climb to a blind apex, named for the man who built the track — arguably COTA's single best seat",
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
        "Sources: austin.gp Turn 1 ticket page (fetched 5 Sep 2026 — confirmed sold-out status, 3-day access, no-refund policy, no published per-tier pricing), oversteer48.com COTA Turn 1 view guide (7 sections/3,700+ seats, section-numbering strategy, sun-position advantage, blind-spot detail), ESPN + circuitoftheamericas.com (Big Red naming history — Red McCombs, 2020 renaming, 11% gradient, 30.9m elevation change). Google Places rating reused from Circuit of the Americas' own venue listing (4.6/17,782) since this is about watching from within that venue. No Concierge trigger, no affiliate opportunity. Official per-tier pricing not published — deliberately left unconfirmed per skill §2d rather than citing an aggregator figure. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["iconic", "atmosphere", "history"],
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
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
