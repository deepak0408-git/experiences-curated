import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerTicketTierCost, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, "qatar-grand-prix"));

const rows = await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, event.id));
for (const r of rows) {
  console.log(JSON.stringify(r));
}
await client.end();
