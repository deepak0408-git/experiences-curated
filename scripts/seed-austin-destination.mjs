import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "Austin",
  slug: "austin",
  countryCode: "US",
  region: "Texas",
  destinationType: "city",
  nearestAirportIata: "AUS",
  lat: "30.267153",
  lng: "-97.743057",
  currency: "USD",
  language: "English",
  timezone: "America/Chicago",
});

console.log("Austin destination seeded.");
await client.end();
