import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder destination — created to back a sporting_events
// row for the Turkish GP 2027 (Istanbul Park, returning after a six-year
// absence) so Trip Intelligence's 24-race ratings dataset has a valid FK
// target. No pack content follows. Airport: IST (Istanbul Airport, Turkish
// Airlines' main hub — not SAW, which is secondary/Asian-side and farther
// from the circuit) per destination-creator research, 10 Oct 2026.
await db.insert(destinations).values({
  name: "Istanbul",
  slug: "istanbul",
  countryCode: "TR",
  region: "Istanbul Province",
  destinationType: "city",
  lat: "41.0082",
  lng: "28.9784",
  editorialOverview:
    "Istanbul straddles Europe and Asia across the Bosphorus, home to Istanbul Park's banked Turn 8, a corner drivers have named a favourite since the track opened in 2005. The Grand Bazaar, Hagia Sophia, and a Bosphorus ferry crossing are all within a half-day of the circuit. The race returns in 2027 after a six-year absence.",
  currency: "TRY",
  language: "Turkish",
  timezone: "Europe/Istanbul",
  nearestAirportIata: "IST",
});

console.log("Istanbul destination seeded.");
await client.end();
