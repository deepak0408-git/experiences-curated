import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "São Paulo",
  slug: "sao-paulo",
  countryCode: "BR",
  region: "São Paulo",
  destinationType: "city",
  lat: "-23.5505",
  lng: "-46.6333",
  editorialOverview:
    "São Paulo is Brazil's financial and cultural capital, and it's also where Formula 1 has raced almost every year since 1973 — the Interlagos circuit sits inside the city, not off in some purpose-built exurb. The draw for a visiting fan is the track itself: a fast, undulating, anticlockwise layout that drivers rate among the best on the calendar, wrapped by a genuinely massive, genuinely loud home crowd. What surprises most first-timers is the food — this is one of the world's great restaurant cities, with Brazil's largest Japanese population outside Japan shaping a food scene most people don't associate with a Grand Prix weekend.",
  currency: "BRL",
  language: "Portuguese",
  timezone: "America/Sao_Paulo",
});

console.log("São Paulo destination seeded.");
await client.end();
