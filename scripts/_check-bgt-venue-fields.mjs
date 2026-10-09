import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.select({ slug: sportingEvents.slug, venueName: sportingEvents.venueName, venueAddress: sportingEvents.venueAddress, ticketingUrl: sportingEvents.ticketingUrl, packCurrency: sportingEvents.packCurrency, editionYear: sportingEvents.editionYear })
  .from(sportingEvents).where(inArray(sportingEvents.slug, ["new-zealand-in-australia-cricket-2026-27", "border-gavaskar-trophy-2027", "australian-open"]));
console.log(JSON.stringify(rows, null, 2));
await client.end();
