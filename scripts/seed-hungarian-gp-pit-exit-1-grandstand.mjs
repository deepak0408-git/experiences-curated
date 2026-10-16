import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

// New experience, part of the grandstand-experience restructure following
// the Ticket Intelligence build (16 Oct 2026). Pit Exit 1 had no dedicated
// write-up before this. Real sector/row detail sourced from oversteer48.com's
// dedicated review — note that review references a neighbouring "Pit Exit 2"
// stand, which does NOT appear on the official Hungaroring circuit map
// (gpticketshop.hu, confirmed 16 Oct 2026, founder-supplied screenshots) —
// that name is deliberately NOT repeated here as a real, current stand.
// Pricing grounded in this event's own seeded planner_ticket_tier_cost
// (tier2, standard grandstands, $259-464).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "pit-exit-1-grandstand-" + Date.now().toString(36);

const bodyContent = `Pit Exit 1 was Gold 3 before the 2025 renaming, and it sits on the outside of the circuit at the end of the start-finish straight, directly across from where cars actually rejoin the track out of the pit lane. Six sectors, A through F skipping no letter but only 12 rows deep, shallower than most grandstands here. Sector A sits closest to Turn 1, Sector F closest to the start-finish line.

The pit exit itself is the reason to book this specific stand. You're looking straight across at cars merging back onto the racing line, which sounds like a minor detail until you remember that's exactly where a driver coming out on cold tyres, or rejoining under pressure from a car already on track, produces some of the scrappier, more interesting moments of a race weekend. Turn 1's braking zone and apex are visible to the left from here too, so you get both: the merge point and the start of the corner that decides it, in the same sightline.

Row matters more than usual at this stand because it's genuinely shallow. Sector A or B, row 8 and above, is the real recommendation, high enough to see cleanly over the barriers without losing the apex. Lower rows and the sectors further toward F lose both the start line, blocked by larger grandstands further along, and increasingly the Turn 1 apex itself. Two screens sit across the track from roughly the stand's middle, one slightly further right, so even a mediocre seat here keeps you connected to what's happening elsewhere on track.

It's an honest alternative rather than a first choice if Turn 1 drama specifically is what you're after, the T1 grandstand next door sells a cleaner, more committed version of the same braking-zone view. What Pit Exit 1 adds that T1 doesn't is the merge point itself, worth having if you want the fuller picture of how cars actually navigate this end of the lap rather than just the corner.`;

const whyItsSpecial = `Most grandstands at the Hungaroring sell you a single moment, repeated lap after lap. Pit Exit 1 sells you a junction instead, the spot where pit strategy and raw cornering collide, cars rejoining from the pits right alongside cars already committed to Turn 1's braking zone. That's a genuinely different kind of racing to watch than a clean corner in isolation, messier, less predictable, and often more revealing about who's actually managing their tyres and their position under real pressure.

It's not the showiest seat at the circuit, and it knows it, this is a stand built around traffic and timing rather than a single dramatic apex. But for anyone who finds the tactical side of a race as compelling as the pure speed of it, watching exactly where strategy calls meet the track is its own specific reward, one the more famous grandstands further round the lap don't really offer.`;

const insiderTips = [
  "Book Sector A or B, row 8 or above — this stand is genuinely shallow at only 12 rows, so going high matters more here than at most Hungaroring grandstands if you want a clean view over the barriers.",
  "If Turn 1 drama alone is the priority, book the T1 grandstand next door instead — Pit Exit 1 is the honest backup option, strongest specifically for watching cars merge out of the pit lane, not for the purest corner view.",
  "Sectors further toward F lose the start line behind larger grandstands further along the straight — stick to A or B if seeing any part of the start/finish line matters to you.",
];

const whatToAvoid = `Don't book the lower rows expecting a clean view, the stand's shallow 12-row depth means rows 1 through 4 genuinely lose the apex and much of the braking zone behind the barriers in a way taller stands elsewhere don't suffer from. And don't assume this gives you the same Turn 1 experience as the T1 grandstand next door — the pit-lane merge is this stand's real strength, and treating it as a cheaper substitute for T1's pure corner view is likely to leave you wanting the neighbouring stand instead.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race weekend days; grandstand seating holds for the full day once sessions begin",
  costRange: "Roughly US$464 (3-day), among the higher-priced standard grandstands at this event",
  bookingMethod: "Book via the official reseller gpticketshop.hu or tickets.formula1.com. Pit Exit 1 is a genuine Turn 1-area alternative and sells out less aggressively than T1 itself, but still worth booking ahead.",
  website: "https://www.gpticketshop.hu, https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Pit Exit 1 — Where Strategy Meets the Corner",
      subtitle: "Cars rejoining from the pits and Turn 1's braking zone, in the same sightline.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "M2 metro to Örs vezér tere, then HÉV suburban rail toward Kerepes, then the free circuit shuttle to Gate 8 — the grandstand's own nearest entrance.",
      editorialNote: "Sources: oversteer48.com's Pit Exit 1 grandstand review (sector/row layout, former Gold 3 name, sightline detail). Review references a neighbouring 'Pit Exit 2' stand not reflected on the official Hungaroring circuit map (gpticketshop.hu, founder-supplied screenshots, 16 Oct 2026) — deliberately not repeated here as a real current stand name. Pricing grounded in seeded planner_ticket_tier_cost tier2 row for this event. New experience, 16 Oct 2026 — fills a real coverage gap surfaced by the Ticket Intelligence seat-inventory build.",
      sport: ["formula_one"],
      moodTags: ["tactical", "intense"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
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
