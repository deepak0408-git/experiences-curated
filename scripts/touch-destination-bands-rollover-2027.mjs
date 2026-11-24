import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { inArray } from "drizzle-orm";
import { plannerDestinationBands } from "../schema/database.ts";

// Founder decision (24 Nov 2026, during US GP rollover): costDataVerifiedAt
// on the Cost spoke (getSpokeData.ts ~line 208) takes the OLDEST
// lastUpdated across hotels/tickets/destinationBand for an event — by
// design, meant to be honest about the stalest real input. But
// plannerDestinationBands is destination-keyed, not edition-keyed (food/
// local-travel costs don't vary by edition), so the rollover's copy-forward
// of tickets/hotels/flights never touches it — leaving the displayed
// "verified" date stuck on whatever date the destination row was last
// seeded, even right after a fresh rollover. Bumping lastUpdated here
// reflects founder sign-off that the underlying food/local-travel figures
// are still accepted as current for these destinations, not a re-research
// pass — same "copy-forward as placeholder" spirit as the ticket/hotel/
// flight rows themselves.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_IDS = [
  "bc5bb5bd-8b52-4225-94ea-66451f57af10", // Singapore
  "6c920919-1d28-420a-a711-2a58fc8ba9e1", // Austin / US GP
  "883ac422-5318-460f-819a-6ae784ac4b8c", // Mexico City
];

const rows = await db
  .update(plannerDestinationBands)
  .set({ lastUpdated: new Date() })
  .where(inArray(plannerDestinationBands.destinationId, DESTINATION_IDS))
  .returning({ destinationId: plannerDestinationBands.destinationId, lastUpdated: plannerDestinationBands.lastUpdated });

rows.forEach(r => console.log("✓", r.destinationId, "->", r.lastUpdated));
await client.end();
