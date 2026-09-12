import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "822cf5bb-86b8-45d1-8247-76cc19470cbf"; // Bar Brahma — Live Samba Since 1948

const practicalInfo = {
  hours: "Daily, 11am-1am. Live music typically from around 8pm.",
  website: "https://www.instagram.com/BarBrahma",
  costRange: "Reported cover charges vary significantly across sources (from roughly R$20 to a much higher figure) — this could not be confirmed to a single reliable number; verify directly at the venue. Drinks and bar food are moderately priced.",
  bookingMethod: "No reservations for the main floor — walk in. Groups of 8+ can book the private dining room separately.",
};

const [row] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title);
console.log(JSON.stringify(row.practicalInfo, null, 2));
await client.end();
