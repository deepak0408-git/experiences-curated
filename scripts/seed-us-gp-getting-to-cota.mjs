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
const slug = "us-gp-getting-to-cota-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Circuit of the Americas sits about 15 miles (24km) southeast of downtown Austin and roughly 12 miles from Austin-Bergstrom International Airport (AUS) — genuinely close on paper, and genuinely slow in practice once race weekend traffic sets in. In normal conditions, the airport-to-circuit drive takes 15-20 minutes; during the event, treat that as a floor, not an estimate.

The official shuttle is the most reliable way in and out, running continuously from two pickup points — Downtown at Waterloo Park and the Travis County Expo Center — with a stated journey time of about 30 minutes with no traffic, well over an hour on race day itself. It's popular enough that seats sell out before race day, so book this in advance rather than assuming you can decide the morning of.

Rideshare works differently than you'd expect from most venues: COTA Blvd is restricted to permitted vehicles during the event, so Uber and Lyft pickup and drop-off happens from the McAngus lot, a genuine 20-30 minute walk from the main gates, not a curbside drop at the entrance. Airport rideshares to COTA typically run $25-40 outside event pricing, taxis $45-50 — but the real number to plan around is what happens after the race. Post-race rideshare waits of 2-3 hours are standard, with surge pricing commonly hitting $150-300+ back to downtown. If driving yourself, public parking garages between Trinity St and San Jacinto Blvd run around $20/day.

The single most useful tactic for the exit crunch: the worst congestion window runs roughly 1-2 hours after the chequered flag. Leaving the grandstand about 30 minutes before the race actually ends, or deliberately staying put for 45 minutes after the crowd starts moving — grabbing food, browsing the fan shop, not rushing for the gate — both beat the bulk of that window. Racing to be first out the gate the moment the race ends is, by every account, the worst possible strategy.`;

const whyItsSpecial = `This isn't really an "experience" in the usual sense — it's the one piece of practical knowledge that determines whether your race day ends well or ends with three hours in a parking lot. COTA's own transport setup rewards patience and planning in a way that isn't obvious until you've either read about it or lived through it once: the shuttle sells out, the rideshare drop-off isn't where you'd assume, and the instinct to leave the second the race ends is exactly the wrong move. Getting this right doesn't improve the race itself, but getting it wrong is the single most common complaint from first-time COTA visitors, and it's entirely avoidable with the right information going in.`;

const insiderTips = [
  "Arrange your return rideshare trip in advance if possible, or at minimum know before you leave the circuit that pickup is from the McAngus lot — a 20-30 minute walk from the gates — not a curbside spot near the exit.",
  "The worst post-race congestion runs for roughly 1-2 hours after the flag — leaving your seat about 30 minutes before the finish, or staying on-site for food and shopping for 45 minutes after the crowd starts moving, both beat the bulk of that window; trying to be first out the gate is consistently the worst outcome.",
];

const whatToAvoid = `Don't assume you can walk up and book the official shuttle on race day itself — it's popular enough to sell out before the event even starts, so treat it as something to arrange when you book your tickets, not a same-week decision. Don't expect a normal rideshare experience on race day — there's no curbside pickup at the gates, pricing surges heavily post-race (commonly $150-300+ to downtown), and waits of 2-3 hours are standard immediately after the chequered flag, not an occasional worst case.`;

const gettingThere = `15 miles (24km) from downtown Austin, 12 miles from Austin-Bergstrom International Airport (AUS) — 15-20 minutes in normal traffic, significantly longer during the event.`;

const practicalInfo = {
  hours: "Shuttles run continuously throughout each day of the 23-25 October race weekend; exact timetable published closer to the event",
  costRange: "Official shuttle pricing varies by pass; rideshare to COTA typically $25-40 outside event surge, post-race surge commonly $150-300+; parking garages downtown run around $20/day",
  bookingMethod: "Book official race-weekend shuttle passes through circuitoftheamericas.com in advance — they sell out before race day. Rideshare pickup/drop-off is the McAngus lot, not the circuit gates directly.",
  website: "https://circuitoftheamericas.com/event/f1/",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to COTA — the Traffic Reality",
      subtitle: "15 miles from downtown Austin, and the post-race exit is the part nobody warns you about",
      slug,
      experienceType: "transit",
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
        "Sources: oversteer48.com COTA Parking Guide + Shuttle Service Guide (McAngus lot rideshare pickup, 20-30 min walk, shuttle sell-out pattern, post-race congestion timing tactic), grandprixpal.com Getting to Circuit of the Americas 2026 (distance/time figures, rideshare pricing $25-40 normal / $150-300+ post-race surge, 2-3hr post-race wait standard). Multiple independent aggregator sources broadly agree on pricing figures — treated as reasonably reliable directional numbers per §2d, flagged as typical/estimated since these are third-party rideshare/taxi rates, not something COTA itself publishes officially. No Concierge trigger, no affiliate opportunity — pure logistics content. Google Places rating reused from Circuit of the Americas' own venue listing. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["practical", "logistics"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
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
