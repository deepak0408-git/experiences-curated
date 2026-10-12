import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder event — see seed-austrian-gp-2027-event.mjs
// for the full rationale. Backs the "saudi-arabia" rating profile.
//
// Dates sourced from preseason 2027 F1 calendar reporting, not formula1.com
// directly — not yet independently confirmed on the official site as of
// 10 Oct 2026. Flag for re-verification before this event is ever activated.
await db.insert(sportingEvents).values({
  name: "Saudi Arabian Grand Prix 2027",
  slug: "saudi-arabian-grand-prix",
  sport: "formula_one",
  tournamentSeries: "Formula 1",
  editionYear: 2027,
  seasonYear: 2027,
  destinationId: "6d2eef97-536a-4b7d-8c6e-5f3ef4147297", // Jeddah
  venueName: "Jeddah Corniche Circuit",
  startDate: "2027-03-19",
  endDate: "2027-03-21",
  isHidden: true,
  packStatus: "planned",
  packFormat: "hub_and_spoke",
  packCurrency: "USD",
});

console.log("Saudi Arabian Grand Prix 2027 placeholder event seeded.");
await client.end();
