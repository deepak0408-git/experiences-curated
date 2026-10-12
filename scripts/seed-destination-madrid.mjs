import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder destination — created to back a sporting_events
// row for the Spanish GP 2027 (Madrid/Madring) so Trip Intelligence's 24-race
// ratings dataset has a valid FK target. No pack content follows. Airport: MAD
// (Adolfo Suárez Barajas, 5 min from the circuit) per destination-creator
// research, 10 Oct 2026.
await db.insert(destinations).values({
  name: "Madrid",
  slug: "madrid",
  countryCode: "ES",
  region: "Community of Madrid",
  destinationType: "city",
  lat: "40.4168",
  lng: "-3.7038",
  editorialOverview:
    "Madrid is Spain's capital and the newest stop on the F1 calendar, its street circuit built around the IFEMA exhibition halls next to Barajas airport. The Prado and Reina Sofía sit a few stops from a tapas and vermouth culture that runs well past midnight. It replaced Barcelona as Spain's Grand Prix in 2026, inheriting a fanbase with little patience for anything less.",
  currency: "EUR",
  language: "Spanish",
  timezone: "Europe/Madrid",
  nearestAirportIata: "MAD",
});

console.log("Madrid destination seeded.");
await client.end();
