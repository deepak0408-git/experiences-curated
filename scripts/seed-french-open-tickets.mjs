import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SPORTING_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f"; // French Open 2027

// French Open 2027 ticket tier data — founder-supplied 2026 representative
// pricing (2027 not yet published), single-day, converted EUR->USD at the
// live rate (1 EUR = 1.1669 USD, frankfurter.app, 26 Aug 2026). tier4
// source: Sodexo Live Hospitality's official Roland-Garros booking page
// (booking.sodexolive-hospitality.com/booking.roland-garros), screenshot
// confirmed by founder 26 Aug 2026. Approved by founder 26 Aug 2026.
const rows = [
  {
    tier: "tier1",
    eventTierLabel: "Ground Pass / Outside Courts (single day)",
    costLow: "53.00",
    costHigh: "53.00",
  },
  {
    tier: "tier2",
    eventTierLabel: "Court Simonne-Mathieu (single day)",
    costLow: "111.00",
    costHigh: "111.00",
  },
  {
    tier: "tier3",
    eventTierLabel: "Court Philippe-Chatrier / Court Suzanne-Lenglen (single day)",
    costLow: "128.00",
    costHigh: "198.00",
  },
  {
    tier: "tier4",
    eventTierLabel:
      "Hospitality (single day): Le Pavillon, La Mezzanine, L'Orangerie Seating Category 1, L'Orangerie Seating Category GOLD",
    costLow: "917.00",
    costHigh: "1428.00",
  },
];

const inserted = await db
  .insert(plannerTicketTierCost)
  .values(rows.map((r) => ({
    sportingEventId: SPORTING_EVENT_ID,
    tier: r.tier,
    eventTierLabel: r.eventTierLabel,
    costLow: r.costLow,
    costHigh: r.costHigh,
    currency: "USD",
  })))
  .returning();

console.log("Inserted:", JSON.stringify(inserted, null, 2));
await client.end();
