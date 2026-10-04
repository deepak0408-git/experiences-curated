import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerOriginMarkets } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select().from(plannerOriginMarkets);
console.log("TOTAL ORIGIN MARKETS:", rows.length);
console.log(rows.map(r => r.city).join(", "));
await client.end();
