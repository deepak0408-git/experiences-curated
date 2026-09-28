import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "Montreal, Canada",
  slug: "montreal-canada",
  countryCode: "CA",
  region: "Quebec",
  destinationType: "city",
  lat: "45.5019",
  lng: "-73.5674",
  editorialOverview:
    "Montreal hosts Formula 1's Canadian Grand Prix at Circuit Gilles Villeneuve, a street-and-park circuit built on Île Notre-Dame in the St. Lawrence River, right next to downtown. The city's bilingual mix of French and English culture, historic Old Montreal, and one of North America's best food scenes give race weekend a different character than most F1 stops. Crowds spill onto Rue Crescent and Rue Saint-Denis after sessions, and the circuit is reachable by metro straight from downtown — no shuttle bus required.",
  currency: "CAD",
  language: "French/English",
  timezone: "America/Toronto",
  nearestAirportIata: "YUL",
});

console.log("Montreal, Canada destination seeded.");
await client.end();
