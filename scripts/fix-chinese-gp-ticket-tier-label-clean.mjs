// Strip the "(2026 pricing)" suffix out of eventTierLabel — the DB label
// should describe what the tier IS (the real grandstand/zone grouping and
// duration), not carry provenance/caveat text inline. The "this is 2026
// pricing, proxy pending 2027 on-sale" caveat belongs in the Cost/Tickets
// spoke's own write-up copy (rendered once, clearly, near the numbers),
// not duplicated into the raw label string every time it's displayed.
// Founder instruction, 23 Sep 2026. (Note: an earlier pass in this same
// session briefly and incorrectly changed tier2's label from "Grandstand
// E, H, K" to "Grandstand H, K" — dropping Grandstand E on the mistaken
// belief it wasn't real. Founder corrected this: E is real, just not
// covered by a dedicated written experience in this pack. Restored before
// this script ran — this script only strips the "(2026 pricing)" suffix,
// it does not touch the grandstand letters.)
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { plannerTicketTierCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

const LABELS = {
  tier1: "General Admission (Zones C, F, J, L) — 3-Day",
  tier2: "Grandstand E, H, K — 3-Day",
  tier3: "Grandstand A, B — 3-Day",
  tier4: "F1 Paddock Club — 3-Day",
};

for (const [tier, eventTierLabel] of Object.entries(LABELS)) {
  const [row] = await db
    .update(plannerTicketTierCost)
    .set({ eventTierLabel })
    .where(and(eq(plannerTicketTierCost.sportingEventId, EVENT_ID), eq(plannerTicketTierCost.tier, tier)))
    .returning({ tier: plannerTicketTierCost.tier, eventTierLabel: plannerTicketTierCost.eventTierLabel });
  console.log("✓", row?.tier, "→", row?.eventTierLabel);
}

await client.end();
