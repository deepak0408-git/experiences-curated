import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Fix (22 Jul 2026): Milan and Virginia Water were seeded in local currency
// (EUR, GBP) instead of USD -- the Planner is entirely USD-based, a standing
// rule that was missed twice in a row. Converting existing rows to USD using
// the same day's Frankfurter rates (EUR->USD 1.1418, GBP->USD 1.3401).

const MILAN_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca";
const VW_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";

const milanTiers = [
  { tier: "budget", costLow: "179.26", costHigh: "213.52" },
  { tier: "moderate", costLow: "180.40", costHigh: "298.01" },
  { tier: "splurge", costLow: "308.29", costHigh: "596.02" },
  { tier: "luxury", costLow: "733.04", costHigh: "810.68" },
];

const vwTiers = [
  { tier: "budget", costLow: "85.77", costHigh: "125.97" },
  { tier: "moderate", costLow: "140.71", costHigh: "192.97" },
  { tier: "splurge", costLow: "203.70", costHigh: "345.75" },
  { tier: "luxury", costLow: "1337.42", costHigh: "1337.42" },
];

for (const t of milanTiers) {
  await sql`
    UPDATE planner_hotel_tier_cost
    SET cost_low = ${t.costLow}, cost_high = ${t.costHigh}, last_updated = NOW()
    WHERE destination_id = ${MILAN_ID} AND tier = ${t.tier}
  `;
}
for (const t of vwTiers) {
  await sql`
    UPDATE planner_hotel_tier_cost
    SET cost_low = ${t.costLow}, cost_high = ${t.costHigh}, last_updated = NOW()
    WHERE destination_id = ${VW_ID} AND tier = ${t.tier}
  `;
}

const rows = await sql`
  SELECT destination_id, tier, cost_low, cost_high
  FROM planner_hotel_tier_cost
  WHERE destination_id IN (${MILAN_ID}, ${VW_ID})
  ORDER BY destination_id, tier
`;
console.log("Confirmed state (now USD):");
console.table(rows);
await sql.end();
