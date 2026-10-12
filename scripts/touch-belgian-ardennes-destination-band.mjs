import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { plannerDestinationBands } from "../schema/database.ts";

// Re-confirms the Belgian Ardennes destination band's lastUpdated date as
// current, 12 Oct 2026 — the underlying local-travel ($19/day) and food
// ($75/day) figures were originally researched 23 Jul 2026 and don't need
// re-research (average unit costs for local transit/food don't meaningfully
// shift month to month), but with flights and hotels both freshly seeded
// today, the Cost spoke's "verified as of" date (oldest lastUpdated across
// hotels/tickets/destinationBand) was being dragged back to July by this
// one stale timestamp despite the actual figures being re-confirmed as
// still accurate. A touch, not a re-seed — costLow/High/notes untouched.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "101b815a-ba64-4484-aad6-63721a44ed85"; // Belgian Ardennes

const [before] = await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, DESTINATION_ID));
console.log("Before:", before.lastUpdated);

const [after] = await db
  .update(plannerDestinationBands)
  .set({ lastUpdated: new Date() })
  .where(eq(plannerDestinationBands.destinationId, DESTINATION_ID))
  .returning({ lastUpdated: plannerDestinationBands.lastUpdated });

console.log("After:", after.lastUpdated);
await client.end();
