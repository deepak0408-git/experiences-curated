import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder event — see seed-austrian-gp-2027-event.mjs
// for the full rationale. Backs the "turkiye" rating profile. Confirmed via
// formula1.com/aol.com coverage: Turkish GP returns to Istanbul Park for
// 2027-2031 after a six-year absence (last raced 2021).
//
// Dates sourced from preseason 2027 F1 calendar reporting, not formula1.com
// directly — not yet independently confirmed on the official site as of
// 10 Oct 2026. Flag for re-verification before this event is ever activated.
await db.insert(sportingEvents).values({
  name: "Turkish Grand Prix 2027",
  slug: "turkish-grand-prix",
  sport: "formula_one",
  tournamentSeries: "Formula 1",
  editionYear: 2027,
  seasonYear: 2027,
  destinationId: "72e0d54d-60d0-47a1-b435-8ba97107a97a", // Istanbul
  venueName: "Istanbul Park",
  startDate: "2027-10-01",
  endDate: "2027-10-03",
  isHidden: true,
  packStatus: "planned",
  packFormat: "hub_and_spoke",
  packCurrency: "USD",
});

console.log("Turkish Grand Prix 2027 placeholder event seeded.");
await client.end();
