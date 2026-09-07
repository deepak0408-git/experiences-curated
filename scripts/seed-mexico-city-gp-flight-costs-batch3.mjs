import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c"; // Mexico City
const SEASONAL_BAND = "oct";

// Batch 3 — Rome, Stockholm, Zurich were missed from the original 49-market
// batch (research gap caught and flagged 6 Sep 2026). Researched via the
// same locked Flights methodology (Google Flights + Kayak, combined-dataset
// density-boundary outlier exclusion), founder-approved as-is (tool's own
// computed final range, no manual overrides for these 3).
const rows = [
  { city: "Rome", low: 1271, high: 1833 },
  { city: "Stockholm", low: 1343, high: 1919 },
  { city: "Zurich", low: 914, high: 1560 },
];

const cityToId = {
  Rome: "88b720b6-074b-4bf1-8783-7d2481fd0e47",
  Stockholm: "8a089065-45a0-4ad6-99b7-41e3a3ef459e",
  Zurich: "1fc803e9-743a-4f77-9bee-1db20c592543",
};

for (const r of rows) {
  await db.insert(plannerFlightCost).values({
    destinationId: DESTINATION_ID,
    originMarket: r.city,
    seasonalBand: SEASONAL_BAND,
    costLow: r.low.toFixed(2),
    costHigh: r.high.toFixed(2),
    currency: "USD",
  }).onConflictDoNothing();
  console.log(`Seeded: ${r.city} — $${r.low}-${r.high}`);
}

console.log("\n✓ Batch 3 complete — Mexico City flight cost coverage now 49/49 origin markets.");

await client.end();
