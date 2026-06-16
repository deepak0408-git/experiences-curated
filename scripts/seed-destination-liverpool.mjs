import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "Liverpool, England",
  slug: "liverpool-england",
  countryCode: "GB",
  region: "England",
  destinationType: "city",
  lat: "53.408371",
  lng: "-2.991573",
  editorialOverview: "Liverpool sits on the Mersey estuary in north-west England, 40 minutes from Royal Birkdale by Merseyrail and the natural base for anyone extending their Open Championship trip. It is a UNESCO World Heritage waterfront city — the Albert Dock, Beatles history, and Tate Liverpool all within walking distance of each other. The food scene has quietly become one of England's best, with a tight cluster of serious restaurants along the waterfront and in the Georgian Quarter.",
  currency: "GBP",
  language: "English",
  timezone: "Europe/London",
});

console.log("Liverpool destination seeded.");
await client.end();
