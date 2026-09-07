import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "Mexico City",
  slug: "mexico-city",
  countryCode: "MX",
  region: "Mexico City (CDMX)",
  destinationType: "city",
  lat: "19.4326",
  lng: "-99.1332",
  editorialOverview:
    "Mexico City hosts Formula 1's Mexican Grand Prix at the Autódromo Hermanos Rodríguez, a circuit built into a former Olympic park where the final sector runs straight through the old Foro Sol baseball stadium in front of tens of thousands of fans packed into the stands. The altitude here — over 2,200m above sea level — thins the air enough to change how the cars themselves are set up, and the grandstand noise on Sunday afternoon is regularly cited by drivers as the loudest of the season. Away from the track, the city runs a serious food scene alongside its Aztec and colonial history, from taco stands to two-Michelin-starred tasting menus, all within a few metro stops of the circuit.",
  currency: "MXN",
  language: "Spanish",
  timezone: "America/Mexico_City",
  nearestAirportIata: "MEX",
});

console.log("Mexico City destination seeded.");
await client.end();
