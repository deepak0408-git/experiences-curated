import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "Portimão, Portugal",
  slug: "portimao-portugal",
  countryCode: "PT",
  region: "Algarve",
  destinationType: "city",
  nearestAirportIata: "FAO",
  lat: "37.1500",
  lng: "-8.5380",
  editorialOverview: "Portimão is a resort town on Portugal's Algarve coast, home to the Autódromo Internacional do Algarve — the undulating, blind-crested circuit that hosted back-to-back F1 races during the pandemic-disrupted 2020-21 seasons and returns to the calendar in 2027. The draw beyond the track is the coastline itself: cliff-backed beaches, sea caves reachable only by boat, and a compact old town built around the fishing harbor. Most fans expect a quiet stopover between races; instead they find one of Europe's more developed beach-resort infrastructures, with direct flights from a dozen-plus UK and European cities into nearby Faro.",
  currency: "EUR",
  language: "Portuguese",
  timezone: "Europe/Lisbon",
});

console.log("Portimão, Portugal destination seeded.");
await client.end();
