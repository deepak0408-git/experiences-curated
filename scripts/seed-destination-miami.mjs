import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "Miami",
  slug: "miami",
  countryCode: "US",
  region: "Florida",
  destinationType: "city",
  lat: "25.7617",
  lng: "-80.1918",
  editorialOverview:
    "Miami is Florida's international gateway city and host of the Miami Grand Prix, held on a temporary street circuit built around Hard Rock Stadium in Miami Gardens. It draws visitors for its beaches, Art Deco architecture in South Beach, and a Cuban-influenced food and nightlife scene that runs later than almost anywhere else in the US. The circuit itself sits inland, away from the postcard beach image, so most race weekend crowds split time between the stadium grounds and the city's coastal neighborhoods.",
  currency: "USD",
  language: "English",
  timezone: "America/New_York",
  nearestAirportIata: "MIA",
});

console.log("Miami destination seeded.");
await client.end();
