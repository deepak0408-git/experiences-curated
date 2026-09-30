import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [dest] = await db
  .insert(destinations)
  .values({
    name: "Monaco",
    slug: "monaco",
    countryCode: "MC",
    region: null,
    destinationType: "city",
    lat: "43.73472",
    lng: "7.42056",
    editorialOverview:
      "Monaco hosts Formula 1's most storied race on the Circuit de Monaco, a tight 3.337km street circuit threading through Monte Carlo, La Condamine and Casino Square — unchanged in spirit since 1929. There's no run-off, no margin for error, and the whole principality turns into one enormous grandstand for race week, with superyachts stacked in the harbour and balconies overlooking the track rented out for small fortunes. Getting around on foot is normal and often faster than any vehicle once the street closures start.",
    currency: "EUR",
    language: "French",
    timezone: "Europe/Monaco",
    nearestAirportIata: "NCE",
  })
  .returning({ id: destinations.id });

console.log("Monaco destination seeded:", dest.id);
await client.end();
