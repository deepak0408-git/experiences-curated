import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql, eq, ne } from "drizzle-orm";
import { purchases, sportingEvents } from "./schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { prepare: false });
const db = drizzle(client);

const rows = await db
  .select({
    eventName: sportingEvents.name,
    count: sql`count(*)`,
    total: sql`sum(${purchases.pricePaid})`,
    currency: purchases.currency,
  })
  .from(purchases)
  .leftJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
  .where(ne(purchases.email, "deepak0408@gmail.com"))
  .groupBy(sportingEvents.name, purchases.currency)
  .orderBy(sql`sum(${purchases.pricePaid}) desc`);

console.log(JSON.stringify(rows, null, 2));
process.exit(0);
