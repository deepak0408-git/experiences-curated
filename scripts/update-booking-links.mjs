import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { like } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Booking.com search URLs — guaranteed to resolve, and will show the correct property.
// Replace with real tracked affiliate links before launch.
const UPDATES = [
  {
    titleMatch: "Rose & Crown",
    links: [{ platform: "Booking.com", url: "https://www.booking.com/searchresults.html?ss=Rose+and+Crown+Wimbledon+Hotel" }],
  },
  {
    titleMatch: "Cannizaro",
    links: [{ platform: "Booking.com", url: "https://www.booking.com/searchresults.html?ss=Hotel+du+Vin+Cannizaro+House+Wimbledon" }],
  },
];

for (const { titleMatch, links } of UPDATES) {
  await db
    .update(experiences)
    .set({ bookingLinks: links })
    .where(like(experiences.title, `%${titleMatch}%`));
  console.log(`Updated booking link for "${titleMatch}"`);
}

console.log("Done.");
await client.end();
