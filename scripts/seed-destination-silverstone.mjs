import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(destinations).values({
  name: "Silverstone",
  slug: "silverstone",
  countryCode: "GB",
  region: "Northamptonshire",
  destinationType: "city",
  lat: "52.0786",
  lng: "-1.0169",
  editorialOverview:
    "Silverstone hosts Formula 1's British Grand Prix at Silverstone Circuit, the sport's home since the first-ever World Championship race in 1950. The circuit sits on a former WWII airfield in rural Northamptonshire, with the fast Maggotts-Becketts-Chapel sweep among the most demanding corner sequences on the calendar. Race weekend draws the biggest crowds of any F1 event, with campsites filling the surrounding countryside and a packed Fan Zone alongside the Wing paddock building.",
  currency: "GBP",
  language: "English",
  timezone: "Europe/London",
});

console.log("Silverstone destination seeded.");
await client.end();
