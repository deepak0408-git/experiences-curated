import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder destination — created to back a sporting_events
// row for the Azerbaijan GP 2027 so Trip Intelligence's 24-race ratings
// dataset has a valid FK target. No pack content follows. Airport: GYD
// (Heydar Aliyev Intl, Baku's only major hub) per destination-creator
// research, 10 Oct 2026.
await db.insert(destinations).values({
  name: "Baku",
  slug: "baku",
  countryCode: "AZ",
  region: "Baku",
  destinationType: "city",
  lat: "40.4093",
  lng: "49.8671",
  editorialOverview:
    "Baku is Azerbaijan's Caspian Sea capital, its circuit a street track that runs straight through the medieval walls of the Old City. Flame Towers and Soviet-era boulevards sit a few corners away from 12th-century caravanserais. It's one of F1's fastest circuits by top speed, despite threading some of its tightest street-circuit corners.",
  currency: "AZN",
  language: "Azerbaijani",
  timezone: "Asia/Baku",
  nearestAirportIata: "GYD",
});

console.log("Baku destination seeded.");
await client.end();
