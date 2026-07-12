import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "e3e50157-5d58-42ad-b4f9-62ff16a25659"; // Getting to the Hungaroring

const practicalInfo = {
  hours: "Shuttle bus operating hours vary by day: Fri 7:00-13:20, Sat until 15:50, Sun until 14:50 (2025 reference times, confirm current year via f1hungary.com)",
  website: "https://bkk.hu",
  costRange: "M2 metro and HÉV suburban rail require a standard Budapest public transport ticket (~HUF 350-450 per leg); shuttle bus from Kerepes/Gödöllő to the circuit is free with a valid Grand Prix ticket",
  bookingMethod: "No booking required, standard BKK public transport tickets cover the metro and HÉV legs; the shuttle bus is free but requires a valid race ticket to board.",
  reservationsRequired: false,
};

const [result] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Website updated: ${result.title}`);

await client.end();
