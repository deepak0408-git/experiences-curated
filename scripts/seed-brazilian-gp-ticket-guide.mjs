import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-ticket-guide-" + Date.now().toString(36);

const bodyContent = `Interlagos doesn't sell general admission. Every ticket is grandstand-specific — you buy a letter, and that letter is where you sit for all three days. This is different from circuits like Silverstone or Spa, where a GA wristband lets you wander the grounds and pick a spot; here, your seat is fixed the moment you buy, so the decision matters more than it does elsewhere.

The cheapest tier is uncovered bleacher seating — Grandstand G on the back straight is the entry-level option, and Grandstand A on the main straight's banked entry is a step up in view quality for a similar price bracket, trading shade and a backrest for one of the loudest, most social atmospheres at the track. From there, the covered mid-tier stands (R, H, D) trade the party atmosphere for comfort and a roof, each looking at a different sector of the lap — R near Turn 3 and the back-straight DRS zone, H toward Turn 2 and pit exit, D with food and drink included in the ticket. Grandstand M, also covered with reserved numbered seating, sits at Turn 1 and has historically been one of the first stands to sell out given how well-known that corner is. Grandstand B, on the main straight with reserved covered seating, sits at the top of the standard grandstand range, roughly double Grandstand M's price.

Above the grandstands sit three hospitality tiers. Orange Tree Club and a Heineken-branded fan village occupy the mid-hospitality space — better food and a more social, less strictly-seated environment than a grandstand ticket, without full VIP access. Champions Club sits above that: premium views, elevated catering, and pit-lane-walk access bundled in. F1 Paddock Club is the top tier — positioned directly above the team garages on the main straight, with daily pit lane walks, an open bar, and appearances from F1 personalities as part of the package.

The single most important buying fact for this race: tickets for the 2026 weekend went on sale in November 2025 and multiple grandstands — including M and one of the two main-straight covered stands — were already sold out well before race week. This isn't a circuit where "buy closer to the date and see what's left" is a safe strategy. If a specific stand matters to you, the on-sale window itself is the moment to act, not a target date months later.`;

const whyItsSpecial = `A ticket guide's real job is to save you from buying the wrong seat for the wrong reason, and Interlagos has a specific way of punishing that mistake: no general admission means there's no fallback. Buy Grandstand G expecting Grandstand A's atmosphere and you're stuck on the quiet back straight for three days with no way to relocate. The tiers here aren't marketing language for slightly different camera angles — they're genuinely different weekends, from bleacher chaos to Paddock Club champagne, and this circuit's early sellout pattern means the choice has to be made with real intention, not sorted out once you're already in São Paulo.`;

const insiderTips = [
  "2026 tickets went on sale in November 2025 and several stands, including Turn 1's Grandstand M, sold out within months — if you're planning this trip on a normal 2-3 month lead time, check availability the moment you decide to go rather than assuming a wide selection will still be there.",
  "If atmosphere matters more to you than a specific corner, Grandstand A gives a genuinely wide, elevated sightline into the infield for close to the cheapest price at the circuit — it's a better atmosphere-to-price ratio than most of the covered mid-tier stands, which trade the party for comfort rather than for a meaningfully better view.",
];

const whatToAvoid = `Don't buy assuming you can swap or upgrade once you arrive — Interlagos' grandstand-only model, with no GA fallback, means your ticket is your seat for the entire weekend, not a starting point you can adjust on the ground. And don't treat the covered mid-tier stands (R, H, D) as interchangeable just because they're priced similarly — each faces a completely different sector of the lap, so match the stand to what you actually want to watch (a corner, the pit exit, the DRS zone) rather than picking on price alone.`;

const practicalInfo = {
  hours: "Ticket sales run through official channels year-round until sold out; gates for ticketed weekend access open ahead of each day's first session, 6-8 Nov 2026",
  costRange: "Roughly US$180 (Grandstand G, cheapest) up to US$950+ (Grandstand B, top standard tier) for the 3-day weekend, based on recent secondary-market pricing; Paddock Club-tier hospitality runs into the thousands. Confirm current live pricing directly, since several stands were already sold out as of Sep 2026.",
  bookingMethod: "Buy directly via Formula1.com's official ticketing page for Brazil, which links to the authorized partner. Avoid unofficial resale listings that don't confirm authorization.",
  website: "https://www.formula1.com/en/racing/2026/brazil",
};

const gettingThere = "All grandstands and hospitality areas are accessed via the Autódromo José Carlos Pace's various entry gates, reached from the Autódromo train station (CPTM Line 9) — see the Getting There experience elsewhere in this pack for the full route.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Ticket Guide — Which Grandstand to Buy",
      subtitle: "No general admission at Interlagos — every seat is fixed, so the buying decision matters more here",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Interlagos",
      address: "Autódromo José Carlos Pace, Av. Senador Teotônio Vilela, 261, Interlagos, 04329-030 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tier structure (G/A budget, R/H/D/M mid-covered, B top-standard, Orange Tree Club/Heineken Village/Champions Club/Paddock Club hospitality) sourced from GPDestinations' dedicated ticket-buying guide, 11 Sep 2026. Confirmed absence of general admission via GPDestinations and MotorsportTickets' grandstand guide, both explicit on this point, 11 Sep 2026. Sold-out status for Grandstand M and one main-straight stand confirmed live on brasilf1.com's official ticket pages, 11 Sep 2026. Approximate price range (US$180-950+) sourced from GPDestinations' 2026 budget-planner page — a secondary aggregator, flagged as an estimate since several stands could not be corroborated on the official (sold-out) site directly. Concierge-worthy: yes, this is one of the ~20-30% Concierge-tier picks for this event per the F1 hospitality-tier guideline, but howToBook left empty here since no genuinely tactical, non-generic detail (a real contact/lead-time fact beyond 'buy early') was found during this research pass — flagging for a follow-up pass once real Paddock Club booking-window specifics are sourced.",
      sport: ["formula_one"],
      moodTags: ["practical", "strategic"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #4 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
