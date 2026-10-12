import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder event — created via event-builder skill per
// CLAUDE.md's hard gate (never an ad hoc script... except this IS the
// event-builder flow's own required pattern: a persisted, real seed script,
// not an inline one-off write). Backs Trip Intelligence's "austria" rating
// profile with a valid sporting_events FK. No pack being built — isHidden
// stays true, packStatus stays "planned", no experiences/pricing/hero image.
//
// Dates sourced from preseason 2027 F1 calendar reporting (planetf1.com,
// motorsportmagazine.com cross-referenced), not formula1.com directly — not
// yet independently confirmed on the official site as of 10 Oct 2026. Flag
// for re-verification before this event is ever activated for real content.
await db.insert(sportingEvents).values({
  name: "Austrian Grand Prix 2027",
  slug: "austrian-grand-prix",
  sport: "formula_one",
  tournamentSeries: "Formula 1",
  editionYear: 2027,
  seasonYear: 2027, // evergreen slug (no year suffix) — per CLAUDE.md rule
  destinationId: "368e9c89-80bb-4442-b3c0-e85fd1e26914", // Spielberg
  venueName: "Red Bull Ring",
  startDate: "2027-07-09",
  endDate: "2027-07-11",
  isHidden: true,
  packStatus: "planned",
  packFormat: "hub_and_spoke",
  packCurrency: "USD",
});

console.log("Austrian Grand Prix 2027 placeholder event seeded.");
await client.end();
