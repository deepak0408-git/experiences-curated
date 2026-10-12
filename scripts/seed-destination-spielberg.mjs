import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder destination — created to back a sporting_events
// row for the Austrian GP 2027 so Trip Intelligence's 24-race ratings dataset
// has a valid FK target. No pack content follows. Airport: GRZ (Graz) approved
// over Salzburg per destination-creator research, 10 Oct 2026.
await db.insert(destinations).values({
  name: "Spielberg",
  slug: "spielberg",
  countryCode: "AT",
  region: "Styria",
  destinationType: "city",
  lat: "47.2233",
  lng: "14.7646",
  editorialOverview:
    "Spielberg is a small Styrian market town built around the Red Bull Ring, one of the shortest and most elevation-heavy circuits on the F1 calendar. The track sits in Alpine foothill country, with Graz's old town and the Styrian wine roads both under an hour away. Red Bull's own headquarters and its Hangar-7 aviation museum are a short drive north in Salzburg.",
  currency: "EUR",
  language: "German",
  timezone: "Europe/Vienna",
  nearestAirportIata: "GRZ",
});

console.log("Spielberg destination seeded.");
await client.end();
