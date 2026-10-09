import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEventArchives } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select().from(sportingEventArchives).where(eq(sportingEventArchives.sportingEventId, "91f298a3-ca22-49c3-9c8e-5a200f0026c9"));
console.log(JSON.stringify(rows, null, 2));
process.exit(0);
