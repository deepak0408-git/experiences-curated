// Reverted 23 Sep 2026: Grandstand E IS a real grandstand at Shanghai
// International Circuit for 2027 (confirmed by founder) — the earlier
// "fabricated Grandstand E" incident (see project_chinese_gp_2027_build_status
// memory) was about a specific unverifiable geographic CLAIM sourced only
// from formula1shanghai.com (position/Turn 11-13 detail), not about whether
// Grandstand E exists at all. It exists; this pack's experience-list just
// doesn't cover it as a standalone written experience (A/B/H/K are the 4
// grandstands with dedicated experiences). The tier2 cost-tier label is
// describing the real 2026 on-sale grouping, independent of which stands
// this pack chose to write up — restoring "E, H, K" to match the real
// ticket-tier grouping rather than silently dropping a real grandstand from
// the pricing data to match the narrower experience list.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

const result = await db
  .update(plannerTicketTierCost)
  .set({ eventTierLabel: "Grandstand E, H, K — 3-Day (2026 pricing)" })
  .where(and(eq(plannerTicketTierCost.sportingEventId, EVENT_ID), eq(plannerTicketTierCost.tier, "tier2")))
  .returning({ tier: plannerTicketTierCost.tier, eventTierLabel: plannerTicketTierCost.eventTierLabel });

console.log("✓", result[0]?.tier, "→", result[0]?.eventTierLabel);
await client.end();
