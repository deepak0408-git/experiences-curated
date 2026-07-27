import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Italian GP 2026, researched 20 Jul 2026 per
// the planner-data-researcher skill's Tickets methodology (F1 section).
// UNIQUE situation: every named regular grandstand (Ascari, Ascari 1,
// Seconda Variante x2, Roggia, Junior Interna, Alta Velocita B) is SOLD
// OUT across all 5 official day-length views (Fri/Sat/Sun/Sat-Sun/Fri-Sun)
// on tickets.formula1.com/en/f1-3293-italy. No real tier1/tier2-equivalent
// grandstand product exists — confirmed via user screenshots, not assumed.
// Only Hospitality products are genuinely purchasable, so tier1 is
// intentionally NOT seeded (honest omission, not a data gap).
//
// ticketingUrl for this event was corrected 20 Jul 2026 from
// monzanet.it/en/tickets/ (real but bot-protected, Anubis challenge blocks
// automated fetch) to the confirmed-working tickets.formula1.com/en/f1-3293-italy
// (found via search, cross-verified across multiple sub-page hits, NOT
// guessed from the f1-XXXX-country pattern which failed once already).
//
// Sources: tickets.formula1.com/en/f1-3293-italy (EUR, converted to USD
// at 1.14) for the Monza-site hospitality tiers; f1experiences.com's
// comparison page (f1experiences.com/comparisons?ids=...) for the true
// USD ranges of F1 Experiences Live and F1 Experiences Lounge products —
// an initial single-price-point extraction was corrected by the user via
// screenshot showing real configurable ranges. Ferrari GP Club 3-Days
// confirmed as a single fixed USD price via priceCurrency field.
// Tier boundaries approved by user 20 Jul 2026.

const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix 2026

const TIERS = [
  {
    tier: "tier2",
    eventTierLabel:
      "VIP Iconic Race Club (Friday), VIP Fan's Garden Lounge (Friday & Saturday), F1® Experiences Live, F1® Experiences Lounge, HOSPITALITY FANS CLUB (Saturday)",
    costLow: "1024.00",
    costHigh: "2255.00",
  },
  {
    tier: "tier3",
    eventTierLabel:
      "VIP Fan's Garden Lounge (Sunday & Friday-Sunday), HOSPITALITY FANS CLUB (Saturday-Sunday), HOSPITALITY Ultimate Hospitality (Sunday, Saturday-Sunday & Friday-Sunday), F1® Experiences Lounge",
    costLow: "4313.00",
    costHigh: "6199.00",
  },
  {
    tier: "tier4",
    eventTierLabel: "HOSPITALITY Schumacher Lounge (Friday-Sunday), Ferrari GP Club 3-Days",
    costLow: "7729.00",
    costHigh: "11252.00",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, cost_low, cost_high)
    VALUES (${EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${t.costLow}, ${t.costHigh})
    ON CONFLICT (sporting_event_id, tier) DO UPDATE SET
      event_tier_label = EXCLUDED.event_tier_label,
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      last_updated = NOW()
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, event_tier_label, cost_low, cost_high
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
