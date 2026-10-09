import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerOriginMarkets } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.select().from(plannerOriginMarkets).orderBy(plannerOriginMarkets.city);
console.log(rows.length, "origin markets");
for (const r of rows) console.log(`${r.city}\t${r.iataCode}\t${r.region}`);
await client.end();
