import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder event — see seed-austrian-gp-2027-event.mjs
// for the full rationale. Backs the "spain-madrid" rating profile. Madrid
// (Madring circuit) took over the Spanish GP from Barcelona starting 2026,
// confirmed via formula1.com's own announcement coverage.
//
// Dates sourced from preseason 2027 F1 calendar reporting, not formula1.com
// directly — not yet independently confirmed on the official site as of
// 10 Oct 2026. Flag for re-verification before this event is ever activated.
await db.insert(sportingEvents).values({
  name: "Spanish Grand Prix 2027",
  slug: "spanish-grand-prix",
  sport: "formula_one",
  tournamentSeries: "Formula 1",
  editionYear: 2027,
  seasonYear: 2027,
  destinationId: "aaa0f0cd-b535-4f19-8154-a103e1a4c721", // Madrid
  venueName: "Madring",
  startDate: "2027-09-10",
  endDate: "2027-09-12",
  isHidden: true,
  packStatus: "planned",
  packFormat: "hub_and_spoke",
  packCurrency: "USD",
});

console.log("Spanish Grand Prix 2027 placeholder event seeded.");
await client.end();
