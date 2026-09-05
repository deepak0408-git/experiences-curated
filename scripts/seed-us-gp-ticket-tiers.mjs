import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents, plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_SLUG = "united-states-grand-prix";

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!event) {
  console.error("Event not found:", EVENT_SLUG);
  await client.end();
  process.exit(1);
}

// Real F1 Tickets 3-day (Fri-Sun) grandstand prices, sourced 5 Sep 2026 from
// tickets.formula1.com/en/f1-3320-united-states, converted EUR->USD at
// 1 EUR = 1.1622 USD (frankfurter.app, 4 Sep 2026). Sunday race-day-only
// prices are a separate, cheaper product — noted in the Tickets spoke copy
// as a side fact, not folded into this planner baseline.
// Tier 4 (hospitality) sourced directly in USD from f1experiences.com
// 2026 United States Grand Prix package pricing, 5 Sep 2026 — range trimmed
// to Tower/Turn 12 Mid ($1,569) through F1 Experiences Lounge 3-Days
// ($6,169), which also covers the F1 Experiences Live tier (Turn 4 Upper
// $1,949, Turn 12 Mid $2,056, Turn 15 Mid $2,521) seen on the same page.
// The Gordon Ramsay Paddock chef's-table package ($24,356) is a bespoke
// outlier mentioned in the Luxury spoke instead of folded into this range.
const rows = [
  {
    tier: "tier1",
    eventTierLabel: "General Admission (3-day)",
    costLow: "555",
    costHigh: "555",
  },
  {
    tier: "tier2",
    eventTierLabel: "Turn 4, Turn 9, Turn 12, Turn 15 or Turn 19 Grandstand (3-day)",
    costLow: "730",
    costHigh: "1175",
  },
  {
    tier: "tier3",
    eventTierLabel: "Turn 1 or Main Grandstand (3-day)",
    costLow: "1420",
    costHigh: "1545",
  },
  {
    tier: "tier4",
    eventTierLabel: "Hospitality (F1 Experiences Live to Lounge 3-Days)",
    costLow: "1569",
    costHigh: "6169",
  },
];

for (const row of rows) {
  await db
    .insert(plannerTicketTierCost)
    .values({
      sportingEventId: event.id,
      tier: row.tier,
      eventTierLabel: row.eventTierLabel,
      costLow: row.costLow,
      costHigh: row.costHigh,
      currency: "USD",
    })
    .onConflictDoUpdate({
      target: [plannerTicketTierCost.sportingEventId, plannerTicketTierCost.tier],
      set: {
        eventTierLabel: row.eventTierLabel,
        costLow: row.costLow,
        costHigh: row.costHigh,
        currency: "USD",
        lastUpdated: new Date(),
      },
    });
  console.log(`✓ ${row.tier}: ${row.eventTierLabel} — $${row.costLow}-$${row.costHigh}`);
}

console.log("\n✓ US GP ticket tiers seeded");
await client.end();
