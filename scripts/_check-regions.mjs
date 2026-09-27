import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";
import { plannerOriginMarkets } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.selectDistinct({ region: plannerOriginMarkets.region }).from(plannerOriginMarkets);
for (const r of rows) console.log(JSON.stringify(r.region));
await client.end();
