import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { purchases } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const row = await db.select().from(purchases).where(eq(purchases.id, "dafc3155-feae-43a5-81ff-855b435f548d"));
console.log(row.length ? "STILL EXISTS: " + JSON.stringify(row[0]) : "Already deleted");
await client.end();
