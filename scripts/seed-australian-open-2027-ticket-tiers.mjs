import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real ticket tier data for Australian Open 2027 (Melbourne Park), researched
// 22 Jul 2026 per the planner-data-researcher skill's Tickets methodology.
//
// SOURCE: official ausopen.com/tickets (Tickets + Hospitality page) and
// ausopen.com news article "Australian Open 2027 tickets: On sale earlier
// than ever" (21 Jul 2026) -- fetched with a real browser User-Agent, 200
// status, no bot-block.
//
// IMPORTANT CONTEXT: AO 2027 standard tickets (Ground Pass, Grandstand,
// Show Court reserved seating) are NOT yet on public sale as of this
// research date -- public on-sale is 13 Aug 2026 via Ticketmaster
// (Mastercard presale 5 Aug, AO Extras presale 6-12 Aug). Only Ground Pass
// has a real, officially published price this far out (the early-bird
// rate, confirmed directly in Tennis Australia's own announcement).
// Grandstand and Show Court figures were provided directly by the user
// (not independently web-verified against a live product page, since none
// exists publicly yet) -- seeded as user-supplied real-world estimates,
// not fabricated. Hospitality (tier4) IS live and independently verified
// against the real page.
//
// CURRENCY: all AO prices are quoted in AUD on the official site/article.
// Converted to USD per standing rule (Frankfurter API, AUD->USD 0.70152,
// rate date 21 Jul 2026).
//
// TIER MAPPING:
// - tier1 Ground Pass: single confirmed early-bird price ($49 AUD),
//   locked until 30 Nov 2026 per the article ("The price hasn't increased
//   since 2019").
// - tier2 Grandstand (John Cain Arena & Kia Arena): user-supplied range,
//   80-120 AUD.
// - tier3 Show Court Reserved Seating: user-supplied range, 169-300 AUD.
// - tier4 Hospitality: real, distinct products captured live from
//   ausopen.com/tickets, Sun 17 Jan (tournament opening day) Day Session,
//   Rod Laver Arena -- the peak/first-choice day per methodology (no
//   sold-out fallback needed, this far from the event). Real products:
//   The Gallery / Riverside Social ($599), The Bistro ($699), Quarter
//   ($799), Suite ($944), On-Court Seats ($2999). Range = min/max of
//   these actual observed products, not an invented spread.

const SPORTING_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6"; // Australian Open 2027

const TIERS = [
  {
    tier: "tier1",
    eventTierLabel: "Ground Pass (early-bird, until 30 Nov 2026)",
    costLow: "34.37",
    costHigh: "34.37",
    note: "AUD 49 early-bird Ground Pass, confirmed via ausopen.com news article 21 Jul 2026. Converted at AUD->USD 0.70152.",
  },
  {
    tier: "tier2",
    eventTierLabel: "Grandstand (John Cain Arena & Kia Arena)",
    costLow: "56.12",
    costHigh: "84.18",
    note: "User-supplied range, AUD 80-120 (standard on-sale not yet live; not independently price-verified against a public product page). Converted at AUD->USD 0.70152.",
  },
  {
    tier: "tier3",
    eventTierLabel: "Show Court Reserved Seating",
    costLow: "118.56",
    costHigh: "210.46",
    note: "User-supplied range, AUD 169-300 (standard on-sale not yet live; not independently price-verified against a public product page). Converted at AUD->USD 0.70152.",
  },
  {
    tier: "tier4",
    eventTierLabel: "Hospitality (Sun 17 Jan, Day Session, Rod Laver Arena)",
    costLow: "420.21",
    costHigh: "2103.86",
    note: "Real distinct hospitality products captured from ausopen.com/tickets, tournament opening day (peak day), Day Session, Rod Laver Arena: The Gallery/Riverside Social (AUD 599), The Bistro (AUD 699), Quarter (AUD 799), Suite (AUD 944), On-Court Seats (AUD 2999). Converted at AUD->USD 0.70152.",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, event_tier_label, cost_low, cost_high)
    VALUES (${SPORTING_EVENT_ID}, ${t.tier}, ${t.eventTierLabel}, ${t.costLow}, ${t.costHigh})
    ON CONFLICT (sporting_event_id, tier) DO UPDATE SET
      event_tier_label = EXCLUDED.event_tier_label,
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, event_tier_label, cost_low, cost_high
  FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${SPORTING_EVENT_ID}
  ORDER BY tier
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
