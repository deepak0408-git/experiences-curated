import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Trip Intelligence placeholder destination — created to back a sporting_events
// row for the Saudi Arabian GP 2027 so Trip Intelligence's 24-race ratings
// dataset has a valid FK target. No pack content follows. Airport: JED
// (King Abdulaziz Intl) per destination-creator research, 10 Oct 2026.
await db.insert(destinations).values({
  name: "Jeddah",
  slug: "jeddah",
  countryCode: "SA",
  region: "Makkah Province",
  destinationType: "city",
  lat: "21.4858",
  lng: "39.1925",
  editorialOverview:
    "Jeddah is Saudi Arabia's Red Sea port city and the historic gateway to Mecca, its Corniche circuit run as a floodlit night race along the waterfront. Al-Balad, the UNESCO-listed old town, holds coral-stone merchant houses that predate the kingdom itself. The Red Sea's reef diving sits a short way offshore, with far fewer operators than Gulf cities like Dubai.",
  currency: "SAR",
  language: "Arabic",
  timezone: "Asia/Riyadh",
  nearestAirportIata: "JED",
});

console.log("Jeddah destination seeded.");
await client.end();
