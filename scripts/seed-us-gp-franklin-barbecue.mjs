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
const slug = "us-gp-franklin-barbecue-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Franklin Barbecue has the kind of reputation that sounds exaggerated until you've actually eaten there: a James Beard Award, a public endorsement from Barack Obama, and a Google rating of 4.7 from over 7,200 reviews that stays remarkably consistent — reviewers describe genuinely no off days, no bad cuts, meat that holds up every single time. It's widely treated as the reference point for what Texas brisket is supposed to taste like, not just one good option among many.

The line is the actual experience, and it's worth understanding before you commit a morning to it. Franklin opens at 11am Tuesday through Sunday and sells out by mid-afternoon most days — typically 3-4pm — closed Mondays entirely. Weekday waits run 2-3 hours; weekends push to 4-5 hours, and serious regulars start arriving as early as 6-7am to secure a spot near the front. Arrive around 9:30am on a Saturday and you're already roughly 40th in line — arrive after 1pm on a busy day and you're genuinely gambling on whether they sell out before you reach the counter.

The line itself has its own culture. Regulars tailgate it — camp chairs, a cooler, breakfast tacos, coffee — and Franklin's own staff walk the queue giving wait-time updates and estimates on which cuts are likely to sell out first. There's a shaded, west-facing patio with free chairs provided for early arrivals, which matters more than it sounds like once the Texas sun gets going.

Worth knowing precisely: the main restaurant at 900 E 11th St is still first-come, first-served with no advance reservations for regular dining, despite some headlines about Franklin "taking reservations" — that refers only to Franklin Backyard, a separate private event space nearby for large group bookings, not a way to skip the line for a normal meal. The one real shortcut that does exist: online pre-orders for pickup, with a 5-pound minimum, a workable option if you're feeding a group and can plan ahead rather than showing up cold.`;

const whyItsSpecial = `The wait isn't incidental to the Franklin experience, it's arguably part of the point — this is one of the last genuinely famous restaurants in America you can't buy or reserve your way into, only queue for. That scarcity is exactly what's built the mythology, and it's honest in a way a lot of hyped restaurants aren't: nobody's promising you'll get in faster if you know somebody, and the brisket has to actually be good enough every single day to justify people choosing to lose half a morning for it. For a race weekend built around F1's own hierarchy of paddocks, hospitality tiers, and premium access, Franklin is the one genuinely democratic institution in Austin — everyone, famous or not, stands in the same line.`;

const insiderTips = [
  "If your race-weekend schedule genuinely can't absorb a 4-5 hour wait, the online pre-order (5-pound minimum) for pickup is a real way to get Franklin's brisket without the line — worth organizing as a group order if a few of you are traveling together, since the minimum makes more sense split multiple ways.",
  "Arriving around 9:30am on a weekend already puts you roughly 40th in line — if a shorter wait matters more than being first, a weekday visit during your F1 trip cuts the wait to 2-3 hours instead of 4-5.",
];

const whatToAvoid = `Don't believe headlines claiming Franklin "takes reservations" for regular dining — that refers only to Franklin Backyard, a separate private event space for large group bookings, not the main restaurant; walk-in queue is still the only way to eat here on a normal day. Don't show up after 1pm on a busy day expecting a normal wait — Franklin genuinely sells out most days by mid-afternoon, and arriving late in the window means real risk of missing out entirely, not just a longer line.`;

const gettingThere = `East Austin, roughly a 10-15 minute drive or rideshare from downtown. No dedicated parking lot, so budget time to find street parking nearby.`;

const practicalInfo = {
  hours: "Tuesday-Sunday, 11am until sold out (typically 3-4pm); closed Mondays",
  costRange: "Priced by the pound at the counter — moderate for a full plate, though exact per-pound pricing shifts; the online pre-order minimum is 5 pounds",
  bookingMethod: "No reservations for regular dining — it's genuinely first-come, first-served, line only. If you can't commit to the wait, order online for pickup (5-pound minimum) instead.",
  website: "https://franklinbbq.com",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Franklin Barbecue — the Line, Explained",
      subtitle: "A James Beard Award and an Obama endorsement, guarded by a 4-5 hour wait that starts before sunrise",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "East Austin",
      address: "900 E 11th St, Austin, TX 78702",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: franklinbbq.com (hours, official site), michelin guide (recognition detail), bestbiteguide.com + travelsofjenna.com (line-timing specifics: weekday 2-3hr, weekend 4-5hr, 9:30am Saturday = ~40th in line, sell-out typically 3-4pm, 5lb online pre-order minimum), aol.com/culturemap (corrected an initial loose 'now accepting reservations' framing — verified this applies only to Franklin Backyard, a separate private event space, not the main restaurant's regular first-come-first-served dining). No Concierge trigger — line-only dining, no genuine tier/lead-time trap beyond what's already public. No Booking.com/GYG affiliate opportunity (no bookable reservation product). Google Places API lookup: real, individual result (4.7/7,242 reviews). Verified 5 Sep 2026.",
      googleMapsRating: "4.7",
      googleMapsReviewCount: 7242,
      googleMapsUrl: "https://maps.google.com/?cid=3579139785445756036&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["iconic", "foodie", "local-institution"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
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
