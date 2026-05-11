import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { purchases } from "../schema/database.ts";
import { desc } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select().from(purchases).orderBy(desc(purchases.createdAt)).limit(5);
console.log(rows.length === 0 ? "No purchases found" : JSON.stringify(rows, null, 2));
await client.end();
