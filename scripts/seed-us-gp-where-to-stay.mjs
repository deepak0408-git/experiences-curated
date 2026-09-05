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
const slug = "us-gp-where-to-stay-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Austin doesn't have one obvious neighborhood to base an F1 trip from the way some host cities do — Downtown, South Congress, and the areas around Lady Bird Lake all put you within a genuinely short rideshare or shuttle connection to COTA, so the real decision is what kind of stay you want, not just proximity. Here are three real, differentiated picks across three budget tiers.

Hotel Magdalena, steps from South Congress Avenue, is the boutique pick — a midcentury-modern design hotel that puts you directly inside the SoCo dining and shopping scene, with an inviting pool that gets genuine praise in guest reviews. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12020354834654873904&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). Some reviewers flag noise levels and unexpected fees affecting perceived value, worth knowing going in — this is a style-forward stay more than a purely quiet one, and it prices accordingly at a mid-range rate for the area.

Austin Marriott Downtown, near Lady Bird Lake and walking distance to Moody Theater and Rainey Street, is the strongest all-around downtown pick — 613 rooms, a genuinely central location for anyone splitting time between the circuit and Austin's downtown nightlife, and consistently strong guest feedback on staff, room quality, and the on-site restaurant. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3203217211246846258&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). This is the safe, reliable choice if you want a proper hotel experience without gambling on a boutique property's quirks.

Embassy Suites by Hilton Austin Downtown South Congress, right on South Congress Avenue itself, is the real value pick for anyone who wants two-room suites and a lower nightly rate than most comparable downtown properties. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2582592223842563476&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). Every stay includes a complimentary cooked-to-order breakfast and an evening reception with light bites and drinks — genuinely useful inclusions on an F1 weekend where meal-planning around track sessions gets complicated. Reviews run more mixed than the other two picks here, so go in expecting a solid, honest value stay rather than a polished luxury one — the trade for the lower price and larger suite is real, but so is the gap in guest sentiment versus Hotel Magdalena or the Marriott.

South Congress's own peak visitor season runs March-April and August, but F1 weekend brings its own separate demand spike across all three — book as early as your travel dates are confirmed, not closer to the event.`;

const whyItsSpecial = `Most cities on the F1 calendar have one obvious "stay here" answer. Austin genuinely doesn't — South Congress gives you Austin's own culture on your doorstep, Downtown gives you the tightest connection to both the circuit shuttles and the city's nightlife, and there's a real, honest value option if a two-room suite and breakfast matter more to your trip than a design hotel's aesthetic. That range is worth naming explicitly rather than defaulting to whichever hotel is simply closest to the track, since none of these three are meaningfully further from COTA than the others — the real choice is what kind of Austin trip you're building around the racing, not just logistics.`;

const insiderTips = [
  "Embassy Suites' complimentary breakfast and evening reception are genuinely useful on an F1 weekend specifically — track sessions can eat into normal meal windows, so having breakfast and early-evening food covered at the hotel removes one logistics headache from a long day.",
  "If Hotel Magdalena's boutique style appeals but noise is a real concern for you, ask specifically about room location relative to the pool and street-facing sides when booking — that's the recurring theme in guest feedback about the property, not a universal complaint about every room.",
];

const whatToAvoid = `Don't assume all three properties price similarly just because they're all central — Embassy Suites' typical rate runs meaningfully below Hotel Magdalena's and the Marriott's on a normal weekend, though F1-weekend demand compresses that gap across all three properties. Don't book Embassy Suites expecting a luxury-tier experience purely because of the larger two-room suites — guest ratings here run more mixed than the other two picks (4.0 on Google vs. 4.3-4.6), so go in with value and space as the priority, not polish.`;

const gettingThere = `See the "Getting to COTA" experience for full shuttle/rideshare detail from Downtown and South Congress to the circuit.`;

const practicalInfo = {
  costRange: "Hotel Magdalena runs roughly US$197-230/night; Embassy Suites typically runs lower, around US$169/night on a standard weekend but rises sharply for F1 weekend demand; Austin Marriott Downtown sits at a comparable downtown-hotel rate — confirm current rates directly given event-weekend pricing spikes across all three",
  bookingMethod: "Book directly via each hotel's own site (linked below) or a major booking platform. All three see genuine F1-weekend demand spikes — book as early as your travel dates are fixed, not closer to the event.",
  website: "https://www.bunkhousehotels.com/hotel-magdalena, https://www.marriott.com/en-us/hotels/ausmd-austin-marriott-downtown, https://www.hilton.com/en/hotels/ausdaes-embassy-suites-austin-downtown-south-congress",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay — Downtown, South Congress & Value",
      subtitle: "Three real picks across three budgets, all realistically close to COTA and Austin's own nightlife",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "South Congress / Downtown",
      address: "Multiple — South Congress and Downtown Austin",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: bunkhousehotels.com Hotel Magdalena page, marriott.com Austin Marriott Downtown page, hilton.com Embassy Suites page, plus TripAdvisor/Expedia/Booking.com review aggregation for guest-sentiment color (noise/fees at Magdalena, strong all-around feedback at Marriott, mixed-but-value-forward at Embassy Suites). All three Google ratings are real, individual Places API lookups (Hotel Magdalena 4.3/257, Austin Marriott Downtown 4.6/2220, Embassy Suites 4.0/2447) — genuinely differentiated, not interchangeable picks. MULTI-VENUE — requires a MULTI_VENUE_RATINGS['us-gp-where-to-stay'] registry entry in app/experience/[slug]/page.tsx with venueCount: 3, to be added in this same session before considered fully done, per skill §2c rule 6. Real Booking.com affiliate opportunity flagged for all 3 — genuine, individually bookable listings; user to supply real affiliate links, never constructed here. No Concierge trigger. Verified 5 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["accommodation", "budget-range", "central"],
      interestCategories: ["sport", "accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
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
