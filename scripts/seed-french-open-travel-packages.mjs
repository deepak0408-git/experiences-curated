import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "roland-garros-travel-official-packages";

const bodyContent = `Roland-Garros Travel is the tournament's own answer to the "where do I even start" problem. Run directly by the FFT at travel.rolandgarros.com, it bundles a match ticket with one or two nights in a partner hotel, sold as a single package rather than two separate bookings you have to coordinate yourself. The hotel partner is Accor, and the range genuinely spans the group's full ladder — from 2-star options up to Accor's Palace-tier properties — so the package works whether the goal is a functional bed near the Métro or a genuinely luxurious stay to match a final-weekend ticket.

Packages are built around specific rounds rather than sold as a generic "any day" product. First Round packages cover the tournament's opening days; Quarter-Final and Finals packages sit at the other end, priced up and typically requiring earlier booking since the matchups (and therefore the appeal) aren't known until the tournament is already underway. Buying a Finals package months ahead is a bet on being in Paris for the last weekend regardless of who's actually playing — for many buyers, watching a Grand Slam final in person outweighs which two names are on the scoreboard.

The appeal isn't really the discount, though a 10% reduction on official Roland-Garros store merchandise is included as a small extra. It's the removal of a genuinely fiddly logistics problem: matching hotel availability to ticket availability to the actual match schedule, across a city where hotel rooms anywhere near the 16th arrondissement get scarce fast once the tournament is confirmed. Roland-Garros Travel does that matching for you, guarantees both pieces come from a legitimate source, and hands you one confirmation instead of two.`;

const whyItsSpecial = `The single hardest part of planning a first Roland-Garros trip isn't the tennis — it's Paris hotel availability colliding with tournament dates that shift a little every year and ticket categories that are genuinely confusing on a first read. Roland-Garros Travel exists specifically to remove that friction, and it's built by the people who actually run the tournament, not a third-party aggregator guessing at what pairs well together.

The Accor partnership is the detail that makes it worth using rather than just booking a hotel yourself. Accor's range from budget to Palace means the package scales with how much of a trip this is meant to be — a functional visit for the tennis, or the kind of once-a-few-years occasion that calls for a proper hotel to match. Either way, you're booking through the same official channel that sells the ticket, which for an event this popular with counterfeit resale risk is worth something on its own.`;

const insiderTips = [
  "Finals packages go on sale before the actual finalists are known — booking one is a bet on being in Paris for the last weekend of the tournament regardless of matchup, and they sell out well before the semi-finals are played.",
  "The Accor hotel tier is selectable within each package (2-star through Palace) — decide the trip's real budget first, since the ticket price is fixed but the hotel choice is where the total cost swings hardest.",
];

const whatToAvoid = `Don't leave a Quarter-Final or Finals package until the matchups are known if budget is a real constraint — by the time the draw makes a match genuinely appealing, the corresponding package has often already sold out or jumped in price. And don't assume every Accor property in the package range is actually walkable to the stadium — some tiers place you well outside the 16th arrondissement with a Métro or RER connection required; check the specific hotel's location before assuming proximity, since "Paris" on a booking page can mean anywhere in the greater metropolitan area.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France",
  website: "https://travel.rolandgarros.com/en",
  hours: "Bookable online year-round once each round's packages are released",
  costRange: "Varies significantly by round and hotel tier — First Round packages start well below Finals packages, which price in both scarcity and a guaranteed Accor Palace-tier option",
  bookingMethod: "Book directly at travel.rolandgarros.com — select tournament round first, then choose from the available Accor hotel tiers for that round's package.",
  reservationsRequired: true,
};

const gettingThere = `Package hotels vary in location by tier — Accor properties range from directly Métro-connected central Paris hotels to properties further out requiring an RER or longer Métro ride to Porte d'Auteuil (Line 9), the closest stop to the stadium. Confirm the specific hotel's distance to Roland-Garros before booking if minimizing daily travel time matters.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Roland-Garros Travel — Official Ticket + Hotel",
      subtitle: "The tournament's own bundled packages, ticket and Accor hotel in one booking",
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
      editorialNote: "Package structure (round-based packages, Accor partnership, 2-star to Palace range) from travel.rolandgarros.com official site, confirmed live with 2027 packages already listed (First Round, Quarter Finals, Finals). Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["convenient", "premium", "practical"],
      interestCategories: ["sport", "accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
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
