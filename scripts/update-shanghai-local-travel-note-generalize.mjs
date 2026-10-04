import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerDestinationBands } from "../schema/database.ts";

// planner_destination_bands is destination-level, not event-level (no
// seasonalBand/editionYear column — one row serves every event at that
// destination). Shanghai's localTravelNote was originally written for the
// Shanghai Masters tennis event specifically (named Qizhong stadium, its
// Line 1/Line 5 shuttle routing) and would show the wrong transit directions
// on the Chinese Grand Prix 2027 planner card too, since the note has no
// per-event override. Generalized 23 Sep 2026, curator-approved, so the note
// reads correctly for any current or future Shanghai event rather than only
// the tennis Masters.

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963"; // Shanghai

const NEW_LOCAL_TRAVEL_NOTE =
  "This range covers Shanghai's Metro, bus, and ferry network — a 20+ line Metro system that reaches every major venue across the city, though the exact line and closest station vary by event, so check your specific venue's transit page before you travel. No car needed. Skip single paper tickets and get the rechargeable Shanghai Public Transportation Card (¥20 deposit, refundable) — it works across metro, bus, and ferry and stays valid for years.";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const result = await db
  .update(plannerDestinationBands)
  .set({ localTravelNote: NEW_LOCAL_TRAVEL_NOTE })
  .where(eq(plannerDestinationBands.destinationId, DESTINATION_ID))
  .returning();

console.log(`Updated ${result.length} row(s) for Shanghai's localTravelNote.`);
await client.end();
