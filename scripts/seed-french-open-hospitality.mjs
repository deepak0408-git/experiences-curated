import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "roland-garros-official-hospitality";

const bodyContent = `Official hospitality at Roland-Garros runs through Sodexo Live!, the FFT's own hospitality partner, and it comes in a handful of named rooms rather than one generic VIP tier. Le Pavillon is the flagship: a beach-house-styled dining room with a 500-square-metre terrace looking directly over the practice courts, built for a long, unhurried lunch between sessions. La Mezzanine sits one floor up inside L'Orangerie, a brighter, more informal lounge with screens showing live play and a steady rotation of canapés rather than a seated meal. L'Orangerie itself runs its own seating categories, Category 1 and Category Gold, both with premium Chatrier access built in.

The shape of the day is the same across all of them. Doors typically open around 10am, well ahead of the first match, and stay open through 5:30pm — long enough to eat properly, disappear for a match, come back for another course, and still catch the next session without rushing anywhere. A drinks package is standard: champagne, wine, beer, spirits and soft drinks on a flat rate rather than a tab, alongside sweet and savoury catering that runs from morning pastries through a full lunch to afternoon snacks. It's built explicitly around not queuing for food between matches, which on a hot day in week two of a Grand Slam is worth more than it sounds.

None of this is cheap, and the FFT doesn't pretend otherwise. A single hospitality day, across Le Pavillon, La Mezzanine and L'Orangerie's two seating tiers, runs into four figures in dollar terms once seat category and lunch service are both factored in — our own seeded event data puts the range at roughly $917-1,428 per person per day depending on tier. What you're actually paying for is removing every piece of friction from a day at a Grand Slam: no ticket queue, no food queue, guaranteed seating, and a room to retreat to when the sun or the crowds get to be too much.

Sodexo Live! is the sole official hospitality operator — book through sodexolive-hospitality.com or via Roland-Garros's own hospitality.rolandgarros.com portal, both explicitly named among the FFT's four sanctioned sales channels.`;

const whyItsSpecial = `A Grand Slam day session, done properly, is four to six hours of standing in queues between the tennis you actually came for: security, food, the bar, the bathroom, repeat. Official hospitality removes every one of those queues in one move, and the effect compounds. You're not choosing between watching the match and eating lunch. You do both, in the same afternoon, without either one eating into the other.

Le Pavillon's terrace over the practice courts is the detail that sells it for me. Match tennis is choreographed, tight, controlled. Practice tennis is loose, players trying things, coaches shouting corrections mid-rally. Watching that over lunch, half-attention on the plate and half on the courts below, is a different, more relaxed way to spend part of a tournament day than sitting rigidly in a grandstand seat.

This isn't the tier for someone counting a euro against a ticket price. It's the tier for someone who has already decided Roland-Garros is a once-a-few-years trip and wants the day itself to be as good as the tennis.`;

const insiderTips = [
  "Le Pavillon and La Mezzanine serve different experiences at similar price points — Le Pavillon is a seated lunch service with a view over the practice courts, La Mezzanine is a standing lounge with screens; pick based on whether you want a table or you want to keep moving between matches.",
  "Doors open at 10am, a full session ahead of most match start times — arriving early to eat before the crowds build gets you the calmest version of the room, since it fills up fast once the first break between matches hits.",
];

const whatToAvoid = `Don't book through a third-party "official partner" site you haven't independently confirmed — Sodexo Live! is the sole sanctioned hospitality operator, and Roland-Garros's own fraud-warning pages exist because convincing imitators do appear around ticket season. And don't assume hospitality access includes a guaranteed seat inside Chatrier itself on the day of your choice — the seating category attached to your hospitality package (Category 1 or Category Gold within L'Orangerie) still determines which court and which session you're actually watching; hospitality buys you the room between matches, not a blanket pass to any match you want.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France",
  website: "https://www.sodexolive-hospitality.com/en/roland-garros-tournament, https://hospitality.rolandgarros.com",
  hours: "Hospitality areas typically open 10:00, close around 17:30",
  costRange: "Approx. $917-1,428 per person per day depending on tier (Le Pavillon / La Mezzanine / L'Orangerie Category 1 or Gold) — 2027 pricing not yet published",
  bookingMethod: "Book directly via Sodexo Live!'s official Roland-Garros hospitality page or hospitality.rolandgarros.com. Packages typically go on sale several months ahead of the tournament and sell out well before the event.",
  reservationsRequired: true,
};

const gettingThere = `Same access as standard ticket holders: Porte d'Auteuil (Métro Line 9) is the closest stop, a 10-minute walk from the main entrance. Hospitality ticket holders typically use a dedicated entrance gate — check the confirmation email for the exact gate assignment closer to the event.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Roland-Garros Official Hospitality Packages",
      subtitle: "Le Pavillon, La Mezzanine, L'Orangerie — a full day of tennis with none of the queuing",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Porte d'Auteuil",
      address: "2 Avenue Gordon Bennett, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Package details (Le Pavillon, La Mezzanine, L'Orangerie tiers, catering/drinks inclusions) from sodexolive-hospitality.com and sportstravelhospitality.com. Pricing from seeded planner_ticket_tier_cost (tier4, USD $917-1428), event id e6f2b585-196e-4842-8648-753a40979f4f, seeded 26 Aug 2026 — used as source of truth per skill §2d rather than independently guessed. Verified 4 Sep 2026. Hero image pending — batch image pass to follow per founder direction.",
      moodTags: ["luxurious", "relaxed", "premium"],
      interestCategories: ["sport", "food_and_drink"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      budgetMinCost: "917",
      budgetMaxCost: "1428",
      bestSeasons: ["may"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
