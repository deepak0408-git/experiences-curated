import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Copies Melbourne's existing "dec" seasonal band hotel tier data to a new
// "jan" band for the Australian Open 2027 (added to scope 22 Jul 2026).
// Per user instruction: reuse the Dec research data as-is for Jan rather
// than re-researching from scratch -- same destination, and no indication
// the Jan window would price meaningfully differently without doing fresh
// research (which the user explicitly said to skip this time).

const MELBOURNE_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50";

const decRows = await sql`
  SELECT tier, cost_low, cost_high
  FROM planner_hotel_tier_cost
  WHERE destination_id = ${MELBOURNE_ID} AND seasonal_band = 'dec'
`;
console.log("Source (dec) rows:", decRows.length);

for (const row of decRows) {
  await sql`
    INSERT INTO planner_hotel_tier_cost (destination_id, tier, seasonal_band, cost_low, cost_high, refresh_pass)
    VALUES (${MELBOURNE_ID}, ${row.tier}, 'jan', ${row.cost_low}, ${row.cost_high}, 'initial')
    ON CONFLICT (destination_id, tier, seasonal_band) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
  `;
}

const rows = await sql`
  SELECT tier, seasonal_band, cost_low, cost_high, refresh_pass
  FROM planner_hotel_tier_cost
  WHERE destination_id = ${MELBOURNE_ID}
  ORDER BY seasonal_band, tier
`;
console.log("\nConfirmed state (both seasons):");
console.table(rows);

await sql.end();
