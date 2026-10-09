import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const target = process.argv[2]; // "hub_and_spoke" or "classic"
if (!["hub_and_spoke", "classic"].includes(target)) {
  console.error("Usage: node flip-us-open-format.mjs <hub_and_spoke|classic>");
  process.exit(1);
}

const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

const result = await db
  .update(sportingEvents)
  .set({ packFormat: target })
  .where(eq(sportingEvents.id, EVENT_ID))
  .returning({ id: sportingEvents.id, slug: sportingEvents.slug, packFormat: sportingEvents.packFormat });

console.log("Flipped:", result);
process.exit(0);
