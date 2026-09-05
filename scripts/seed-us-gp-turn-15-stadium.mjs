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
const slug = "us-gp-turn-15-stadium-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Turn 15 sits inside what COTA calls its stadium section, and it's the one part of the track built to look like one — grandstands wrapping around a run of corners rather than facing a single straight. The ticket actually covers two separate stands: a smaller Corner Grandstand (sections 1-7, up to 34 rows) and a larger Main Grandstand (sections 8-25, up to 35 rows), both looking into the same run of track. From here you get Turns 13, 14, and 15 clearly, a look at part of Turn 12, and — from the higher rows specifically — glimpses further round the lap toward the Esses, Turn 6, and Turn 9. It's the closest thing at COTA to watching several genuinely different phases of a lap without changing seats.

Section choice matters more here than at most COTA stands. The clearest advice from people who've actually sat in every part of this grandstand: aim for sections 2-7 in the Corner Grandstand, row 20 or higher, for the best combined view of the back straight and the Turn 12 overtaking zone. Go lower than that and catch fencing starts eating into your sightline — sit right at the front and your view genuinely narrows, which isn't true of every grandstand at this track. As at Turn 1, there's a real sun advantage here too: for most of the day the sun sits behind you rather than in your eyes, which matters across a long October afternoon session.

Like every COTA grandstand, this one is fully open — no roof, no shade structure, full chairs with folding bases, fixed backs, cupholders and armrests. What sets Turn 15 apart practically is proximity to the Grand Plaza's food vendors, genuinely closer here than from most other stands, plus two giant screens covering whatever's happening elsewhere on track. As of this listing, austin.gp has the 3-day Turn 15 ticket priced at $1,399 (reduced from $1,429) — one of the few COTA grandstands with an actual published number rather than an unlisted tier structure, though treat it as the current asking price rather than a fixed figure, since race-weekend pricing on official sites does move.

Every ticket covers all three main race-weekend days, reserved seating, fan zone and fan shop access, food and drink options, and the same digital-only delivery through the official app as every other COTA grandstand.`;

const whyItsSpecial = `The Main Grandstand gives you the start and the podium. Turn 1 gives you elevation and one dramatic corner. Turn 15 gives you something neither of those can: a genuine sense of a full lap's variety from one seat, five corners' worth of racing character instead of one moment repeated. For anyone who's already done a season-opener-style single-corner seat somewhere else and wants COTA to feel less like a highlight reel and more like a real circuit, this is the stand that delivers it. The stadium-style wraparound design also just feels different in person — you're not watching cars pass in front of you once per lap, you're watching them work through a sequence, which is closer to how F1 drivers themselves describe a track's real character.`;

const insiderTips = [
  "Book sections 2-7 in the Corner Grandstand, row 20 or above, specifically — this combination gives the best sightline to both the back straight and the Turn 12 overtaking zone, while lower rows anywhere in this grandstand start losing view behind the catch fencing.",
  "This stand sits genuinely closer to the Grand Plaza's food vendor cluster than most other COTA grandstands, worth factoring in if a shorter walk for food between sessions matters to your day.",
];

const whatToAvoid = `Don't book the front rows assuming "closest to the track" automatically means "best view" — sitting too low here puts the catch fencing directly in your sightline in a way that genuinely limits what you can see, unlike some of COTA's other stands. Don't expect to see the full lap from here despite the stadium-section framing — you're seeing five corners in one direction, not the whole circuit; the start-finish straight, Turn 1, and most of the back half of the lap are out of sight from this grandstand.`;

const gettingThere = `COTA sits about 15 miles (24km) southeast of downtown Austin. Shuttles run continuously throughout race weekend from two pick-up points — Downtown at Waterloo Park and the Travis County Expo Center — with a journey time of roughly 30 minutes with no traffic, well over an hour on race day itself. Numerous public parking garages between Trinity St and San Jacinto Blvd run around $20/day if driving.`;

const practicalInfo = {
  hours: "Gates typically open 9:00-10:00am each day of the 23-25 October race weekend; exact daily times confirmed closer to the event via the official COTA app",
  costRange: "Listed on austin.gp at US$1,399 for the 3-day pass (reduced from US$1,429) as of this research pass — confirm current price directly before booking, since official race-weekend pricing can move",
  bookingMethod: "Tickets sell through austin.gp and the official Circuit of the Americas ticket portal. If the listing shows sold out, join the notification list — COTA's popular grandstands regularly release additional inventory as the event approaches.",
  website: "https://www.austin.gp/en/ticket-info/grandstand-turn-15",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Turn 15 — the Stadium Section's Best Seat",
      subtitle: "Five corners, two grandstands, and the closest thing COTA has to a proper amphitheater",
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
        "Sources: austin.gp Turn 15 ticket page (fetched 5 Sep 2026 — confirmed US$1,399/3-day, reduced from $1,429, one of the few COTA grandstands with published pricing), oversteer48.com COTA Turn 15 view guide (Corner Grandstand sections 1-7 vs Main Grandstand 8-25, sun-position advantage, catch-fencing drawback at low rows, food-vendor proximity). Google Places rating reused from Circuit of the Americas' own venue listing (4.6/17,782). No Concierge trigger (price is already public, no lead-time secret to gate), no affiliate opportunity. Price treated as current asking price per §2d — officially sourced from austin.gp itself, but flagged as subject to change. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["atmosphere", "value", "variety"],
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
