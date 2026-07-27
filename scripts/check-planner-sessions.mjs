import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerSessions } from "../schema/database.ts";
import { desc } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select().from(plannerSessions).orderBy(desc(plannerSessions.createdAt)).limit(5);
console.log(JSON.stringify(rows, null, 2));
await client.end();
