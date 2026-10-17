import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Fixes stale-2026 content found in the 16 Oct 2026 content-rollover audit,
// across the 3 original (pre-restructure) experiences that had real
// year-specific facts: Ticket Guide, F1 Fan Lounge, Camping. Dates/URLs per
// founder-supplied corrections; prices pulled from this session's already-
// researched 2027 planner_ticket_tier_cost + circuit_seating_profile rows
// (real sourced figures, not re-guessed) rather than re-researching from
// scratch. All 20 live/in_review experiences get lastVerifiedDate bumped to
// today regardless of whether their own content changed, per founder
// instruction.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// 1. Ticket Guide — dates, URL, pricing all rolled to 2027
await db
  .update(experiences)
  .set({
    bodyContent:
      "The Hungarian Grand Prix has a reputation as one of the cheapest weekends on the F1 calendar, and the numbers back it up. A 3-day General Admission ticket runs around $184, a fraction of what the same tier costs at Spa or Monza. Grandstand seats start from around $259 for the weekend. That combination of low prices and guaranteed good weather (Budapest in late July rarely disappoints) means Hungary sells out most years, even with modest attendance compared to the calendar's marquee rounds.\n\nGeneral Admission gets you the open hillside that rings the circuit's natural bowl, no fixed seat, but real elevation and real sightlines across multiple corners, plus Fan Zone access. It's genuinely good here in a way GA isn't everywhere, the terrain does the work that a grandstand does elsewhere. If you want a seat, T1 and the Hungaroring Grandstand are the two most requested, for the braking zone into Turn 1 and the only covered view on the main straight respectively. The Hungaroring Grandstand commands a premium for exactly that reason, shelter matters in a Hungarian July, where afternoon storms are common even on an otherwise 30°C day.\n\nAbove grandstand level, F1's own hospitality tiers stack up clearly: the F1 Fan Lounge (around $2,106 for 3 days) gets you an air-conditioned indoor space and a covered grandstand seat; Champions Club (around $4,899 for 3 days) steps up further with a Grid Walk; Paddock Club sits above both, around $7,000, with pit lane walks and a suite directly over the team garages.\n\nBecause Hungary is comparatively affordable, buyers sometimes assume availability will hold longer than it does. It doesn't. Popular grandstands and the covered Hungaroring Grandstand routinely sell out weeks before race weekend even though GA tickets remain available right up to the gates.",
    practicalInfo: {
      hours: "Race weekend 30 Jul – 1 Aug 2027. Gates typically open around 8am each day.",
      website: "https://ticketing.formula1.com/hungary/",
      costRange:
        "GA 3-day approx. $184; grandstand seats from approx. $259/weekend; Hungaroring Grandstand (covered, premium) up to $799; F1 Fan Lounge approx. $2,106/3 days; Champions Club approx. $4,899/3 days; Paddock Club approx. $7,000/3 days",
      bookingMethod:
        "Buy direct via ticketing.formula1.com/hungary. This is the official channel carrying the full range from GA through grandstands. Hospitality tiers (Fan Lounge, Champions Club, Paddock Club) are sold via f1experiences.com. If you're weighing tiers, the honest strategy is: book GA or a mid-tier grandstand as soon as you've decided you're going, Hungary's low price point means people underestimate how fast the popular stands move. Don't feel pressured into a hospitality tier just because the base price feels cheap, the value gap between a good GA spot and full Paddock Club is larger here than at almost any other round.",
      reservationsRequired: true,
    },
    budgetMinCost: "184.00",
    budgetMaxCost: "7000.00",
    editorialNote:
      "Sources: ticketing.formula1.com/hungary (official 2027 ticket site), f1experiences.com/2027-hungarian-grand-prix (hospitality), planner_ticket_tier_cost rows seeded 16 Oct 2026 (GA $184, grandstands $259-799) and circuit_seating_profile hospitality rows (Fan Lounge $2,106, Champions Club $4,899, Paddock Club $7,000 — official/reseller screenshots supplied by founder 16 Oct 2026). Dates per official 2027 F1 calendar. Verified 16 Oct 2026, replacing stale 2026 figures found in content-rollover audit.",
    lastVerifiedDate: "2026-10-16",
    updatedAt: new Date(),
  })
  .where(eq(experiences.id, "3d4dd55a-bd01-4d8c-8daa-6a5702ed35cf"));
console.log("✓ Ticket Guide updated");

// 2. F1 Fan Lounge — URL + price rolled to 2027
await db
  .update(experiences)
  .set({
    practicalInfo: {
      hours: "3-day access (Fri-Sun), lounge opens ahead of first practice each day",
      website: "https://f1experiences.com/2027-hungarian-grand-prix",
      costRange: "Approx. $2,106 for 3 days (2027 pricing), roughly half of Champions Club",
      howToBook:
        "One detail worth knowing before you book: the open bar runs Saturday and Sunday only, not Friday, check this against your dates if you're planning around a full three-day drinks package. Contact F1 Experiences directly at info@f1experiences.com or +1 888 326 5430 to confirm current Fan Lounge availability before paying, mid-season European rounds like Hungary can sell through this tier a few months out even though it's positioned as the accessible step up from a grandstand seat, it's still a finite hospitality allocation, not an unlimited product.",
      bookingMethod:
        "Sold via f1experiences.com and official F1 hospitality resellers. Includes a reserved covered seat in the Hungaroring Grandstand plus indoor lounge access with buffet and open bar for all three days.",
      reservationsRequired: true,
    },
    editorialNote:
      "Sources: gpdestinations.com/tickets-hungarian-f1-grand-prix, f1experiences.com/2027-hungarian-grand-prix (pricing), gpticketshop.hu VIP Tickets section (€1,950 weekend = $2,106 USD, official reseller screenshot supplied by founder 16 Oct 2026). Verified 16 Oct 2026, replacing stale 2026 URL/pricing found in content-rollover audit.",
    lastVerifiedDate: "2026-10-16",
    updatedAt: new Date(),
  })
  .where(eq(experiences.id, "6199e022-81d0-4354-8a0f-0ab40fed63a2"));
console.log("✓ F1 Fan Lounge updated");

// 3. Camping — date reference only
await db
  .update(experiences)
  .set({
    practicalInfo: {
      hours: "Typically opens 2-3 days before the race weekend and closes the day after; check zengocamping.hu for exact 2027 dates",
      website: "https://zengocamping.hu/en/",
      costRange: "~€100 per person for 4 nights (shared, unpowered pitch); +€15/night for electricity; +€1/person/night visitor's tax",
      bookingMethod:
        "Book directly via zengocamping.hu or through official F1 ticket resellers listing Camping Zengo. Pitches are limited and this is the closest site to the circuit, book as early as the ticket window opens.",
      reservationsRequired: true,
    },
    lastVerifiedDate: "2026-10-16",
    updatedAt: new Date(),
  })
  .where(eq(experiences.id, "f5ff8cd5-9be3-4992-8858-59f2c60d338f"));
console.log("✓ Camping updated");

await client.end();
